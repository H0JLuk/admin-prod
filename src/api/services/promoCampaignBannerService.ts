import { getReqOptions } from './index';
import { Api, FORM_DATA_CONTENT_TYPE } from '../apiClient';

export function editPromoCampaignBanner(promoCampaignBannerId: number, data: FormData, appCode: string) {
    const options = getReqOptions(FORM_DATA_CONTENT_TYPE);
    options.headers.clientAppCode = appCode;
    return Api.update(`/admin/promoCampaign/banner/${promoCampaignBannerId}`, data, options);
}

export function deletePromoCampaignBanner(promoCampaignBannerId: number) {
    return Api.delete(`/admin/promoCampaign/banner/${promoCampaignBannerId}`, getReqOptions());
}

export function createPromoCampaignBanner(formData: FormData, appCode: string) {
    const options = getReqOptions(FORM_DATA_CONTENT_TYPE);
    options.headers.clientAppCode = appCode;
    return Api.upload('/admin/promoCampaign/banner/create', formData, options);
}
