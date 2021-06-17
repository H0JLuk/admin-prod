import { DefaultApiResponse, PromoCampaignReport, UploadFileResponse } from '@types';
import { Api } from '../apiClient';
import { getReqOptions } from './index';

const contentTypeImage = 'image/jpeg';

export function getOffers(start: number | null, end: number | null) {
    const url = (start && end)
        ? `/admin/offer/csv?start=${start}&end=${end}`
        : '/admin/offer/csv';
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
