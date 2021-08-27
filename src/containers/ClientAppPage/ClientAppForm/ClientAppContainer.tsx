import React, { useEffect, useState, useRef } from 'react';
import { message, Radio, RadioChangeEvent } from 'antd';
import { useHistory } from 'react-router-dom';
import Header from '@components/Header';
import ClientAppProperties from './ClientAppProperties';
import MainPageDesign from './MainPageDesign';
import Loading from '@components/Loading';
import { getAppCode } from '@apiServices/sessionService';
import {
    /* addSettings, */
    getAllSettings,
    getSettingsList,
} from '@apiServices/settingsService';
import { getBusinessRoles, getBusinessRolesByClientApp } from '@apiServices/businessRoleService';
import { getClientAppInfo } from '@apiServices/clientAppService';
import { getConsentById } from '@apiServices/consentsService';
import {
    FORM_MODES,
    EDIT_MODE,
    DESIGN_RADIO_TITLE,
    PROPERTIES_RADIO_TITLE,
    designKeysForCheck,
    DEFAULT_DESIGN_SETTINGS,
    TextKeysWithDefaultValues,
} from './ClientAppFormConstants';
import { checkExistDesignSettings } from './utils';
import { requestsWithMinWait } from '@utils/utils';
import { BusinessRoleDto, ConsentDto, ISettingObject } from '@types';
import ROLES from '@constants/roles';

import styles from './ClientAppContainer.module.css';

type IClientAppContainerProps = {
    type: FORM_MODES;
    matchPath: string;
};

export type ISettings = Record<string, string> & ISettingObject & {
    businessRoleIds?: any;
};

export type IDesignSettings = Record<string, string> & ISettingObject;

type IDoPropertiesSettings = {
    id: number;
    displayName: string;
    code: string;
    name: string;
};

export type IPropertiesSettings = ISettings & {
    mechanics?: string[];
    login_types?: string[];
};

const ClientAppContainer: React.FC<IClientAppContainerProps> = ({ type, matchPath }) => {
    const [mode, setMode] = useState(EDIT_MODE.PROPERTIES);
    const history = useHistory();
    const [loading, setLoading] = useState(true);
    const businessRoles = useRef<BusinessRoleDto[]>([]);
    const settingDtoList = useRef<ISettings>({});
    const designSettings = useRef<IDesignSettings>({});
    const propertiesSettings = useRef<IPropertiesSettings>({});
    const consent = useRef<ConsentDto | null>(null);
    const isEdit = type === FORM_MODES.EDIT;
    const isMainPageDesignEdit = mode === EDIT_MODE.DESIGN;

    const handleModeChange = ({ target: { value } }: RadioChangeEvent) => {
        setMode(value);
    };

    useEffect(() => {
        const currentAppCode = getAppCode() || '';

        if (!currentAppCode && isEdit) {
            history.push(matchPath);
            return;
        }
        setLoading(true);

        (async () => {
            try {
                businessRoles.current = (await getBusinessRoles()).list;

                if (!isEdit) {
                    return;
                }
                const requests = Promise.all([
                    getSettingsList(currentAppCode),
                    getClientAppInfo(currentAppCode),
                    getAllSettings(),
                ]);
                const [
                    { settingDtoList: unformattedSettings = [] },
                    clientAppInfo,
                    { settingDtoList: allSettings },
                ] = await requestsWithMinWait(requests, 0);
                const { list: clientAppRoles = [] } = await getBusinessRolesByClientApp(clientAppInfo.id);
                const businessRoleIds = clientAppRoles.map(({ id }) => id) as any;
                const settingsMap = unformattedSettings.reduce<ISettings>((result, item) => ({ ...result, [item.key]: item.value }), { businessRoleIds });
                const referralTokenLifetime = allSettings.find(
                    ({ clientAppCode, userRole, key }) =>
                        !clientAppCode && key === 'token_lifetime' && userRole === ROLES.REFERAL_LINK,
                );

                if (referralTokenLifetime) {
                    settingsMap.referralTokenLifetime = referralTokenLifetime.value;
                }

                settingDtoList.current = settingsMap;
                propertiesSettings.current = doPropertiesSettings(settingsMap, clientAppInfo);

                if (settingsMap.privacy_policy !== undefined && typeof Number(settingsMap.privacy_policy) === 'number') {
                    consent.current = await getConsentById(Number(settingsMap.privacy_policy));
                }

                const settingsForDesign = { ...settingsMap };

                /* Проверяем, есть ли хоть одна настройка, которая не записана в настройках оформления клиентского приложения*/
                if (checkExistDesignSettings(settingsMap)) {
                    // Фильтруем настройки и получаем только дефолтные
                    const defaultDesignSettingsMap = allSettings.reduce<ISettings>((result, { clientAppCode, key, value }) => {
                        if (clientAppCode === null && designKeysForCheck.includes(key)) {
                            return { ...result, [key]: value };
                        }
                        return result;
                    }, {});

                    designKeysForCheck.forEach(key => {
                        // Если дефолтных настроек на поле нет, то нам надо их создать
                        const defaultValue = DEFAULT_DESIGN_SETTINGS[key];
                        const value = Array.isArray(defaultValue) ? JSON.stringify(defaultValue) : defaultValue;
                        if (
                            typeof defaultDesignSettingsMap[key] === 'undefined' &&
                            typeof value !== 'undefined'
                        ) {
                            defaultDesignSettingsMap[key] = value;
                        }
                    });

                    // Проверяем каждое свойство оформления и если у свойства значение undefined или null, то тогда берем значение из дефолтных
                    designKeysForCheck.forEach(key => {
                        if (TextKeysWithDefaultValues.includes(key)) {
                            settingsForDesign[key] = settingsForDesign[key] ?? defaultDesignSettingsMap['home_page_header'];
                        } else {
                            settingsForDesign[key] = settingsForDesign[key] ?? defaultDesignSettingsMap[key];
                        }
                    });
                }

                designSettings.current = settingsForDesign;
            } catch ({ message: error }) {
                message.error(error);
            } finally {
                setLoading(false);
            }
        })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isEdit]);


    const updateDesignSettings = (newParams: ISettings) => {
        designSettings.current = { ...designSettings.current, ...newParams };
        settingDtoList.current = {
            ...settingDtoList.current,
            ...newParams,
        };
    };

    const updatePropertiesSettings = (newParams: IPropertiesSettings) => {
        propertiesSettings.current = { ...(designSettings.current as Record<string, string>), ...newParams };
    };

    const tabRender = isMainPageDesignEdit ? (
        <MainPageDesign
            designSettings={designSettings}
            updateSettings={updateDesignSettings}
            initialData={settingDtoList}
            appDisplayName={propertiesSettings.current.displayName}
        />
    ) : (
        <ClientAppProperties
            type={type}
            matchPath={matchPath}
            propertiesSettings={propertiesSettings}
            updateSettings={updatePropertiesSettings}
            businessRoles={businessRoles}
            consent={consent.current}
        />
    );

    return (
        <div className={styles.clientAppForm}>
            <Header
                menuMode={isEdit}
                buttonBack={!isEdit}
            />
            <div className={styles.header}>
                <Radio.Group
                    className={styles.radio}
                    onChange={handleModeChange}
                    value={mode}
                >
                    <Radio.Button
                        disabled={!isEdit || loading}
                        value={EDIT_MODE.DESIGN}
                    >
                        {DESIGN_RADIO_TITLE}
                    </Radio.Button>
                    <Radio.Button
                        value={EDIT_MODE.PROPERTIES}
                        disabled={loading}
                    >
                        {PROPERTIES_RADIO_TITLE}
                    </Radio.Button>
                </Radio.Group>
                <div className={styles.title}>{mode}</div>
            </div>
            {loading ? <Loading className={styles.loading} /> : tabRender}
        </div>
    );
};

export default ClientAppContainer;


export function doPropertiesSettings(settings: ISettings, { id, displayName, code, name }: IDoPropertiesSettings): IPropertiesSettings {
    const {
        mechanics,
        game_mechanics,
        login_types,
        notification_types,
        ...restSettings
    } = settings;
    const appMechanics = mechanics && JSON.parse(mechanics);
    const gameMechanics = game_mechanics && JSON.parse(game_mechanics);
    const loginTypes = login_types && JSON.parse(login_types);
    const notificationTypes = notification_types && JSON.parse(notification_types);

    return {
        id: id as unknown as string,
        code,
        name,
        displayName,
        mechanics: appMechanics,
        game_mechanics: gameMechanics,
        login_types: loginTypes,
        notification_types: notificationTypes,
        ...restSettings,
    };
}
