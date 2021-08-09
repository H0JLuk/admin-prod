import {
    ConsentDto,
    DefaultApiResponse,
    DefaultCreateDtoResponse,
    ListResponse,
    SaveConsentRequest,
} from '@types';
import { Api } from '../apiClient';
import { getReqOptions } from './index';

export function getConsentsList() {
    return Api.get<ListResponse<ConsentDto>>('/admin/consent', getReqOptions());
}

export function deleteConsent(id: number) {
    return Api.delete<DefaultApiResponse>(`/admin/consent/${id}`, getReqOptions());
}

export function createConsent(consent: Omit<SaveConsentRequest, 'id'>) {
    return Api.post<DefaultCreateDtoResponse>('/admin/consent', consent, getReqOptions());
}

export function updateConsent(consent: SaveConsentRequest) {
    return Api.put<DefaultApiResponse>('/admin/consent', consent, getReqOptions());
}

export function attachConsentToClientApp(id: number, appCode: string) {
    return Api.post<DefaultApiResponse>(`/admin/consent/${id}?clientAppCode=${appCode}`, {}, getReqOptions());
}

export async function getConsentById(consentId: number) {
    const { list = [] } = await getConsentsList();
    return list.find(({ id }) => id === consentId) || null;
}
