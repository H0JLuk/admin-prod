import { getReqOptions } from './index';
import { Api } from '../apiClient';
import { PromoCampaignTextCreateDto, PromoCampaignTextUpdateDto } from '@types';

export function editPromoCampaignText(promoCampaignTextId: number, data: PromoCampaignTextUpdateDto, appCode: string) {
    const options = getReqOptions();
    options.headers.clientAppCode = appCode;
    return Api.put(`/admin/promoCampaign/text/${promoCampaignTextId}`, data, options);
}

export function deletePromoCampaignText(promoCampaignTextId: number) {
    return Api.delete(`/admin/promoCampaign/text/${promoCampaignTextId}`, getReqOptions());
}

export function createPromoCampaignText(promoCampaignText: PromoCampaignTextCreateDto, appCode: string) {
    const options = getReqOptions();
    options.headers.clientAppCode = appCode;
    return Api.post('/admin/promoCampaign/text/create', promoCampaignText, options);
}
