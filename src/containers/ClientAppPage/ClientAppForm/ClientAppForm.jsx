import React, { useEffect, useState } from 'react';
import cn from 'classnames';
import { Button, Checkbox, Col, Form, Input, message, Row, Skeleton } from 'antd';
import { useHistory } from 'react-router-dom';
import { addClientApp, getClientAppList } from '../../../api/services/clientAppService';
import { getAppCode } from '../../../api/services/sessionService';
import { addSetting, getSettingsList, getStaticUrl, updateSettingsList } from '../../../api/services/settingsService';
import {
    ADD_BUTTON_TITLE,
    CANCEL_BUTTON_TITLE,
    CREATE_APP_TITLE,
    EDIT_BUTTON_LABEL,
    formElements,
    FORM_MODES,
    FORM_TYPES,
    mainInfoElements,
    PROPERTIES_TITLE,
    SETTINGS_TYPES,
} from './ClientAppFormConstants';
import Header from '../../../components/Header/Header';

import { ReactComponent as Cross } from '../../../static/images/cross.svg';
import { ReactComponent as LoadingSpinner } from '../../../static/images/loading-spinner.svg';

import styles from './ClientAppForm.module.css';

const ClientAppForm = ({ type, matchPath }) => {
    const history = useHistory();
    const [form] = Form.useForm();
    const [initialData, setInitialData] = useState({});
    const isEdit = type === FORM_MODES.EDIT;
    const [loading, setLoading] = useState(isEdit);
    // const { state: { appState } = {} } = useLocation();

    useEffect(() => {
        const currentAppCode = getAppCode();

        if (!currentAppCode && isEdit) {
            history.push(matchPath);
            return;
        }

        // if (appState) {
        //     const { code, name, displayName } = appState;
        //     return;
        // }
        //TODO получать данные из location state, когда будут приходить правильные

        if (isEdit) {
            (async () => {
                const { clientApplicationDtoList = [] } = await getClientAppList();
                const { code, name, displayName } = clientApplicationDtoList.find(
                    ({ code }) => currentAppCode === code
                );
                const { settingDtoList: unformattedSettings = [] } = await getSettingsList(currentAppCode);
                const settings = unformattedSettings.reduce(
                    (result, item) => ({ ...result, [item.key]: item.value }),
                    {}
                );

                const url = getStaticUrl();
                settings.installation_url = settings.installation_url && settings.installation_url.replace(url, '');
                settings.usage_url = settings.usage_url && settings.usage_url.replace(url, '');

                const { mechanics = '[]', ...restSettings } = settings;
                const mechanicsCheckBox = JSON.parse(mechanics);

                setInitialData({ code, name, displayName, mechanics: mechanicsCheckBox, ...restSettings });
                setLoading(false);
            })();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const createOrUpdateKey = async (changedParams) => {
        const updateSettings = [];
        const addSettings = [];

        changedParams.forEach(({ type, ...params }) => {
            type === SETTINGS_TYPES.EDIT ? updateSettings.push(params) : addSettings.push(params);
        });
        updateSettings.length && (await updateSettingsList(updateSettings));

        if (addSettings.length) {
            const addKeysPromises = addSettings.map(addSetting);
            await Promise.all(addKeysPromises);
        }
    };

    const handleSubmit = async (formData) => {
        setLoading(true);

        try {
            if (!isEdit) {
                const { code, name, mechanics, displayName, ...restData } = formData;

                await addClientApp({ code, displayName, isDeleted: false, name });

                const settings = [{
                    clientAppCode: code,
                    value: JSON.stringify(mechanics),
                    key: 'mechanics',
                }];
                Object.keys(restData).forEach((key) => {
                    const value = restData[key];
                    value && settings.push({ clientAppCode: code, value, key });
                });

                await Promise.all(settings.map(addSetting));
            } else {
                const clientAppCode = getAppCode();
                const changedParams = Object.keys(formData).reduce((result, key) => {
                    const valueFromServer = key === 'mechanics' ? JSON.stringify(initialData[key]) : initialData[key];
                    const valueInForm = key === 'mechanics' ? JSON.stringify(formData[key]) : formData[key];

                    if (valueFromServer === undefined && valueInForm) {
                        return [...result, { clientAppCode, key, value: valueInForm, type: SETTINGS_TYPES.CREATE }];
                    }

                    if ((!valueFromServer && valueInForm) || (valueFromServer && valueInForm !== valueFromServer)) {
                        return [...result, { clientAppCode, key, value: valueInForm, type: SETTINGS_TYPES.EDIT }];
                    }

                    return result;
                }, []);

                await createOrUpdateKey(changedParams);
            }

            history.push(matchPath);
        } catch (e) {
            setLoading(false);
            message.error(e.message);
        }
    };

    const handleClear = (fieldName) => {
        form.setFieldsValue({ [fieldName]: '' });
    };

    const handleCancel = () => {
        history.push(matchPath);
    };

    const title = !isEdit ? CREATE_APP_TITLE : initialData.name;

    return (
        <div className={ styles.clientAppForm }>
            <Header menuMode={ isEdit } buttonBack={ !isEdit } />
            <div className={ styles.header }>
                <div className={ styles.title }>
                    { !loading ? title : (
                        <Skeleton.Input active className={ styles.skeletonTitle } />
                    ) }
                </div>
                <div className={ styles.buttonGroup }>
                    <Button onClick={ handleCancel }>{ CANCEL_BUTTON_TITLE }</Button>
                    <Button
                        disabled={ loading }
                        type="primary"
                        onClick={ form.submit }
                    >
                        { !isEdit ? ADD_BUTTON_TITLE : EDIT_BUTTON_LABEL }
                    </Button>
                </div>
            </div>
            { loading ? (
                <div className={ styles.loadingContainer }>
                    <div className={ styles.loading }>
                        <LoadingSpinner />
                    </div>
                </div>
            ) : (
                <Form
                    className={ styles.form }
                    form={ form }
                    initialValues={ initialData }
                    onFinish={ handleSubmit }
                    layout="vertical"
                    id={ type }
                >
                    <div className={ styles.container }>
                        { mainInfoElements.map((row, index) => (
                            <Row
                                className={ styles.row }
                                key={ index }
                                gutter={ [24] }
                            >
                                { row.map(({ label, span, rules, name, type, options, placeholder }) => (
                                    <Col
                                        className={ styles.colFlex }
                                        key={ label }
                                        span={ span }
                                    >
                                        <Form.Item
                                            rules={ rules }
                                            required={ !isEdit }
                                            name={ name }
                                            className={ cn({ [styles.labelBold]: isEdit }) }
                                            label={ label }
                                        >
                                            <FormInputByType
                                                inputType={ type }
                                                options={ options }
                                                placeholder={ placeholder }
                                                name={ name }
                                                isEdit={ isEdit }
                                                onClear={ handleClear }
                                            />
                                        </Form.Item>
                                    </Col>
                                )) }
                            </Row>
                        )) }
                    </div>
                    <div className={ styles.subTitle }>{ PROPERTIES_TITLE }</div>
                    <div className={ styles.container }>
                        { formElements.map((row, index) => (
                            <Row className={ styles.propertiesRow } key={ index } gutter={ [24] }>
                                { row.map(({ label, span, rules, name, type, options, placeholder, maxLen }) => (
                                    <Col
                                        className={ styles.colFlex }
                                        key={ label }
                                        span={ span }
                                    >
                                        <Form.Item
                                            rules={ rules }
                                            name={ name }
                                            label={ label }
                                            validateFirst
                                        >
                                            <FormInputByType
                                                inputType={ type }
                                                options={ options }
                                                placeholder={ placeholder }
                                                name={ name }
                                                maxLen={ maxLen }
                                                isEdit={ isEdit }
                                                onClear={ handleClear }
                                            />
                                        </Form.Item>
                                    </Col>
                                )) }
                            </Row>
                        )) }
                    </div>
                </Form>
            ) }
        </div>
    );
};

export default ClientAppForm;

function FormInputByType({
    isEdit,
    inputType,
    options,
    placeholder,
    name,
    maxLen,
    onClear,
    value,
    ...restProps
}) {
    const onClearClick = () => onClear(name);

    switch (inputType) {
        case FORM_TYPES.CHECKBOX_GROUP:
            return <Checkbox.Group options={ options } value={ value } { ...restProps } />;
        case FORM_TYPES.TEXT_BLOCK:
            return <Input.TextArea value={ value } { ...restProps } />;
        case FORM_TYPES.MAIN_INFO_INPUT:
            if (!isEdit) {
                return (
                    <Input
                        placeholder={ placeholder }
                        suffix={ <Cross className={ styles.cross } onClick={ onClearClick } /> }
                        value={ value }
                        { ...restProps }
                    />
                );
            }
            return <div className={ styles.infoText }>{ value }</div>;
        default:
            return (
                <Input
                    maxLength={ maxLen }
                    placeholder={ placeholder }
                    suffix={ <Cross className={ styles.cross } onClick={ onClearClick } /> }
                    value={ value }
                    { ...restProps }
                />
            );
    }
}