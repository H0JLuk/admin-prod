import { getReqOptions } from './index';
import { Api } from '../apiClient';
import {
    LocationsListResponse,
    DefaultApiResponse,
    DefaultCreateDtoResponse,
    ListResponse,
    LocationDto,
    LocationTypeDto,
    SaveLocationRequest,
} from '@types';

export function getLocations(searchParams: string) {
    return Api.get<LocationsListResponse>(`/admin/location?${searchParams}`, getReqOptions());
}

export async function getLocationsByText(value: string) {
    const { list } = await Api.get<ListResponse<LocationDto>>(`/location/search?name=${value}`, getReqOptions());
    return list;
}

export function getLocationTypeList() {
    return Api.get<ListResponse<LocationTypeDto>>('/admin/location/type', getReqOptions());
}

export async function getLocationTypeOptions() {
    const { list } = await getLocationTypeList();
    return list.map(({ id, name }) => ({ label: name, value: id }));
}

export function addLocation(data: SaveLocationRequest) {
    return Api.post<DefaultCreateDtoResponse>('/admin/location', data, getReqOptions());
}

export function editLocation(id: number, data: SaveLocationRequest) {
    return Api.put<DefaultApiResponse>(`/admin/location/${id}`, data, getReqOptions());
}

export function deleteLocation(id: number) {
    return Api.delete<DefaultApiResponse>(`/admin/location/${id}`, getReqOptions());
}
