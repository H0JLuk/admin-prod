import {
    DefaultApiResponse,
    ClientAppDto,
    DefaultCreateDtoResponse,
    ListResponse,
    SaveClientApp,
} from '@types';
import { Api } from '../apiClient';
import { getReqOptions } from './index';

export function getClientAppList() {
    return Api.get<ListResponse<ClientAppDto>>('/admin/clientApplication', getReqOptions());
}

export async function getActiveClientApps() {
    const { list = [] } = await getClientAppList();
    return list.filter(({ isDeleted }) => !isDeleted);
}

export function getClientAppInfo(appCode: string) {
    return Api.get<ClientAppDto>(`/admin/clientApplication/${appCode}`, getReqOptions());
}

export function addClientApp(clientAppDto: SaveClientApp) {
    return Api.post<DefaultCreateDtoResponse>('/admin/clientApplication', clientAppDto, getReqOptions());
}

export function copyClientApp(clientAppDto: SaveClientApp) {
    return Api.post<DefaultCreateDtoResponse>(
        '/admin/clientApplication/copy',
        clientAppDto,
        getReqOptions()
    );
}

export function updateClientApp(id: number, clientAppDto: SaveClientApp) {
    return Api.put<DefaultApiResponse>(`/admin/clientApplication/${id}`, clientAppDto, getReqOptions());
}

export function deleteClientApp(id: number) {
    return Api.delete<DefaultApiResponse>(`/admin/clientApplication/${id}`, getReqOptions());
}

export function reorderClientApp(idMap: { idMap: Record<number, number>; }) {
    return Api.put<DefaultApiResponse>('/admin/clientApplication/reorder', idMap, getReqOptions());
}

/** TODO: remove DEFAULT_APP and functions after second phase */
const DEFAULT_APP = 'DEFAULT_APP';

export function setDefaultAppCode(appCode: string) {
    sessionStorage.setItem(DEFAULT_APP, appCode);
}

export function getDefaultAppCode() {
    return sessionStorage.getItem(DEFAULT_APP) || '';
}

export function removeDefaultAppCode() {
    sessionStorage.removeItem(DEFAULT_APP);
}
