import React, { useCallback, useEffect, useRef, useState } from 'react';
import { Col, Form, Row, Input, Select, Button } from 'antd';
import { useHistory, useLocation } from 'react-router-dom';
import { addApplication, addDzo, deleteApp, deleteDzo, updateApp, updateDzo } from '../../../api/services/dzoService';
import { confirmModal } from '../../../utils/utils';
import Header from '../../../components/Header/Header';
import { URL_REGEXP } from '../../../constants/common';
import UploadPicture from '../../../components/UploadPicture/UploadPicture';
import { APPLICATION_JSON_TYPE } from '../../PromoCampaignPage/PromoCampaign/PromoCampaignForm/PromoCampaignFormConstants';
import {
    BANNERS,
    DZO_REQUEST,
    DEFAULT_DZO,
    APP_OPTIONS,
    DZO_CODE_NOT_UNIQUE,
    DEFAULT_APP,
    DELETE_CONFIRMATION_MODAL_TITLE,
    DZO_APPLICATION_LIST_NAME,
    NEW_DZO_TITLE,
    FORM_ELEMENTS,
    RULES,
    BANNERS_UPLOAD_TEMPLATE,
    APP_TYPE_LABEL,
    QR_LINK_LABEL,
    APP_TYPE_PLACEHOLDER,
    QR_LINK_PLACEHOLDER,
    CANCEL_BUTTON_TITLE,
    URL_VALIDATION_TEXT,
    ADD_BUTTON_TITLE,
    SAVE_BUTTON_TITLE,
    DELETE_BUTTON_LABEL,
    TYPES,
    APP_TYPE_ALREADY_SELECTED,
} from '../dzoConstants';

import styles from './DzoForm.module.css';

import { ReactComponent as LoadingSpinner } from '../../../static/images/loading-spinner.svg';

function serializeBannersAndDzoData(imageInputs, textInputs) {
    const formData = new FormData();

    Object.entries(imageInputs).forEach(([key, value]) => {
        if (value[0]?.originFileObj) {
            const name = `${key}.${value[0].name.split('.').pop()}`;
            const [{ originFileObj }] = value;
            formData.append(BANNERS, originFileObj, name);
        }
    });

    formData.append(DZO_REQUEST, new Blob([JSON.stringify(textInputs)], { type: APPLICATION_JSON_TYPE }));

    return formData;
}

function getInitialValue({ dzoName, dzoCode, description, applicationList, dzoId } = {}) {
    const appList = (applicationList || []).map((el) => ({ ...el, applicationUrl: decodeURI(el.applicationUrl) }));

    return {
        ...DEFAULT_DZO,
        dzoName,
        dzoCode,
        description,
        dzoId,
        applicationList: appList.length < APP_OPTIONS.length ? [...appList, DEFAULT_APP] : appList,
    };
}

function getInitialBanners(banners) {
    return (banners || []).reduce((result, { type, url }) => ({ ...result, [type]: url }), {});
}

const DzoForm = ({ type, matchPath }) => {
    const [form] = Form.useForm();
    const history = useHistory();
    const { state: stateFromLocation } = useLocation();
    const { dzoData, dzoCodes } = stateFromLocation || {};
    const initialData = useRef(getInitialValue(dzoData));
    const initialBanners = useRef(getInitialBanners(dzoData?.dzoBannerList));
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);
    const isEdit = type === 'edit';
    const [isSaveButtonDisabled, setIsSaveButtonDisabled] = useState(true);

    useEffect(() => {
        if (isEdit && !dzoData) {
            history.push(matchPath);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const onFinish = useCallback(
        async (dataFromForm) => {
            const { applicationList, dzoBannerList, ...dzoFormData } = dataFromForm;
            const formData = serializeBannersAndDzoData(dzoBannerList, dzoFormData);

            try {
                setLoading(true);

                if (!isEdit) {
                    const { id } = await addDzo(formData);
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

                    // update DZO info
                    const { dzoId } = initialData.current;
                    await updateDzo(dzoId, formData);
                    // update DZO info
                }

                history.push(matchPath);
            } catch (e) {
                setError(e.message);
                console.error(e);
                setLoading(false);
            }
        },
        // eslint-disable-next-line react-hooks/exhaustive-deps
        [history, matchPath, isEdit]
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
            add(DEFAULT_APP);
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
                    { isEdit ? initialData.current.dzoName : NEW_DZO_TITLE }
                </div>
                <div className={ styles.formWrapper }>
                    <Form
                        id="info"
                        form={ form }
                        layout="vertical"
                        className={ styles.formContainer }
                        onFinish={ onFinish }
                        initialValues={ initialData.current }
                        onFieldsChange={ isEdit && (() => setIsSaveButtonDisabled(false)) }
                    >
                        { (FORM_ELEMENTS || []).map((row, index) => (
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
                        <Row gutter={ 24 }>
                            { BANNERS_UPLOAD_TEMPLATE.map(({ label, name, accept, type, description, setting }) => (
                                <Col span={ 8 } key={ label }>
                                    <UploadPicture
                                        description={ description }
                                        uploadButtonText="Добавить"
                                        name={ name }
                                        setting={ setting }
                                        label={ label }
                                        accept={ accept }
                                        type={ type }
                                        removeIconView={ false }
                                        footer
                                        initialValue={ initialBanners.current[name[1]] }
                                    />
                                </Col>
                            )) }
                        </Row>
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
                    <Button
                        htmlType="submit"
                        form="info"
                        type="primary"
                        disabled={ isEdit && isSaveButtonDisabled }
                    >
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
