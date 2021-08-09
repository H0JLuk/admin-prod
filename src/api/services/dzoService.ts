import { Api, FORM_DATA_CONTENT_TYPE } from '../apiClient';
import { getReqOptions } from './index';
import {
    DefaultApiResponse,
    DefaultCreateDtoResponse,
    IDzoListResponse,
    SaveDzoApplicationRequest,
} from '@types';

export function getDzoList() {
    return Api.get<IDzoListResponse>('/dzo', getReqOptions());
}

export function getAllDzoList() {
    return Api.get<IDzoListResponse>('/admin/dzo/list', getReqOptions());
}

export function addDzo(dzoDto: FormData) {
    return Api.upload<DefaultCreateDtoResponse>('/admin/dzo', dzoDto, getReqOptions(FORM_DATA_CONTENT_TYPE));
}

export function deleteDzo(id: number) {
    return Api.delete<DefaultApiResponse>(`/admin/dzo/${id}`, getReqOptions());
}

export function updateDzo(id: number, dzoDto: FormData) {
    return Api.update<DefaultApiResponse>(`/admin/dzo/${id}`, dzoDto, getReqOptions(FORM_DATA_CONTENT_TYPE));
}

// TODO: Вынести в отдельный сервис, когда будет внедряться функционал с разными ссылками на приложения в промо-кампаниях
export function addApplication(newApplication: SaveDzoApplicationRequest) {
    return Api.post<DefaultCreateDtoResponse>('/admin/application', newApplication, getReqOptions());
}

export function deleteApp(applicationId: number) {
    return Api.delete<DefaultApiResponse>(`/admin/application/${applicationId}`, getReqOptions());
}

export function updateApp(updateAppObject: SaveDzoApplicationRequest) {
    return Api.put<DefaultApiResponse>('/admin/application', updateAppObject, getReqOptions());
}
