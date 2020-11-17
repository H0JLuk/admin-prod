import { Api } from '../apiClient';
import { getReqOptions } from './index';

export async function getPromoCodeStatistics(start, end, dzoId, promoCampaignId) {
    const dzo = dzoId ? `&dzoId=${dzoId}` : '';
    const promoCampaign = promoCampaignId ? `&promoCampaignId=${promoCampaignId}` : '';
    return Api.get(`/admin/promoCampaign/promoCode/statistic?start=${start}&end=${end}${dzo}${promoCampaign}`, getReqOptions('blob'), 'blob');
}