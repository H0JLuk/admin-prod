import React from 'react';
import { Form, FormInstance, Input, Select, SelectProps, FormItemProps } from 'antd';
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
import { APPLICATION_JSON_TYPE, BANNER_TYPE } from '@constants/common';
import {
    BannerDto,
    DzoApplication,
    DzoDto,
    DefaultCreateDtoResponse,
    SaveDzoApplicationRequest,
    DefaultApiResponse,
} from '@types';
import { UploadFile } from 'antd/lib/upload/interface';
import { RuleRender } from 'antd/lib/form';

type ExternalBanner = {
    type: BANNER_TYPE;
    url: string | null;
    id?: number;
};

type TextInputs = {
    description: string | null;
    dzoCode: string;
    dzoName: string;
    externalBanners?: ExternalBanner[];
};

export type DzoFormApplication = Partial<DzoApplication> & {
    applicationUrl: string;
};

export type InitialDzoData = Pick<DzoDto, 'dzoId' | 'dzoCode' | 'dzoName' | 'description'> & {
    applicationList: DzoFormApplication[];
};

export type DzoFormLogos = {
    [BannerType in BANNER_TYPE]?: string | UploadFile[];
};

type ErrorApp = {
    index: number;
    reason: any;
};

type ResultSaveDzoApplications = {
    applicationList: Pick<DzoApplication, 'applicationType' | 'applicationId' | 'applicationUrl'>[];
    errorApps: ErrorApp[];
};

type DzoFormItemProps = {
    label: string;
    type: string;
    rules: FormItemProps['rules'];
    name: string;
    placeholder: string;
    options?: SelectProps<string>['options'];
    dzoValue?: string;
};

function getFileNameByType(file: UploadFile, type: string) {
    return `${type}.${file.name.split('.').pop()}`;
}

export function serializeBannersAndDzoData(
    imageInputs: DzoFormLogos,
    textInputs: TextInputs,
    dzoBanners: DzoDto['dzoBannerList'] = [],
) {
    const formData = new FormData();
    const { VIDEO: videoLink, ...restImages } = imageInputs;
    const videoBanner = dzoBanners.find(({ type }) => type === BANNER_TYPE.VIDEO);
    const dzoRequest = textInputs;

    Object.entries(restImages).forEach(([key, value]) => {
        if (typeof value !== 'string' && value[0]?.originFileObj) {
            const name = getFileNameByType(value[0], key);
            const [{ originFileObj }] = value;
            formData.append(BANNERS, originFileObj, name);
        }
    });

    if ((!videoBanner && !!videoLink) || (videoBanner && videoBanner.url !== videoLink)) {
        dzoRequest.externalBanners = [{
            type: BANNER_TYPE.VIDEO,
            url: (videoLink as string) || null,
            id: videoBanner?.id,
        }];
    }

    formData.append(DZO_REQUEST, new Blob([JSON.stringify(dzoRequest)], { type: APPLICATION_JSON_TYPE }));

    return formData;
}

export function getInitialValue({
    dzoName,
    dzoCode,
    description,
    applicationList,
    dzoId,
} = {} as DzoDto): InitialDzoData {
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

export function getInitialBanners(banners: BannerDto[]) {
    return (banners || []).reduce<Record<string, string>>((result, { type, url }) => ({ ...result, [type]: url }), {});
}

export const FormItem: React.FC<DzoFormItemProps> = ({ label, type, rules, name, placeholder, options, dzoValue }) => {
    const formItemInput = (() => {
        switch (type) {
            case TYPES.INPUT:
                return dzoValue ? <div>{dzoValue}</div> : <Input allowClear placeholder={placeholder} />;
            case TYPES.TEXT_BLOCK:
                return <Input.TextArea placeholder={placeholder} />;
            case TYPES.SELECT:
                return <Select options={options} />;
            default:
                return null;
        }
    })();
    return (
        <Form.Item
            label={label}
            name={name}
            rules={rules}
            validateFirst
        >
            {formItemInput}
        </Form.Item>
    );
};

export const checkEmptyAppType: RuleRender = ({ getFieldValue }) => ({
    //TODO: проверить тип fullField после обновления версии antd
    validator({ fullField }: any, value) {
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
});

export const checkAppTypes: RuleRender = ({ getFieldValue }) => ({
    validator(_, value) {
        if (!value) {
            return Promise.resolve();
        }

        const appList: ResultSaveDzoApplications['applicationList'] = getFieldValue(DZO_APPLICATION_LIST_NAME);
        const { length } = appList.filter(({ applicationType }) => applicationType === value);

        if (length > 1) {
            return Promise.reject(APP_TYPE_ALREADY_SELECTED);
        }
        return Promise.resolve();
    },
    validateTrigger: 'onSubmit',
});

export function hasRejectedPromises(updateResponse: PromiseSettledResult<DefaultApiResponse>[]) {
    return updateResponse.some((el) => el.status === 'rejected');
}

export function errorsToForm(errorApps: ErrorApp[], form: FormInstance, namesToUpdate?: number[]) {
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

export function checkBackendErrors(
    updateResponse: PromiseSettledResult<DefaultApiResponse>[],
    form: FormInstance,
    namesToUpdate: number[]
) {
    if (hasRejectedPromises(updateResponse)) {
        const errorApps = updateResponse.reduce<ErrorApp[]>(
            (result, response, index) => (response.status === 'rejected' ? [...result, { index, reason: response.reason }] : result),
            []
        );
        errorsToForm(errorApps, form, namesToUpdate);
        return true;
    }
    return false;
}

export function makeErrorAndSuccessObj(
    response: PromiseSettledResult<DefaultCreateDtoResponse>[],
    appDataFromForm: SaveDzoApplicationRequest[] = []
) {
    const key = {
        fulfilled: 'applicationList',
        rejected: 'errorApps',
    };

    return response.reduce<ResultSaveDzoApplications>((result, response, index) => {
        let newValue: ResultSaveDzoApplications['applicationList'] | ResultSaveDzoApplications['errorApps'];

        if (response.status === 'fulfilled') {
            const { applicationType, applicationUrl } = appDataFromForm[index];
            const appList = result.applicationList;
            const applicationId = response.value.id;
            newValue = [...appList, { applicationType, applicationUrl, applicationId }];
        } else {
            const { reason } = response;
            const { errorApps } = result;
            newValue = [...errorApps, { index, reason }];
        }

        return { ...result, [key[response.status]]: newValue };
    }, { applicationList: [], errorApps: [] });
}
