import React, { useEffect, useRef, useState } from 'react';
import { Col, Form, Row, Input, Select, Button } from 'antd';
import { FormListOperation } from 'antd/lib/form/FormList';
import { useHistory, useLocation } from 'react-router-dom';
import { ValidatorRule } from 'rc-field-form/lib/interface';
import { addApplication, addDzo, deleteApp, deleteDzo, updateApp, updateDzo } from '@apiServices/dzoService';
import { confirmModal } from '@utils/utils';
import { urlCheckRule, urlHttpsRule } from '@utils/urlValidator';
import { DzoApplication, DzoDto, SaveDzoApplicationRequest } from '@types';
import Header from '@components/Header';
import UploadPicture from '@components/UploadPicture';
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
    LINK_INPUT_PLACEHOLDER,
    LINK_VIDEO_LABEL,
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
    DzoFormApplication,
    InitialDzoData,
    DzoFormLogos,
} from './dzoFormFunctions';
import { BANNER_TYPE, BUTTON_TEXT } from '@constants/common';

import styles from './DzoForm.module.css';

import { ReactComponent as LoadingSpinner } from '@imgs/loading-spinner.svg';

type DzoFormProps = {
    type: string;
    matchPath: string;
};

type DzoFormLocationState = {
    dzoData: DzoDto;
    dzoCodes: string[];
};

type OnFinishFormData = InitialDzoData & {
    applicationList: DzoFormApplication[];
    dzoBannerList: DzoFormLogos;
};

const DzoForm: React.FC<DzoFormProps> = ({ type, matchPath }) => {
    const [form] = Form.useForm();
    const history = useHistory();
    const { state: stateFromLocation } = useLocation<DzoFormLocationState>();
    const { dzoData, dzoCodes } = stateFromLocation || {};
    const initialData = useRef(getInitialValue(dzoData));
    const initialBanners = useRef(getInitialBanners(dzoData?.dzoBannerList));
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);
    const isEdit = type === 'edit';
    const [isSaveButtonDisabled, setIsSaveButtonDisabled] = useState(true);

    useEffect(() => {
        if (isEdit && !dzoData) {
            history.push(matchPath);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const onFinish = async (dataFromForm: OnFinishFormData) => {
        const { applicationList, dzoBannerList, ...dzoFormData } = dataFromForm;
        const formData = serializeBannersAndDzoData(dzoBannerList, dzoFormData, dzoData?.dzoBannerList);

        try {
            setLoading(true);

            if (!isEdit) {
                const { id } = await addDzo(formData);
                const appDataFromForm = applicationList.reduce<SaveDzoApplicationRequest[]>((result, row) => {
                    if (!row.applicationUrl) {
                        return result;
                    }
                    return [...result, { ...(row as SaveDzoApplicationRequest), dzoId: id }];
                }, []);
                const appPromises = appDataFromForm.map(addApplication);
                const response = await Promise.allSettled(appPromises);

                if (hasRejectedPromises(response)) {
                    const { applicationList: appList, errorApps } = makeErrorAndSuccessObj(response, appDataFromForm);

                    history.replace(`${matchPath}/${id}/edit`);
                    initialData.current = { ...dataFromForm, dzoId: id, applicationList: appList };

                    errorsToForm(errorApps, form);
                    throw new Error();
                }

            } else {
                const appFromServer = initialData.current.applicationList;
                const { dzoId } = initialData.current;

                // START delete applications
                const appsToDelete = appFromServer.reduce<number[]>((result, applicationFromServer) => {
                    const appTypeFromServer = applicationFromServer.applicationType;
                    const appId = applicationFromServer.applicationId;

                    const isInFormButWithBlankValue = applicationList.find(
                        appFromForm =>
                            appFromForm.applicationType === appTypeFromServer && appFromForm.applicationUrl === '',
                    );

                    const isNotInForm = !applicationList.find(
                        appFromForm => appFromForm.applicationType === appTypeFromServer,
                    );

                    if (appId && (isInFormButWithBlankValue || isNotInForm)) {
                        return [...result, appId];
                    }
                    return result;
                }, []);

                if (appsToDelete.length) {
                    const deleteApps = appsToDelete.map(deleteApp);
                    await Promise.all(deleteApps);
                }
                // END delete applications

                // START update applications
                const namesToUpdate: number[] = [];
                const appsToUpdate = appFromServer.reduce<SaveDzoApplicationRequest[]>((result, app, index) => {
                    const formAppParams = applicationList.find(
                        ({ applicationType }) => applicationType === app.applicationType,
                    );

                    if (formAppParams?.applicationUrl && app.applicationUrl !== formAppParams.applicationUrl) {
                        // eslint-disable-next-line @typescript-eslint/no-unused-vars
                        const { dzoId: dzoID, applicationId, ...appParams } = formAppParams;
                        namesToUpdate.push(index);
                        const applicationIdOld = appFromServer.find(
                            appEl => appEl.applicationType === formAppParams.applicationType,
                        );
                        return [...result, ({ ...appParams, applicationId: applicationIdOld?.applicationId }) as DzoApplication];
                    }
                    return result;
                }, []);
                const appToUpdatePromise = appsToUpdate.map(updateApp);
                const updateResponse = appToUpdatePromise.length && (await Promise.allSettled(appToUpdatePromise));
                const hasUpdateError = updateResponse && checkBackendErrors(updateResponse, form, namesToUpdate);
                // END update applications

                // START create applications
                const namesToCreate: number[] = [];
                const appsToCreate = applicationList.reduce<SaveDzoApplicationRequest[]>((result, app, index) => {
                    if (
                        !appFromServer.find(({ applicationType }) => applicationType === app.applicationType) &&
                        app.applicationUrl
                    ) {
                        namesToCreate.push(index);
                        return [...result, ({ ...app, dzoId } as SaveDzoApplicationRequest)];
                    }
                    return result;
                }, []);
                const appPromises = appsToCreate.map(addApplication);
                const createResponse = appPromises.length && (await Promise.allSettled(appPromises));

                (createResponse || []).forEach((response, index) => {
                    if (response.status === 'fulfilled') {
                        const appList = initialData.current.applicationList ;
                        const newApp = appsToCreate[index];
                        const appToAdd = { ...newApp, applicationId: response.value.id };
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
                // END create applications

                // START update DZO info
                await updateDzo(dzoId, formData);
                // END update DZO info

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
    };

    const handleCancel = () => history.push(matchPath);

    const checkUniqCode: ValidatorRule['validator'] = (_, value: string) => {
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

    const onChangeAppUrl = (
        { target }: React.ChangeEvent<HTMLInputElement>,
        index: number,
        add: FormListOperation['add'],
        remove: FormListOperation['remove'],
    ) => {
        const appList: DzoFormApplication[] = form.getFieldValue(DZO_APPLICATION_LIST_NAME);
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
        <div className={styles.wrapper}>
            <Header />
            {loading && (
                <div className={styles.loadingContainer}>
                    <div className={styles.loading}>
                        <LoadingSpinner />
                    </div>
                </div>
            )}
            <div className={styles.container}>
                <div className={styles.title}>
                    {isEdit ? initialData.current.dzoName : NEW_DZO_TITLE}
                </div>
                <div className={styles.formWrapper}>
                    <Form
                        id="info"
                        form={form}
                        layout="vertical"
                        className={styles.formContainer}
                        onFinish={onFinish}
                        initialValues={initialData.current}
                        onFieldsChange={(isEdit && (() => setIsSaveButtonDisabled(false))) || undefined}
                        validateTrigger="onSubmit"
                    >
                        {(FORM_ELEMENTS || []).map((row, index) => (
                            <Row
                                key={index}
                                className={styles.mainInfoRow}
                                gutter={24}
                            >
                                {(row || []).map(({ rules, ...props }) => (
                                    <Col key={props.label} span={24 / row.length}>
                                        <FormItem
                                            dzoValue={(props.name === 'dzoCode' && isEdit && initialData.current.dzoCode) || undefined}
                                            rules={[
                                                ...(rules || []),
                                                props.name === 'dzoCode' && !isEdit ? {
                                                    validator: checkUniqCode,
                                                    message: DZO_CODE_NOT_UNIQUE,
                                                } : {},
                                            ]}
                                            {...props}
                                        />
                                    </Col>
                                ))}
                            </Row>
                        ))}
                        <Row justify="space-between">
                            {BANNERS_UPLOAD_TEMPLATE.map(({ label, name, ...rest }) => (
                                <Col
                                    key={label}
                                    className={styles.uploadImage}
                                    span={8}
                                >
                                    <UploadPicture
                                        {...rest}
                                        uploadButtonText={BUTTON_TEXT.ADD}
                                        name={name}
                                        label={label}
                                        removeIconView={false}
                                        footer
                                        initialValue={initialBanners.current[name[1]]}
                                    />
                                </Col>
                            ))}
                        </Row>
                        <Form.List name={DZO_APPLICATION_LIST_NAME}>
                            {(fields, { add, remove }) => fields.map((field) => (
                                <Row
                                    key={field.name}
                                    className={styles.mainInfoRow}
                                    gutter={24}
                                >
                                    <Col span={12}>
                                        <Form.Item
                                            label={APP_TYPE_LABEL}
                                            name={[field.name, 'applicationType']}
                                            rules={[checkAppTypes]}
                                        >
                                            <Select options={APP_OPTIONS} placeholder={APP_TYPE_PLACEHOLDER} />
                                        </Form.Item>
                                    </Col>
                                    <Col span={12}>
                                        <Form.Item
                                            label={QR_LINK_LABEL}
                                            validateFirst
                                            name={[field.name, 'applicationUrl']}
                                            rules={[
                                                urlCheckRule,
                                                checkEmptyAppType,
                                            ]}
                                        >
                                            <Input
                                                placeholder={LINK_INPUT_PLACEHOLDER}
                                                onChange={(event) => onChangeAppUrl(event, field.name, add, remove)}
                                                allowClear
                                            />
                                        </Form.Item>
                                    </Col>
                                </Row>
                            ))}
                        </Form.List>
                        <Row
                            className={styles.mainInfoRow}
                            gutter={24}
                        >
                            <Col span={12}>
                                <Form.Item
                                    label={LINK_VIDEO_LABEL}
                                    name={['dzoBannerList', BANNER_TYPE.VIDEO]}
                                    rules={[urlHttpsRule, urlCheckRule]}
                                    initialValue={initialBanners.current[BANNER_TYPE.VIDEO] ?? ''}
                                    validateFirst
                                >
                                    <Input
                                        placeholder={LINK_INPUT_PLACEHOLDER}
                                        allowClear
                                    />
                                </Form.Item>
                            </Col>
                        </Row>
                    </Form>
                    {error && <span className={styles.error}>{error}</span>}
                </div>
                <div className={styles.btnGroup}>
                    <Button type="default" onClick={handleCancel}>
                        {BUTTON_TEXT.CANCEL}
                    </Button>
                    <Button
                        htmlType="submit"
                        form="info"
                        type="primary"
                        disabled={isEdit && isSaveButtonDisabled}
                    >
                        {isEdit ? BUTTON_TEXT.SAVE : BUTTON_TEXT.ADD}
                    </Button>
                    {isEdit && (
                        <Button type="primary" danger onClick={handleDelete}>
                            {BUTTON_TEXT.DELETE}
                        </Button>
                    )}
                </div>
            </div>
        </div>
    );
};

export default DzoForm;

