import React, { useEffect, useState } from 'react';
import { Button, Col, Form, FormProps, Row, Select } from 'antd';
import { useHistory } from 'react-router-dom';
import { createOrUpdateKey, IChangedParam, showNotify } from '../utils';
import { addClientApp, updateClientApp } from '@apiServices/clientAppService';
import { getAppCode, saveAppCode } from '@apiServices/sessionService';
import { addSettings } from '@apiServices/settingsService';
import { CLIENT_APPS_PAGES } from '@constants/route';
import Loading from '@components/Loading';
import ContentBlock from '@components/ContentBlock';
import AppFormConstructor from '../FormConstructor';
import SelectTags from '@components/SelectTags';
import PrivacyPolicy from './PrivacyPolicy';
import {
    BACKEND_ERROR_ALREADY_EXIST_ENDING,
    BUSINESS_ROLE_FOR_APPLICATION,
    BUSINESS_ROLE_FOR_APP_PLACEHOLDER,
    CONSENT_FOR_APPLICATION,
    CONSENT_FOR_APP_PLACEHOLDER,
    formElements,
    FORM_MODES,
    keysToString,
    mainInfoElements,
    SETTINGS_TYPES,
    SUCCESS_PROPERTIES_CREATE_DESCRIPTION,
} from '../ClientAppFormConstants';
import { CONSENTS_LABELS } from '@constants/consentsConstants';
import { LoginTypes, LOGIN_TYPES_ENUM } from '@constants/loginTypes';
import { APP_MECHANIC, NOTIFICATION_TYPES } from '@constants/clientAppsConstants';
import { IPropertiesSettings, ISettings } from '../ClientAppContainer';
import { BusinessRoleDto, ConsentDto, SettingDto } from '@types';
import { BUTTON_TEXT } from '@constants/common';
import { compareArrayOfNumbers } from '@utils/helper';
import { FORM_RULES } from '@utils/validators';

import styles from './ClientAppProperties.module.css';

type ClientAppPropertiesProps = {
    businessRoles: React.MutableRefObject<BusinessRoleDto[]>;
    consents: React.MutableRefObject<ConsentDto[]>;
    type: FORM_MODES;
    matchPath: string;
    propertiesSettings: React.MutableRefObject<Partial<ISettings>>;
    updateSettings: (formData: IPropertiesSettings) => void;
    consent: ConsentDto | null;
};

const ClientAppProperties: React.FC<ClientAppPropertiesProps> = ({
    businessRoles: { current: businessRoles },
    consents: { current: consents },
    type,
    matchPath,
    propertiesSettings: { current: propertiesSettings },
    consent,
    updateSettings,
}) => {
    const history = useHistory();
    const [form] = Form.useForm();
    const initialValues = { consentId: consent?.id };
    const consentsFields = consents.map(i => ({ label: `${CONSENTS_LABELS.INFO_TITLE} ${i.version}`, value: i.id }));
    const isEdit = type === FORM_MODES.EDIT;
    const [loading, setLoading] = useState(false);
    const [btnStatus, setBtnStatus] = useState(true);
    const [disabledFields, setDisabledFields] = useState({} as Record<string, string[]>);

    useEffect(() => {
        isEdit && form.setFieldsValue(propertiesSettings);
        updateAuthCheckboxStatus(propertiesSettings.login_types as any);
        updateMechanicCheckboxStatus(propertiesSettings.mechanics as any);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const handleSubmit = async (formData: Record<string, any>) => {
        try {
            let newAppPresents: string | null = null;
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
                    consentId,
                    ...restData
                } = formData;

                const settings: SettingDto[] = [
                    {
                        clientAppCode: code,
                        value: JSON.stringify(mechanics || []),
                        key: 'mechanics',
                    },
                    {
                        clientAppCode: code,
                        value: JSON.stringify(mechanics.includes(APP_MECHANIC.EXPRESS)),
                        key: 'all_presents_selected',
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

                setLoading(true);
                await addClientApp({ code, displayName, isDeleted: false, name, businessRoleIds, consentId });
                await addSettings(settings);

                showNotify(SUCCESS_PROPERTIES_CREATE_DESCRIPTION);
                saveAppCode(code);
            } else {
                const clientAppCode = getAppCode() || '';
                const {
                    displayName,
                    code,
                    name,
                    businessRoleIds,
                    consentId,
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

                const mechanicSetting = changedParams.find(param => param.key === 'mechanics');
                if (mechanicSetting) {
                    const allPresentValue = JSON.parse(mechanicSetting.value).includes(APP_MECHANIC.EXPRESS);
                    const allPresentType = propertiesSettings.all_presents_selected ? SETTINGS_TYPES.EDIT : SETTINGS_TYPES.CREATE;
                    newAppPresents = JSON.stringify(allPresentValue);
                    changedParams.push({
                        clientAppCode: mechanicSetting.clientAppCode,
                        value: JSON.stringify(allPresentValue),
                        key: 'all_presents_selected',
                        type: allPresentType,
                    });
                }

                const { id } = propertiesSettings;
                const requests: Promise<any>[] = [];
                const notifies: (() => void)[] = [];

                if (
                    displayName !== propertiesSettings.displayName ||
                    !compareArrayOfNumbers(businessRoleIds, propertiesSettings.businessRoleIds)
                ) {
                    requests.push(updateClientApp(Number(id), { displayName, code, isDeleted: false, name, businessRoleIds, consentId }));
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

                    requests.length && await Promise.all(requests);

                    notifies.forEach(fn => fn());
                    setBtnStatus(true);
                    updateSettings({ ...formData, all_presents_selected: newAppPresents!, id: id! });
                    setLoading(false);
                } else {
                    showNotify('Настройки не изменились', true);
                    setBtnStatus(true);
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
            return Promise.reject(message);
        }
    };

    const updateAuthCheckboxStatus = (value: LoginTypes[] = []) => {
        if (!value.length) {
            setDisabledFields((fields) => ({ ...fields, notification_types: [], login_types: [] }));
            return;
        }

        if (value.includes(LOGIN_TYPES_ENUM.DIRECT_LINK)) {
            setDisabledFields((fields) => ({
                ...fields,
                notification_types: [NOTIFICATION_TYPES.PUSH],
                login_types: [LOGIN_TYPES_ENUM.PASSWORD, LOGIN_TYPES_ENUM.SBER_REGISTRY],
            }));
            form.setFieldsValue({
                notification_types: [],
                login_types: [LOGIN_TYPES_ENUM.DIRECT_LINK],
            });
            return;
        }

        setDisabledFields((fields) => ({
            ...fields,
            notification_types: [],
            login_types: [LOGIN_TYPES_ENUM.DIRECT_LINK],
        }));
    };

    const updateMechanicCheckboxStatus = (value: APP_MECHANIC[] = []) => {
        const disabledMechanics = value.includes(APP_MECHANIC.EXPRESS)
            ? [APP_MECHANIC.PRESENTS, APP_MECHANIC.ECOSYSTEM, APP_MECHANIC.PRESENTATION, APP_MECHANIC.BUNDLE]
            : value.length
                ? [APP_MECHANIC.EXPRESS]
                : [];
        setDisabledFields((fields) => ({ ...fields, mechanics: disabledMechanics }));
    };

    const handleFieldsChange: FormProps['onFieldsChange'] = (fields) => {
        const [ { name, value } ] = fields;
        if (Array.isArray(name)) {
            name[0] === 'login_types' && updateAuthCheckboxStatus(value);
            name[0] === 'mechanics' && updateMechanicCheckboxStatus(value);
        }
        setBtnStatus(false);
    };

    const handleConsentListClick = async () => {
        const formValues = await form.validateFields();
        await handleSubmit(formValues);
    };

    const handleFinish = async (formData: Record<string, any>) => {
        try {
            await handleSubmit(formData);
            if (!isEdit) {
                history.replace(`${ matchPath }${CLIENT_APPS_PAGES.EDIT_APP}`);
            }
        } catch (e) {
            console.error(e);
        }
    };

    return (
        <div className={styles.clientAppForm}>
            {loading && <Loading />}
            <Form
                className={styles.form}
                initialValues={initialValues}
                form={form}
                onFinish={handleFinish}
                layout="vertical"
                onFieldsChange={handleFieldsChange}
                id={type}
            >
                <ContentBlock maxWidth={950}>
                    {mainInfoElements.map((row, index) => (
                        <AppFormConstructor
                            key={index}
                            row={row}
                            isEdit={isEdit}
                            isCreate={!isEdit}
                        />
                    ))}
                </ContentBlock>
                <ContentBlock maxWidth={950}>
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
                        <Col span={12}>
                            <Form.Item
                                label={CONSENT_FOR_APPLICATION}
                                name="consentId"
                                rules={[ FORM_RULES.REQUIRED ]}
                            >
                                <Select
                                    placeholder={CONSENT_FOR_APP_PLACEHOLDER}
                                    options={consentsFields}
                                />
                            </Form.Item>
                        </Col>
                    </Row>
                </ContentBlock>
                {isEdit && (
                    <ContentBlock>
                        <PrivacyPolicy consent={consent} handleConsentListClick={handleConsentListClick} />
                    </ContentBlock>
                )}
                <div className={styles.buttonGroup}>
                    <Button
                        disabled={btnStatus}
                        type="primary"
                        htmlType="submit"
                    >
                        {!isEdit ? BUTTON_TEXT.ADD : BUTTON_TEXT.SAVE}
                    </Button>
                </div>
            </Form>
        </div>
    );
};

export default ClientAppProperties;
