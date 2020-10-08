import { getReqOptions } from './index';
import { Api, FORM_DATA_CONTENT_TYPE } from '../apiClient';

export async function getPromoCampaignList() {
    return Api.post('/promo-campaign/list/filter', {}, getReqOptions());
}

export async function getPromoCampaignStatistics(promoCampaignId) {
    return Api.get(`/admin/promoCampaign/${promoCampaignId}/statistics`, getReqOptions());
}

export async function createPromoCampaign(promoCampaign) {
    return Api.post('/admin/promoCampaign', promoCampaign, getReqOptions());
}

export async function editPromoCampaign(promoCampaign) {
    return Api.put(`/admin/promoCampaign/${promoCampaign.id}`, promoCampaign, getReqOptions());
}

export async function reorderPromoCampaigns(idMap) {
    return Api.post('/admin/promoCampaign/reorder/', { idMap }, getReqOptions());
}

export async function uploadPromoCodes(campaignId, data) {
    return Api.upload(`/admin/promoCampaign/promoCode?campaign-id=${campaignId}`, data, getReqOptions(FORM_DATA_CONTENT_TYPE));
}

export async function deletePromoCampaign(promoCampaignId) {
    return Api.delete(`/admin/promoCampaign/${promoCampaignId}`, getReqOptions());
}