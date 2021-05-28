/* eslint-disable no-unused-vars */
import React, { useEffect, useState, useRef } from 'react';
import cn from 'classnames';
import { message, Radio } from 'antd';
import { useHistory } from 'react-router-dom';
import Header from '../../../components/Header/Header';
import ClientAppProperties from './ClientAppProperties/ClientAppProperties';
import MainPageDesign from './MainPageDesign/MainPageDesign';
import { getAppCode } from '../../../api/services/sessionService';
import { addSettings, getAllSettings, getSettingsList, getStaticUrl } from '../../../api/services/settingsService';
import { getClientAppInfo } from '../../../api/services/clientAppService';
import {
    FORM_MODES,
    EDIT_MODE,
    DESIGN_RADIO_TITLE,
    PROPERTIES_RADIO_TITLE,
    designKeysForCheck,
    DEFAULT_DESIGN_SETTINGS,
    TextKeysWithDefaultValues,
    BANNER_KEYS,
} from './ClientAppFormConstants';
import { checkExistDesignSettings } from './utils';
import { getConsentById } from '../../../api/services/consentsService';

import styles from './ClientAppContainer.module.css';

import { ReactComponent as LoadingSpinner } from '../../../static/images/loading-spinner.svg';

const ClientAppContainer = ({ type, matchPath }) => {

    const [mode, setMode] = useState(EDIT_MODE.PROPERTIES);
    const history = useHistory();
    const [loading, setLoading] = useState(true);
    const settingDtoList = useRef({});
    const designSettings = useRef({});
    const propertiesSettings = useRef({});
    const consent = useRef(null);
    const isEdit = type === FORM_MODES.EDIT;
    const isMainPageDesignEdit = mode === EDIT_MODE.DESIGN;

    const handleModeChange = ({ target: { value } }) => {
        setMode(value);
    };

    useEffect(() => {
        const currentAppCode = getAppCode();

        if (!currentAppCode && isEdit) {
            history.push(matchPath);
            return;
        }
        setLoading(true);
        (async () => {
            try {
                if (!isEdit) {
                    return;
                }
                const { settingDtoList: unformattedSettings = [] } = await getSettingsList(currentAppCode);
                const clientAppInfo = await getClientAppInfo(currentAppCode);
                const settingsMap = unformattedSettings.reduce((result, item) => ({ ...result, [item.key]: item.value }), {});

                settingDtoList.current = settingsMap;
                propertiesSettings.current = doPropertiesSettings(settingsMap, clientAppInfo);

                if (typeof Number(settingsMap.privacy_policy) === 'number') {
                    consent.current = await getConsentById(settingsMap.privacy_policy);
                }

                const settingsForDesign = { ...settingsMap };

                /* Проверяем, есть ли хоть одна настройка, которая не записана в настройках оформления клиентского приложения*/
                /* TODO: раскомментировать условие когда будет добавляться функционал для оформления витрин (темы) WDZO-1393
                if (checkExistDesignSettings(settingsMap)) {
                    const { settingDtoList: allSettings = [] } = await getAllSettings();

                    // Фильтруем настройки и получаем только дефолтные
                    const defaultDesignSettingsMap = allSettings.reduce((result, { clientAppCode, key, value }) => {
                        if (clientAppCode === null && designKeysForCheck.includes(key)) {
                            return { ...result, [key]: value };
                        }
                        return result;
                    }, {});

                    const defaultSettingsArr = [];

                    designKeysForCheck.forEach(key => {
                        // Если дефолтных настроек на поле нет, то нам надо их создать
                        const defaultValue = DEFAULT_DESIGN_SETTINGS[key];
                        const value = Array.isArray(defaultValue) ? JSON.stringify(defaultValue) : defaultValue;
                        if (
                            typeof defaultDesignSettingsMap[key] === 'undefined' &&
                            typeof value !== 'undefined'
                        ) {
                            defaultDesignSettingsMap[key] = value;
                            defaultSettingsArr.push({ key, value });
                        }
                    });

                    defaultSettingsArr.length && await addSettings(defaultSettingsArr);

                    // Проверяем каждое свойство оформления и если у свойства значение undefined или null, то тогда берем значение из дефолтных
                    designKeysForCheck.forEach(key => {
                        if (!TextKeysWithDefaultValues.includes(key)) {
                            settingsForDesign[key] = settingsForDesign[key] ?? defaultDesignSettingsMap[key];
                        } else {
                            settingsForDesign[key] = settingsForDesign[key] ?? defaultDesignSettingsMap['home_page_header'];
                        }
                    });
                }

                designSettings.current = doDesignSettings(settingsForDesign);
                */
            } catch ({ message: error }) {
                message.error(error);
            } finally {
                setLoading(false);
            }
        })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isEdit]);

    const updateDesignSettings = (newParams) => {
        const currentHomePageTheme = designSettings.current.home_page_theme;
        const home_page_theme = BANNER_KEYS.reduce(
            (result, key) => ({
                ...result,
                [key]: newParams[key] ?? currentHomePageTheme[key],
            }),
            { ...currentHomePageTheme }
        );

        designSettings.current = { ...designSettings.current, ...newParams, home_page_theme };
        settingDtoList.current = {
            ...settingDtoList.current,
            ...newParams,
        };
    };

    const updatePropertiesSettings = (newParams) => {
        propertiesSettings.current = { ...designSettings.current, ...newParams };
    };

    const tabRender = isMainPageDesignEdit ? (
        <MainPageDesign
            designSettings={ designSettings }
            updateSettings={ updateDesignSettings }
            initialData={ settingDtoList }
        />
    ) : (
        <ClientAppProperties
            type={ type }
            matchPath={ matchPath }
            propertiesSettings={ propertiesSettings }
            updateSettings={ updatePropertiesSettings }
            consent={ consent.current }
        />
    );

    return (
        <div className={ styles.clientAppForm }>
            <Header menuMode={ isEdit } buttonBack={ !isEdit } />
            <div className={ styles.header }>
                { /* <Radio.Group className={ styles.radio } onChange={ handleModeChange } value={ mode }>
                    <Radio.Button
                        disabled={ !isEdit || loading }
                        className={ cn({ [styles.active]: isMainPageDesignEdit }) }
                        value={ EDIT_MODE.DESIGN }
                    >
                        { DESIGN_RADIO_TITLE }
                    </Radio.Button>
                    <Radio.Button
                        className={ cn({ [styles.active]: !isMainPageDesignEdit }) }
                        value={ EDIT_MODE.PROPERTIES }
                        disabled={ loading }
                    >
                        { PROPERTIES_RADIO_TITLE }
                    </Radio.Button>
                </Radio.Group> */ }
                <div className={ styles.title }>{ mode }</div>
            </div>
            { loading ? <LoadingSpinner /> : tabRender }
        </div>
    );
};

export default ClientAppContainer;

function doDesignSettings (settings) {
    const { vitrina_theme, gradient, design_elements: designElementsString, ...restSettings } = settings;
    const design_elements = designElementsString && JSON.parse(designElementsString);
    const home_page_theme = { gradient, design_elements, vitrina_theme };

    return { home_page_theme, ...restSettings };
}

export function doPropertiesSettings (settings, { id, displayName, code, name }) {
    const url = getStaticUrl();
    settings.installation_url = settings.installation_url && settings.installation_url.replace(url, '');
    settings.usage_url = settings.usage_url && settings.usage_url.replace(url, '');

    const { mechanics, login_types, notification_types, ...restSettings } = settings;
    const mechanicsCheckBox = mechanics && JSON.parse(mechanics);
    const loginCheckBoxes = login_types && JSON.parse(login_types);
    const notificationTypesCheckBoxes = notification_types && JSON.parse(notification_types);

    return {
        id,
        code,
        name,
        displayName,
        mechanics: mechanicsCheckBox,
        login_types: loginCheckBoxes,
        notification_types: notificationTypesCheckBoxes,
        ...restSettings
    };
}
