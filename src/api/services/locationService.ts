import { getReqOptions, withDefaultArrayData } from './index';
import { Api } from '../apiClient';
import {
    LocationsListResponse,
    DefaultApiResponse,
    DefaultCreateDtoResponse,
    ListResponse,
    LocationDto,
    LocationTypeDto,
    SaveLocationRequest,
    SaveLocationTypeRequest,
} from '@types';

export function getLocations(searchParams: string) {
    return withDefaultArrayData(Api.get<LocationsListResponse>(`/admin/location?${searchParams}`, getReqOptions()), 'locations');
}

export async function getLocationsByText(value: string) {
    const { list } = await withDefaultArrayData(Api.get<ListResponse<LocationDto>>(`/location/search?name=${value}`, getReqOptions()), 'list');
    return list;
}

export function getLocationTypeList() {
    return withDefaultArrayData(Api.get<ListResponse<LocationTypeDto>>('/admin/location/type', getReqOptions()), 'list');
}

export async function getActiveLocationTypeList() {
    const { list = [] } = await getLocationTypeList();
    return list.filter(({ deleted }) => !deleted);
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

export function addLocationType(data: SaveLocationTypeRequest) {
    return Api.post<DefaultCreateDtoResponse>('/admin/location/type', data, getReqOptions());
}

export async function getLocationTypeById(id: number) {
    const { list } = await getLocationTypeList();
    return list.filter((i) => i.id === id)[0];
}

export function editLocationType(id: number, data: SaveLocationTypeRequest) {
    return Api.put<DefaultApiResponse>(`/admin/location/type/${id}`, data, getReqOptions());
}

export function deleteLocationType(id: number) {
    return Api.delete<DefaultApiResponse>(`/admin/location/type/${id}`, getReqOptions());
}
