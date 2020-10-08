import { getReqOptions } from './index';
import { Api, FORM_DATA_CONTENT_TYPE } from '../apiClient';

export async function editPromoCampaignBanner(promoCampaignBannerId, data) {
    return Api.update(`/admin/promoCampaign/banner/${promoCampaignBannerId}`, data, getReqOptions(FORM_DATA_CONTENT_TYPE));
}

export async function deletePromoCampaignBanner(promoCampaignBannerId) {
    return Api.delete(`/admin/promoCampaign/banner/${promoCampaignBannerId}`, getReqOptions());
}

export async function createPromoCampaignBanner(formData) {
    return Api.upload('/admin/promoCampaign/banner/create', formData, getReqOptions(FORM_DATA_CONTENT_TYPE));
}