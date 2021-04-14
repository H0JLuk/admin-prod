import React from 'react';
import { Form, Input, Select } from 'antd';
import {
    APP_OPTIONS,
    APP_TYPE_ALREADY_SELECTED,
    BANNERS,
    DEFAULT_APP,
    DEFAULT_DZO,
    DZO_APPLICATION_LIST_NAME,
    DZO_REQUEST,
    TYPES,
    URL_VALIDATION_NO_APPLICATION_TYPE,
} from '../dzoConstants';
import { APPLICATION_JSON_TYPE } from '../../PromoCampaignPage/PromoCampaign/PromoCampaignForm/PromoCampaignFormConstants';

function getFileNameByType(file, type) {
    return `${type}.${file.name.split('.').pop()}`;
}

export function serializeBannersAndDzoData(imageInputs, textInputs) {
    const formData = new FormData();

    Object.entries(imageInputs).forEach(([key, value]) => {
        if (value[0]?.originFileObj) {
            const name = getFileNameByType(value[0], key);
            const [{ originFileObj }] = value;
            formData.append(BANNERS, originFileObj, name);
        }
    });

    formData.append(DZO_REQUEST, new Blob([JSON.stringify(textInputs)], { type: APPLICATION_JSON_TYPE }));

    return formData;
}

export function getInitialValue({ dzoName, dzoCode, description, applicationList, dzoId } = {}) {
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

export function getInitialBanners(banners) {
    return (banners || []).reduce((result, { type, url }) => ({ ...result, [type]: url }), {});
}

export function FormItem({ label, type, rules, name, placeholder, options, dzoValue }) {
    const formItemInput = (() => {
        switch (type) {
            case TYPES.INPUT:
                return dzoValue ? <div>{ dzoValue }</div> : <Input allowClear placeholder={ placeholder } />;
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
            validateFirst
        >
            { formItemInput }
        </Form.Item>
    );
}

export function checkEmptyAppType({ getFieldValue }) {
    return {
        validator({ fullField }, value) {
            if (!value) {
                return Promise.resolve();
            }
            const fieldIndex = fullField.split('.')[1];
            const { applicationType } = getFieldValue(DZO_APPLICATION_LIST_NAME)[fieldIndex];
            if (!applicationType) {
                return Promise.reject(URL_VALIDATION_NO_APPLICATION_TYPE);
            }
            return Promise.resolve();
        },
        validateTrigger: 'onSubmit',
    };
}

export function checkAppTypes({ getFieldValue }) {
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

export function hasRejectedPromises(updateResponse) {
    return updateResponse.some((el) => el.status === 'rejected');
}

export function errorsToForm(errorApps, form, namesToUpdate) {
    errorApps.forEach(({ index, reason: { message } }) => {
        const formListName = namesToUpdate ? namesToUpdate[index] : index;
        form.setFields([
            {
                name: [DZO_APPLICATION_LIST_NAME, formListName, 'applicationUrl'],
                errors: [message],
            },
        ]);
    });
}

export function checkBackendErrors(updateResponse, form, namesToUpdate) {
    if (hasRejectedPromises(updateResponse)) {
        const errorApps = updateResponse.reduce(
            (result, { status, reason }, index) => (status === 'rejected' ? [...result, { index, reason }] : result),
            []
        );
        errorsToForm(errorApps, form, namesToUpdate);
        return true;
    }
    return false;
}

export function makeErrorAndSuccessObj(response, appDataFromForm = []) {
    const key = {
        fulfilled: 'applicationList',
        rejected: 'errorApps',
    };

    return response.reduce(
        (result, { status, value: { id: applicationId } = {}, reason }, index) => {
            const { applicationType, applicationUrl } = appDataFromForm[index];
            const errorApps = result.errorApps;
            const appList = result.applicationList;
            const arrValue = {
                fulfilled: [...appList, { applicationType, applicationUrl, applicationId }],
                rejected: [...errorApps, { index, reason }],
            };

            return {
                ...result,
                [key[status]]: arrValue[status],
            };
        },
        { applicationList: [], errorApps: [] }
    );
}
