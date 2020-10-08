import { getReqOptions } from './index';
import { Api } from '../apiClient';

export async function editPromoCampaignText(promoCampaignTextId, data) {
    return Api.put(`/admin/promoCampaign/text/${promoCampaignTextId}`, data, getReqOptions());
}

export async function deletePromoCampaignText(promoCampaignTextId) {
    return Api.delete(`/admin/promoCampaign/text/${promoCampaignTextId}`, getReqOptions());
}

export async function createPromoCampaignText(promoCampaignText) {
    return Api.post('/admin/promoCampaign/text/create', promoCampaignText, getReqOptions());
}