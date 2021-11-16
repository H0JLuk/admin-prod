import { Api } from '../apiClient';
import { getReqOptions, withDefaultArrayData } from './index';
import {
    DefaultApiResponse,
    DefaultCreateDtoResponse,
    PresentationListResponse,
    SavePresentationRequest,
} from '@types';

export function getPresentationList() {
    return withDefaultArrayData(Api.get<PresentationListResponse>('/landing', getReqOptions()), 'landingDtoList');
}

export function addPresentation(presentation: SavePresentationRequest) {
    return Api.post<DefaultCreateDtoResponse>('/admin/landing', presentation, getReqOptions());
}

export function deletePresentation(id: number) {
    return Api.delete<DefaultApiResponse>(`/admin/landing/${ id }`, getReqOptions());
}

export function updatePresentation(id: number, presentation: SavePresentationRequest) {
    return Api.put<DefaultCreateDtoResponse>(`/admin/landing/${ id }`, presentation, getReqOptions());
}
