import { getReqOptions } from './index';
import { Api, FORM_DATA_CONTENT_TYPE } from '../apiClient';

export async function editPromoCampaignBanner(promoCampaignBannerId: number, data: FormData) {
    return Api.update(`/admin/promoCampaign/banner/${promoCampaignBannerId}`, data, getReqOptions(FORM_DATA_CONTENT_TYPE));
}

export function newEditPromoCampaignBanner(promoCampaignBannerId: number, data: FormData, appCode: string) {
    const options = getReqOptions(FORM_DATA_CONTENT_TYPE);
    options.headers.clientAppCode = appCode;
    return Api.update(`/admin/promoCampaign/banner/${promoCampaignBannerId}`, data, options);
}

export async function deletePromoCampaignBanner(promoCampaignBannerId: number) {
    return Api.delete(`/admin/promoCampaign/banner/${promoCampaignBannerId}`, getReqOptions());
}

export async function createPromoCampaignBanner(formData: FormData) {
    return Api.upload('/admin/promoCampaign/banner/create', formData, getReqOptions(FORM_DATA_CONTENT_TYPE));
}

export function newCreatePromoCampaignBanner(formData: FormData, appCode: string) {
    const options = getReqOptions(FORM_DATA_CONTENT_TYPE);
    options.headers.clientAppCode = appCode;
    return Api.upload('/admin/promoCampaign/banner/create', formData, options);
}
