import { getReqOptions } from './index';
import { Api } from '../apiClient';

export async function editPromoCampaignText(promoCampaignTextId, data) {
    return Api.put(`/admin/promoCampaign/text/${promoCampaignTextId}`, data, getReqOptions());
}

export function newEditPromoCampaignText(promoCampaignTextId, data, appCode){
    const options = getReqOptions();
    options.headers.clientAppCode = appCode;
    return Api.put(`/admin/promoCampaign/text/${promoCampaignTextId}`, data, options);
}

export async function deletePromoCampaignText(promoCampaignTextId) {
    return Api.delete(`/admin/promoCampaign/text/${promoCampaignTextId}`, getReqOptions());
}

export async function createPromoCampaignText(promoCampaignText) {
    return Api.post('/admin/promoCampaign/text/create', promoCampaignText, getReqOptions());
}

export function newPromoCampaignText(promoCampaignText, appCode) {
    const options = getReqOptions();
    options.headers.clientAppCode = appCode;
    return Api.post('/admin/promoCampaign/text/create', promoCampaignText, options);
}