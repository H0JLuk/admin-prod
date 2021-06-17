import { getReqOptions } from './index';
import { Api } from '../apiClient';
import { PromoCampaignTextCreateDto, PromoCampaignTextUpdateDto } from '@types';

export async function editPromoCampaignText(promoCampaignTextId: number, data: PromoCampaignTextUpdateDto) {
    return Api.put(`/admin/promoCampaign/text/${promoCampaignTextId}`, data, getReqOptions());
}

export function newEditPromoCampaignText(promoCampaignTextId: number, data: PromoCampaignTextUpdateDto, appCode: string) {
    const options = getReqOptions();
    options.headers.clientAppCode = appCode;
    return Api.put(`/admin/promoCampaign/text/${promoCampaignTextId}`, data, options);
}

export async function deletePromoCampaignText(promoCampaignTextId: number) {
    return Api.delete(`/admin/promoCampaign/text/${promoCampaignTextId}`, getReqOptions());
}

export async function createPromoCampaignText(promoCampaignText: PromoCampaignTextCreateDto) {
    return Api.post('/admin/promoCampaign/text/create', promoCampaignText, getReqOptions());
}

export function newPromoCampaignText(promoCampaignText: PromoCampaignTextCreateDto, appCode: string) {
    const options = getReqOptions();
    options.headers.clientAppCode = appCode;
    return Api.post('/admin/promoCampaign/text/create', promoCampaignText, options);
}
