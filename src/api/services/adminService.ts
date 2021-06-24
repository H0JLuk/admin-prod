import { DefaultApiResponse, PromoCampaignReport, UploadFileResponse } from '@types';
import { Api } from '../apiClient';
import { getReqOptions } from './index';

const contentTypeImage = 'image/jpeg';

export function getOffers(start: number | null, end: number | null, salePointId?: number | null) {
    const salePoint = typeof salePointId === 'number' ? `salePointId=${salePointId}` : '';
    const url = (start && end)
        ? `/admin/offer/csv?start=${start}&end=${end}&${salePoint}`
        : `/admin/offer/csv?${salePoint}`;
    return Api.get<Blob>(url, getReqOptions(contentTypeImage), 'blob');
}

export function swapPositions(firstId: number, secondId: number, subDir: string) {
    subDir = !subDir ? '' : `${subDir}/`;
    return Api.put<DefaultApiResponse>(`/admin/${subDir}swap`, { firstId, secondId }, getReqOptions());
}

export function uploadFile(binaryFile: File | Blob, path: string) {
    return Api.upload<UploadFileResponse>(`/admin/file?path=${path}`, binaryFile, getReqOptions(contentTypeImage));
}

export function getDashboardInfo() {
    return Api.get<PromoCampaignReport[]>('/admin/promoCampaign/promoCode/availablePromocodeReport', getReqOptions());
}
