import React, { useEffect, useState } from 'react';
import { Button, Col, Form, FormProps, Row } from 'antd';
import { useHistory } from 'react-router-dom';
import { createOrUpdateKey, IChangedParam, showNotify } from '../utils';
import { addClientApp, updateClientApp } from '@apiServices/clientAppService';
import { getAppCode, saveAppCode } from '@apiServices/sessionService';
import { addSettings } from '@apiServices/settingsService';
import { CLIENT_APPS_PAGES } from '@constants/route';
import Loading from '@components/Loading';
import AppFormConstructor from '../FormConstructor';
import SelectTags from '@components/SelectTags';
import PrivacyPolicy from './PrivacyPolicy';
import {
    ADD_BUTTON_TITLE,
    BACKEND_ERROR_ALREADY_EXIST_ENDING,
    BUSINESS_ROLE_FOR_APPLICATION,
    BUSINESS_ROLE_FOR_APP_PLACEHOLDER,
    EDIT_BUTTON_LABEL,
    formElements,
    FORM_MODES,
    keysToString,
    mainInfoElements,
    SETTINGS_TYPES,
    SUCCESS_PROPERTIES_CREATE_DESCRIPTION,
} from '../ClientAppFormConstants';
import { LoginTypes, LOGIN_TYPES_ENUM } from '@constants/loginTypes';
import { NOTIFICATION_TYPES } from '@constants/clientAppsConstants';
import { IPropertiesSettings, ISettings } from '../ClientAppContainer';
import { BusinessRoleDto, ConsentDto, SettingDto } from '@types';
import { compareArrayOfNumbers } from '@utils/helper';

import styles from './ClientAppProperties.module.css';

type ClientAppPropertiesProps = {
    businessRoles: React.MutableRefObject<BusinessRoleDto[]>;
    type: FORM_MODES;
    matchPath: string;
    propertiesSettings: React.MutableRefObject<Partial<ISettings>>;
    updateSettings: (formData: IPropertiesSettings) => void;
    consent: ConsentDto | null;
};

const ClientAppProperties: React.FC<ClientAppPropertiesProps> = ({
    businessRoles: { current: businessRoles },
    type,
    matchPath,
    propertiesSettings: { current: propertiesSettings },
    consent,
    updateSettings,
}) => {
    const history = useHistory();
    const [form] = Form.useForm();
    const isEdit = type === FORM_MODES.EDIT;
    const [loading, setLoading] = useState(false);
    const [btnStatus, setBtnStatus] = useState(true);
    const [disabledFields, setDisabledFields] = useState({} as Record<string, string[]>);

    useEffect(() => {
        isEdit && form.setFieldsValue(propertiesSettings);
        updateCheckboxStatus(propertiesSettings.login_types as any);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const handleSubmit = async (formData: Record<string, any>) => {
        try {
            if (!isEdit) {
                const {
                    code,
                    name,
                    mechanics,
                    game_mechanics,
                    displayName,
                    login_types,
                    notification_types,
                    businessRoleIds,
                    ...restData
                } = formData;

                setLoading(true);
                await addClientApp({ code, displayName, isDeleted: false, name, businessRoleIds });

                const settings: SettingDto[] = [
                    {
                        clientAppCode: code,
                        value: JSON.stringify(mechanics || []),
                        key: 'mechanics',
                    },
                    {
                        clientAppCode: code,
                        value: JSON.stringify(game_mechanics || []),
                        key: 'game_mechanics',
                    },
                    {
                        clientAppCode: code,
                        value: JSON.stringify(login_types || []),
                        key: 'login_types',
                    },
                    {
                        clientAppCode: code,
                        value: JSON.stringify(notification_types || []),
                        key: 'notification_types',
                    },
                ];
                Object.keys(restData).forEach((key) => {
                    const value = restData[key];
                    value && settings.push({ clientAppCode: code, value, key });
                });

                await addSettings(settings);
                showNotify(SUCCESS_PROPERTIES_CREATE_DESCRIPTION);
                saveAppCode(code);
                history.replace(`${ matchPath }${CLIENT_APPS_PAGES.EDIT_APP}`);
            } else {
                const clientAppCode = getAppCode() || '';
                const {
                    displayName,
                    code,
                    name,
                    businessRoleIds,
                    ...restData
                } = formData;
                const changedParams = Object.keys(restData).reduce<IChangedParam[]>((result, key) => {
                    const valueFromServer = keysToString.includes(key)
                        ? JSON.stringify(propertiesSettings[key])
                        : propertiesSettings[key];
                    const valueInForm = keysToString.includes(key)
                        ? JSON.stringify(restData[key])
                        : restData[key];
                    const commonObj = { clientAppCode, key, value: valueInForm };

                    if (valueFromServer === undefined && valueInForm) {
                        return [...result, { ...commonObj, type: SETTINGS_TYPES.CREATE }];
                    }

                    if ((!valueFromServer && valueInForm) || (valueFromServer && valueInForm !== valueFromServer)) {
                        return [...result, { ...commonObj, type: SETTINGS_TYPES.EDIT }];
                    }
                    return result;
                }, []);

                const { id } = propertiesSettings;
                const requests: Promise<any>[] = [];
                const notifies: (() => void)[] = [];

                if (
                    displayName !== propertiesSettings.displayName ||
                    !compareArrayOfNumbers(businessRoleIds, propertiesSettings.businessRoleIds)
                ) {
                    requests.push(updateClientApp(id as any, { displayName, code, isDeleted: false, name, businessRoleIds }));
                    if (displayName !== propertiesSettings.displayName) {
                        notifies.push(() => showNotify(
                            <span>
                                Отображаемое имя витрины изменено с <b>&quot;{propertiesSettings.displayName}&quot;</b> на <b>&quot;{displayName}&quot;</b>
                            </span>,
                        ));
                    }

                    if (!compareArrayOfNumbers(businessRoleIds, propertiesSettings.businessRoleIds)) {
                        notifies.push(() => showNotify(
                            <span>
                                Бизнес-роли для витрины <b>&quot;{propertiesSettings.displayName}&quot;</b> успешно обновлены
                            </span>,
                        ));
                    }
                }

                if (changedParams.length) {
                    requests.push(createOrUpdateKey(changedParams));
                    notifies.unshift(() => showNotify(
                        <span>
                            Настройки для витрины <b>&quot;{displayName}&quot;</b> обновлены
                        </span>,
                    ));
                }

                if (requests.length) {
                    setLoading(true);
                    await Promise.all(requests);

                    notifies.forEach(fn => fn());
                    setBtnStatus(true);
                    updateSettings({ ...formData, id: id! });
                    setLoading(false);
                }
            }
        } catch ({ message }) {
            const messageToShow = message.endsWith(BACKEND_ERROR_ALREADY_EXIST_ENDING) ? (
                <span>
                    Клиентское приложение с кодом <b>{formData.code}</b> уже существует
                </span>
            ) : message;
            showNotify(messageToShow, true);
            setLoading(false);
        }
    };

    const updateCheckboxStatus = (value: LoginTypes[] = []) => {
        if (!value.length) {
            setDisabledFields({});
            return;
        }

        if (value.includes(LOGIN_TYPES_ENUM.DIRECT_LINK)) {
            setDisabledFields({
                notification_types: [NOTIFICATION_TYPES.PUSH],
                login_types: [LOGIN_TYPES_ENUM.PASSWORD, LOGIN_TYPES_ENUM.SBER_REGISTRY],
            });
            form.setFieldsValue({
                notification_types: [],
                login_types: [LOGIN_TYPES_ENUM.DIRECT_LINK],
            });
            return;
        }

        setDisabledFields({
            login_types: [LOGIN_TYPES_ENUM.DIRECT_LINK],
        });
    };

    const handleFieldsChange: FormProps['onFieldsChange'] = (fields) => {
        const [ { name, value } ] = fields;
        if (Array.isArray(name) && name[0] === 'login_types') {
            updateCheckboxStatus(value);
        }
        setBtnStatus(false);
    };

    return (
        <div className={styles.clientAppForm}>
            {loading && <Loading />}
            <Form
                className={styles.form}
                form={form}
                onFinish={handleSubmit}
                layout="vertical"
                onFieldsChange={handleFieldsChange}
                id={type}
            >
                <div className={styles.container}>
                    {mainInfoElements.map((row, index) => (
                        <AppFormConstructor
                            key={index}
                            row={row}
                            isEdit={isEdit}
                            isCreate={!isEdit}
                        />
                    ))}
                </div>
                <div className={styles.container}>
                    {formElements.map((row, index) => (
                        <AppFormConstructor
                            key={index}
                            row={row}
                            disabledFields={disabledFields}
                            isCreate={!isEdit}
                        />
                    ))}
                    <Row gutter={24} className={styles.row}>
                        <Col span={12}>
                            <Form.Item
                                label={BUSINESS_ROLE_FOR_APPLICATION}
                                name="businessRoleIds"
                                normalize={(catArr) => catArr.map(Number)}
                            >
                                <SelectTags
                                    data={businessRoles}
                                    idKey="id"
                                    placeholder={BUSINESS_ROLE_FOR_APP_PLACEHOLDER}
                                />
                            </Form.Item>
                        </Col>
                    </Row>
                </div>
                <div className={styles.container}>
                    <PrivacyPolicy consent={consent} />
                </div>
                <div className={styles.buttonGroup}>
                    <Button
                        disabled={btnStatus}
                        type="primary"
                        htmlType="submit"
                    >
                        {!isEdit ? ADD_BUTTON_TITLE : EDIT_BUTTON_LABEL}
                    </Button>
                </div>
            </Form>
        </div>
    );
};

export default ClientAppProperties;
