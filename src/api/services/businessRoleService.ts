import {
    BusinessRoleDto,
    DefaultApiResponse,
    DefaultCreateDtoResponse,
    ListResponse,
    SaveBusinessRoleRequest,
} from '@types';
import { Api } from '../apiClient';
import { getReqOptions } from './index';

export function getBusinessRoles() {
    return Api.get<ListResponse<BusinessRoleDto>>('/business-role/list', getReqOptions());
}

export function getBusinessRolesByClientApp(clientAppId: number) {
    return Api.get<ListResponse<BusinessRoleDto>>(`/admin/business-role/list?clientAppId=${clientAppId}`, getReqOptions());
}

export async function getBusinessRoleById(roleId: number | string) {
    const { list } = await getBusinessRoles();
    return list.find(({ id }) => id === Number(roleId));
}

export function createBusinessRole(data: SaveBusinessRoleRequest) {
    return Api.post<DefaultCreateDtoResponse>('/admin/business-role', data, getReqOptions());
}

export function editBusinessRole(id: number | string, data: SaveBusinessRoleRequest) {
    return Api.put<DefaultApiResponse>(`/admin/business-role/${id}`, data, getReqOptions());
}

export function deleteBusinessRole(id: number | string) {
    return Api.delete<DefaultApiResponse>(`/admin/business-role/${id}`, getReqOptions());
}
