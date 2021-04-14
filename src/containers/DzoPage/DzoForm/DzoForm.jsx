import React, { useCallback, useEffect, useRef, useState } from 'react';
import { Col, Form, Row, Input, Select, Button } from 'antd';
import { useHistory, useLocation } from 'react-router-dom';
import { addApplication, addDzo, deleteApp, deleteDzo, updateApp, updateDzo } from '../../../api/services/dzoService';
import { confirmModal } from '../../../utils/utils';
import { urlCheckRule } from '../../../utils/urlValidator';
import Header from '../../../components/Header/Header';
import UploadPicture from '../../../components/UploadPicture/UploadPicture';
import {
    APP_OPTIONS,
    DZO_CODE_NOT_UNIQUE,
    DEFAULT_APP,
    DELETE_CONFIRMATION_MODAL_TITLE,
    DZO_APPLICATION_LIST_NAME,
    NEW_DZO_TITLE,
    FORM_ELEMENTS,
    BANNERS_UPLOAD_TEMPLATE,
    APP_TYPE_LABEL,
    QR_LINK_LABEL,
    APP_TYPE_PLACEHOLDER,
    QR_LINK_PLACEHOLDER,
    CANCEL_BUTTON_TITLE,
    ADD_BUTTON_TITLE,
    SAVE_BUTTON_TITLE,
    DELETE_BUTTON_LABEL,
} from '../dzoConstants';
import {
    checkAppTypes,
    checkBackendErrors,
    checkEmptyAppType,
    errorsToForm,
    FormItem,
    getInitialBanners,
    getInitialValue,
    hasRejectedPromises,
    makeErrorAndSuccessObj,
    serializeBannersAndDzoData,
} from './dzoFormFunctions';

import styles from './DzoForm.module.css';

import { ReactComponent as LoadingSpinner } from '../../../static/images/loading-spinner.svg';

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
                    const response = await Promise.allSettled(appPromises);

                    if (hasRejectedPromises(response)) {
                        const { applicationList, errorApps } = makeErrorAndSuccessObj(response, appDataFromForm);

                        history.replace(`${matchPath}/${id}/edit`);
                        initialData.current = { ...dataFromForm, dzoId: id, applicationList };

                        errorsToForm(errorApps, form);
                        throw new Error();
                    }

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
                    const namesToUpdate = [];
                    const appsToUpdate = appFromServer.reduce((result, app, index) => {
                        const formAppParams = applicationList.find(
                            ({ applicationType }) => applicationType === app.applicationType
                        );

                        if (formAppParams && formAppParams.applicationUrl && app.applicationUrl !== formAppParams.applicationUrl) {
                            // eslint-disable-next-line no-unused-vars
                            const { dzoId, applicationId, ...appParams } = formAppParams;
                            namesToUpdate.push(index);
                            const applicationIdOld = appFromServer.find(
                                app => app.applicationType === formAppParams.applicationType
                            );
                            return [...result, { ...appParams, applicationId: applicationIdOld.applicationId }];
                        }
                        return result;
                    }, []);
                    const appToUpdatePromise = appsToUpdate.map(updateApp);
                    const updateResponse = appToUpdatePromise.length && (await Promise.allSettled(appToUpdatePromise));
                    const hasUpdateError = updateResponse && checkBackendErrors(updateResponse, form, namesToUpdate);
                    //update

                    //create
                    const namesToCreate = [];
                    const appsToCreate = applicationList.reduce((result, app, index) => {
                        if (
                            !appFromServer.find(({ applicationType }) => applicationType === app.applicationType) &&
                            app.applicationUrl
                        ) {
                            namesToCreate.push(index);
                            return [...result, { ...app, dzoId: initialData.current.dzoId }];
                        }
                        return result;
                    }, []);
                    const appPromises = appsToCreate.map(addApplication);
                    const createResponse = appPromises.length && (await Promise.allSettled(appPromises));
                    (createResponse || []).forEach(({ status, value }, index) => {
                        if (status === 'fulfilled') {
                            const appList = initialData.current.applicationList ;
                            const newApp = appsToCreate[index];
                            const appToAdd = { ...newApp, applicationId: value.id };
                            initialData.current = {
                                ...initialData.current,
                                applicationList: [
                                    ...appList,
                                    appToAdd,
                                ],
                            };
                        }
                    });
                    const hasCreateError = createResponse && checkBackendErrors(createResponse, form, namesToCreate);
                    //create

                    // update DZO info
                    const { dzoId } = initialData.current;
                    await updateDzo(dzoId, formData);
                    // update DZO info

                    if (hasCreateError || hasUpdateError) {
                        throw new Error();
                    }
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
                                { (row || []).map(({ rules, ...props }) => (
                                    <Col key={ props.label } span={ 24 / row.length }>
                                        <FormItem
                                            dzoValue={ props.name ==='dzoCode' && isEdit && initialData.current.dzoCode }
                                            rules={ [
                                                ...(rules || []),
                                                props.name === 'dzoCode' && !isEdit ? {
                                                    validator: checkUniqCode,
                                                    message: DZO_CODE_NOT_UNIQUE,
                                                    validateTrigger: 'onSubmit',
                                                } : {}
                                            ] }
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
                                            rules={ [ checkAppTypes, ] }
                                        >
                                            <Select options={ APP_OPTIONS } placeholder={ APP_TYPE_PLACEHOLDER } />
                                        </Form.Item>
                                    </Col>
                                    <Col span={ 12 }>
                                        <Form.Item
                                            label={ QR_LINK_LABEL }
                                            validateFirst
                                            name={ [field.name, 'applicationUrl'] }
                                            rules={ [
                                                urlCheckRule,
                                                checkEmptyAppType,
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

