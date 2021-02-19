import React, { useCallback, useEffect, useRef, useState } from 'react';
import { Col, Form, Row, Input, Select, Button } from 'antd';
import { useHistory, useLocation } from 'react-router-dom';
import { addApplication, addDzo, deleteApp, deleteDzo, updateApp } from '../../../api/services/dzoService';
import { confirmModal } from '../../../utils/utils';
import Header from '../../../components/Header/Header';
import { URL_REGEXP } from '../../../constants/common';

import styles from './DzoForm.module.css';

import { ReactComponent as LoadingSpinner } from '../../../static/images/loading-spinner.svg';

const NEW_DZO_TITLE = 'Новое ДЗО';
const CANCEL_BUTTON_TITLE = 'Отменить';
const VALIDATION_TEXT = 'Заполните обязательное поле';
const ADD_BUTTON_TITLE = 'Добавить';
const SAVE_BUTTON_TITLE = 'Сохранить';
const URL_VALIDATION_TEXT = 'Введите url в формате http://site.ru';
const DELETE_BUTTON_LABEL = 'Удалить';
const DELETE_CONFIRMATION_MODAL_TITLE = 'Вы действительно хотите удалить ДЗО';
const QR_LINK_PLACEHOLDER = 'Введите ссылку';
const QR_LINK_LABEL = 'Ссылка для QR-кода';
const APP_TYPE_LABEL = 'Тип приложения';
const APP_TYPE_PLACEHOLDER = 'Выберите приложение';
const APP_TYPE_ALREADY_SELECTED = 'Нельзя выбрать два одинаковых приложения';
const DZO_CODE_NOT_UNIQUE = 'ДЗО с таким кодом уже есть!';

const DZO_APPLICATION_LIST_NAME = 'applicationList';

const TYPES = {
    INPUT: 'input',
    INPUT_WEB: 'inputWeb',
    TEXT_BLOCK: 'textBlock',
    SELECT: 'select',
};

const RULES = {
    STANDARD: [],
    STANDARD_REQUIRED: [{ required: true, message: VALIDATION_TEXT, validateTrigger: 'onSubmit' }],
};

const APP_OPTIONS = [
    { label: 'OTHER', value: 'OTHER' },
    { label: 'IOS', value: 'IOS' },
    { label: 'ANDROID', value: 'ANDROID' },
];

const formElements = [
    [
        {
            label: 'Название',
            type: TYPES.INPUT,
            rules: RULES.STANDARD_REQUIRED,
            name: 'dzoName',
            placeholder: 'Название',
        },
        {
            label: 'Код',
            type: TYPES.INPUT,
            name: 'dzoCode',
            placeholder: 'Код',
        },
    ],
    [
        {
            label: 'Описание ДЗО',
            type: TYPES.TEXT_BLOCK,
            rules: RULES.STANDARD,
            name: 'description',
            placeholder: 'Описание ДЗО',
        },
    ],
];

const defaultDzo = {
    dzoCode: '',
    description: '',
    dzoName: '',
    applicationList: [{ applicationType: APP_OPTIONS[0].value, applicationUrl: '' }],
};

const defaultApp = { applicationType: undefined, applicationUrl: '' };

function getInitialValue({ dzoName, dzoCode, description, applicationList, dzoId } = {}) {
    const appList = (applicationList || []).map((el) => ({ ...el, applicationUrl: decodeURI(el.applicationUrl) }));

    return {
        ...defaultDzo,
        dzoName,
        dzoCode,
        description,
        dzoId,
        applicationList: appList.length < APP_OPTIONS.length ? [...appList, defaultApp] : appList,
    };
}

const DzoForm = ({ type, matchPath }) => {
    const [form] = Form.useForm();
    const history = useHistory();
    const { state: stateFromLocation } = useLocation();
    const { dzoData, dzoCodes } = stateFromLocation || {};
    const initialData = useRef(getInitialValue(dzoData));
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);
    const isEdit = type === 'edit';

    useEffect(() => {
        if (isEdit && !dzoData) {
            history.push(matchPath);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const onFinish = useCallback(
        async (dataFromForm) => {
            const { applicationList, ...dzoFormData } = dataFromForm;
            try {
                setLoading(true);

                if (!isEdit) {
                    const { id } = await addDzo(dzoFormData);
                    const appDataFromForm = applicationList.reduce((result, row) => {
                        if (!row.applicationUrl) {
                            return result;
                        }
                        return [...result, { ...row, dzoId: id }];
                    }, []);
                    const appPromises = appDataFromForm.map(addApplication);
                    await Promise.all(appPromises);
                } else {
                    const appFromServer = initialData.current.applicationList;

                    //delete
                    const appsToDelete = appFromServer.reduce((result, applicationFromServer) => {
                        const appTypeFromServer = applicationFromServer.applicationType;
                        const appId = applicationFromServer.applicationId;

                        const isInFormButWithBlankValue = applicationList.find(
                            appFromForm =>
                                appFromForm.applicationType === appTypeFromServer && appFromForm.applicationUrl === ''
                        );

                        const isNotInForm = !applicationList.find(
                            appFromForm => appFromForm.applicationType === appTypeFromServer
                        );

                        if (appId && (isInFormButWithBlankValue || isNotInForm)) {
                            return [...result, appId];
                        }
                        return result;
                    }, []);

                    if (appsToDelete) {
                        const deleteApps = appsToDelete.map(deleteApp);
                        deleteApps.length && Promise.all(deleteApps);
                    }
                    //delete

                    //update
                    const appsToUpdate = appFromServer.reduce((result, app) => {
                        const formAppParams = applicationList.find(
                            ({ applicationType }) => applicationType === app.applicationType
                        );

                        if (formAppParams && formAppParams.applicationUrl && app.applicationUrl !== formAppParams.applicationUrl) {
                            // eslint-disable-next-line no-unused-vars
                            const { dzoId, applicationId, ...appParams } = formAppParams;
                            const applicationIdOld = appFromServer.find(
                                app => app.applicationType === formAppParams.applicationType
                            );
                            return [...result, { ...appParams, applicationId: applicationIdOld.applicationId }];
                        }
                        return result;
                    }, []);
                    const appToUpdatePromise = appsToUpdate.map(updateApp);
                    appToUpdatePromise.length && (await Promise.all(appToUpdatePromise));
                    //update

                    //create
                    const appsToCreate = applicationList.reduce((result, app) => {
                        if (
                            !appFromServer.find(({ applicationType }) => applicationType === app.applicationType) &&
                            app.applicationUrl
                        ) {
                            return [...result, { ...app, dzoId: appFromServer.dzoId }];
                        }
                        return result;
                    }, []);
                    const appPromises = appsToCreate.map(addApplication);
                    appPromises.length && (await Promise.all(appPromises));
                    //create
                }

                history.push(matchPath);
            } catch (e) {
                setError(e.message);
                console.error(e);
                setLoading(false);
            }
        },
        // eslint-disable-next-line react-hooks/exhaustive-deps
        [initialData.current, history, matchPath, isEdit]
    );

    const handleCancel = () => history.push(matchPath);

    const checkUniqCode = (_, value) => {
        if (dzoCodes.includes(value)) {
            return Promise.reject(DZO_CODE_NOT_UNIQUE);
        }
        return Promise.resolve();
    };

    const handleDelete = () => {
        confirmModal({
            onOk: deleteDZO,
            title: `${ DELETE_CONFIRMATION_MODAL_TITLE } ${initialData.current.dzoName}?`,
        });
    };

    const deleteDZO = async () => {
        setLoading(true);
        try {
            await deleteDzo(initialData.current.dzoId);
            history.push(matchPath);
        } catch (e) {
            setLoading(false);
            setError(e.message);
        }
    };

    const onChangeAppUrl = ({ target }, index, add, remove) => {
        const appList = form.getFieldValue(DZO_APPLICATION_LIST_NAME);
        const appsCount = appList.length;

        if (appsCount > 2 && APP_OPTIONS.length !== index + 1) {
            const [lastApp] = appList.slice(-1);
            if (!lastApp.applicationUrl && !target.value) {
                remove(appsCount - 1);
            }
        }

        if (appsCount < APP_OPTIONS.length && index + 1 === appsCount && target.value) {
            add(defaultApp);
        }
    };

    return (
        <div className={ styles.wrapper }>
            <Header />
            { loading && (
                <div className={ styles.loadingContainer }>
                    <div className={ styles.loading }>
                        <LoadingSpinner />
                    </div>
                </div>
            ) }
            <div className={ styles.container }>
                <div className={ styles.title }>
                    { isEdit? initialData.current.dzoName : NEW_DZO_TITLE }
                </div>
                <div className={ styles.formWrapper }>
                    <Form
                        id="info"
                        form={ form }
                        layout="vertical"
                        className={ styles.formContainer }
                        onFinish={ onFinish }
                        initialValues={ initialData.current }
                    >
                        { (formElements || []).map((row, index) => (
                            <Row key={ index } gutter={ [24] }>
                                { (row || []).map((props) => (
                                    <Col key={ props.label } span={ 24 / row.length }>
                                        <FormItem
                                            dzoValue={ props.name ==='dzoCode' && isEdit && initialData.current.dzoCode }
                                            rules={ props.name === 'dzoCode' && !isEdit &&
                                                [
                                                    ...RULES.STANDARD_REQUIRED,
                                                    {
                                                        required: true,
                                                        validator: checkUniqCode,
                                                        message: DZO_CODE_NOT_UNIQUE,
                                                        validateTrigger: 'onSubmit',
                                                    }
                                                ]
                                            }
                                            { ...props }
                                        />
                                    </Col>
                                )) }
                            </Row>
                        )) }
                        <Form.List name={ DZO_APPLICATION_LIST_NAME }>
                            { (fields, { add, remove }) => fields.map((field) => (
                                <Row gutter={ [24] } key={ field.name }>
                                    <Col span={ 12 }>
                                        <Form.Item
                                            label={ APP_TYPE_LABEL }
                                            name={ [field.name, 'applicationType'] }
                                            rules={ [
                                                {
                                                    required: !field.name,
                                                    message: 'Укажите тип приложения',
                                                },
                                                checkAppTypes,
                                            ] }
                                        >
                                            <Select options={ APP_OPTIONS } placeholder={ APP_TYPE_PLACEHOLDER } />
                                        </Form.Item>
                                    </Col>
                                    <Col span={ 12 }>
                                        <Form.Item
                                            label={ QR_LINK_LABEL }
                                            name={ [field.name, 'applicationUrl'] }
                                            rules={ [
                                                { required: !field.name, message: 'Укажите URL' },
                                                { pattern: URL_REGEXP, message: URL_VALIDATION_TEXT, validateTrigger: 'onSubmit' }
                                            ] }
                                        >
                                            <Input
                                                allowClear
                                                placeholder={ QR_LINK_PLACEHOLDER }
                                                onChange={ (event) => onChangeAppUrl(event, field.name, add, remove) }
                                            />
                                        </Form.Item>
                                    </Col>
                                </Row>
                            )) }
                        </Form.List>
                    </Form>
                    { error && <span className={ styles.error }>{ error }</span> }
                </div>
                <div className={ styles.btnGroup }>
                    <Button type="default" onClick={ handleCancel }>
                        { CANCEL_BUTTON_TITLE }
                    </Button>
                    <Button htmlType="submit" form="info" type="primary">
                        { isEdit ? SAVE_BUTTON_TITLE : ADD_BUTTON_TITLE }
                    </Button>
                    { isEdit && (
                        <Button type="primary" danger onClick={ handleDelete }>
                            { DELETE_BUTTON_LABEL }
                        </Button>
                    ) }
                </div>
            </div>
        </div>
    );
};

export default DzoForm;

function FormItem({ label, type, rules, name, placeholder, options, dzoValue }) {
    const formItemInput = (() => {
        switch (type) {
            case TYPES.INPUT:
                return dzoValue ? (
                    <div>{ dzoValue }</div>
                ) : (
                    <Input allowClear placeholder={ placeholder } />
                );
            case TYPES.TEXT_BLOCK:
                return <Input.TextArea placeholder={ placeholder } />;
            case TYPES.SELECT:
                return <Select options={ options } />;
            default:
                return null;
        }
    })();

    return (
        <Form.Item
            label={ label }
            name={ name }
            rules={ rules }
        >
            { formItemInput }
        </Form.Item>
    );
}

function checkAppTypes({ getFieldValue }) {
    return {
        validator(_, value) {
            if (!value) {
                return Promise.resolve();
            }

            const appList = getFieldValue(DZO_APPLICATION_LIST_NAME);
            const { length } = appList.filter(({ applicationType }) => applicationType === value);

            if (length > 1) {
                return Promise.reject(APP_TYPE_ALREADY_SELECTED);
            }
            return Promise.resolve();
        },
        validateTrigger: 'onSubmit',
    };
}
