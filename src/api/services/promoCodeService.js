import moment from 'moment';
import { downloadFileFunc } from '../../utils/helper';
import { Api } from '../apiClient';
import { getReqOptions } from './index';

export async function getPromoCodeStatistics(start, end, dzoId, promoCampaignId) {
    const dzo = dzoId ? `&dzoId=${dzoId}` : '';
    const promoCampaign = promoCampaignId ? `&promoCampaignId=${promoCampaignId}` : '';
    return Api.get(`/admin/promoCampaign/promoCode/statistic/csv?start=${start}&end=${end}${dzo}${promoCampaign}`, getReqOptions('blob'), 'blob');
}

export async function getUnissuedPromoCodeStatistics(promoCampaignId, promoCodeType) {
    const blob = await Api.get(`/admin/promoCampaign/promoCode/unissued?promoCampaignId=${promoCampaignId}&promoCodeType=${promoCodeType}`, getReqOptions('blob'), 'blob');
    downloadFileFunc(URL.createObjectURL(blob), `NotIssuedPromoCode${moment().format('YYYY-MM-DDTHH_mm_ss.sss')}`, 'csv');
}
