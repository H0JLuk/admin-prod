import React, { useEffect, useState } from 'react';
import { Button, Form } from 'antd';
import { useHistory } from 'react-router-dom';
import { createOrUpdateKey, showNotify } from '../utils';
import { addClientApp, updateClientApp } from '../../../../api/services/clientAppService';
import { getAppCode, saveAppCode } from '../../../../api/services/sessionService';
import { addSettings } from '../../../../api/services/settingsService';
import { CLIENT_APPS_PAGES } from '../../../../constants/route';
import {
    ADD_BUTTON_TITLE,
    BACKEND_ERROR_ALREADY_EXIST_ENDING,
    EDIT_BUTTON_LABEL,
    formElements,
    FORM_MODES,
    keysToString,
    mainInfoElements,
    SETTINGS_TYPES,
    SUCCESS_PROPERTIES_CREATE_DESCRIPTION,
} from '../ClientAppFormConstants';
import AppFormConstructor from '../FormConstructor/FormConstructor';
import Loading from '../../../../components/Loading/Loading';
import PrivacyPolicy from './PrivacyPolicy/PrivacyPolicy';

import styles from './ClientAppProperties.module.css';

const ClientAppProperties = ({
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

    useEffect(() => {
        isEdit && form.setFieldsValue(propertiesSettings);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const handleSubmit = async (formData) => {
        try {
            if (!isEdit) {
                const {
                    code,
                    name,
                    mechanics,
                    displayName,
                    login_types,
                    notification_types,
                    ...restData
                } = formData;

                setLoading(true);
                await addClientApp({ code, displayName, isDeleted: false, name });

                const settings = [
                    {
                        clientAppCode: code,
                        value: JSON.stringify(mechanics || []),
                        key: 'mechanics',
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
                const clientAppCode = getAppCode();
                const { displayName, code, name, ...restData } = formData;
                const changedParams = Object.keys(restData).reduce((result, key) => {
                    const valueFromServer = keysToString.includes(key)
                        ? JSON.stringify(propertiesSettings[key])
                        : propertiesSettings[key];
                    const valueInForm = keysToString.includes(key)
                        ? JSON.stringify(restData[key])
                        : restData[key];

                    if (valueFromServer === undefined && valueInForm) {
                        return [...result, { clientAppCode, key, value: valueInForm, type: SETTINGS_TYPES.CREATE }];
                    }

                    if ((!valueFromServer && valueInForm) || (valueFromServer && valueInForm !== valueFromServer)) {
                        return [...result, { clientAppCode, key, value: valueInForm, type: SETTINGS_TYPES.EDIT }];
                    }

                    return result;
                }, []);

                const { id } = propertiesSettings;
                const requests = [];
                const notifies = [];

                if (displayName !== propertiesSettings.displayName) {
                    requests.push(updateClientApp(id, { displayName, code, isDeleted: false, name }));
                    notifies.push(() => showNotify(
                        <span>
                            Отображаемое имя витрины изменено с <b>&quot;{ propertiesSettings.displayName }&quot;</b> на <b>&quot;{ displayName }&quot;</b>
                        </span>
                    ));
                }

                if (changedParams.length) {
                    requests.push(createOrUpdateKey(changedParams));
                    notifies.unshift(() => showNotify(
                        <span>
                            Настройки для витрины <b>&quot;{ displayName }&quot;</b> обновлены
                        </span>
                    ));
                }

                if (requests.length) {
                    setLoading(true);
                    await Promise.all(requests);

                    notifies.forEach(fn => fn());
                    setBtnStatus(true);
                    updateSettings({ ...formData, id });
                }
            }

        } catch ({ message }) {
            const messageToShow = message.endsWith(BACKEND_ERROR_ALREADY_EXIST_ENDING)
                ? `Клиентское приложение с кодом ${formData.code} уже существует `
                : message;
            showNotify(messageToShow, true);
        }
        setLoading(false);
    };

    const enableBtn = () => {
        setBtnStatus(false);
    };

    return (
        <div className={ styles.clientAppForm }>
            { loading && <Loading /> }
            <Form
                className={ styles.form }
                form={ form }
                onFinish={ handleSubmit }
                layout="vertical"
                onFieldsChange={ enableBtn }
                id={ type }
            >
                <div className={ styles.container }>
                    { mainInfoElements.map((row, index) => (
                        <AppFormConstructor
                            key={ index }
                            row={ row }
                            isEdit={ isEdit }
                        />
                    )) }
                </div>
                <div className={ styles.container }>
                    { formElements.map((row, index) => (
                        <AppFormConstructor key={ index } row={ row } />
                    )) }
                </div>
                <div className={ styles.container }>
                    <PrivacyPolicy consent={ consent } />
                </div>
                <div className={ styles.buttonGroup }>
                    <Button
                        disabled={ btnStatus }
                        type="primary"
                        htmlType="submit"
                    >
                        { !isEdit ? ADD_BUTTON_TITLE : EDIT_BUTTON_LABEL }
                    </Button>
                </div>
            </Form>
        </div>
    );
};

export default ClientAppProperties;
