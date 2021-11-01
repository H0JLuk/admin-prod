import { Api } from '../apiClient';
import { getReqOptions } from './index';

type GetSalesReportResponse = {
    start: string;
    end: string;
    dzoId?: number;
    promoCampaignId?: number;
    salePointId?: number;
};

export const getSalesReport: (arg: GetSalesReportResponse) => Promise<Blob> = ({ start, end, dzoId, promoCampaignId, salePointId }) => {
    const dzo = dzoId ? `&dzoId=${dzoId}` : '';
    const promoCampaign = promoCampaignId ? `&promoCampaignId=${promoCampaignId}` : '';
    const salePoint = salePointId ? `&salePointId=${salePointId}` : '';
    return Api.get<Blob>(`/admin/order/csv?start=${start}&end=${end}${dzo}${promoCampaign}${salePoint}`, getReqOptions('blob'), 'blob');
};
