import moment from 'moment';
import { downloadFileFunc } from '../../utils/helper';
import { Api } from '../apiClient';
import { getReqOptions } from './index';

export function getPromoCodeStatistics(start: string, end: string, dzoId: number, promoCampaignId: number, salePointId?: number) {
    const dzo = typeof dzoId === 'number' ? `&dzoId=${dzoId}` : '';
    const promoCampaign = typeof promoCampaignId === 'number' ? `&promoCampaignId=${promoCampaignId}` : '';
    const salePoint = typeof salePointId === 'number' ? `&salePointId=${salePointId}` : '';
    return Api.get<Blob>(`/admin/promoCampaign/promoCode/statistic/csv?start=${start}&end=${end}${dzo}${promoCampaign}${salePoint}`, getReqOptions('blob'), 'blob');
}

export async function getUnissuedPromoCodeStatistics(promoCampaignId: number, promoCodeType: string) {
    const blob = await Api.get<Blob>(`/admin/promoCampaign/promoCode/unissued?promoCampaignId=${promoCampaignId}&promoCodeType=${promoCodeType}`, getReqOptions('blob'), 'blob');
    downloadFileFunc(URL.createObjectURL(blob), `NotIssuedPromoCode${moment().format('YYYY-MM-DDTHH_mm_ss.sss')}`, 'csv');
}
