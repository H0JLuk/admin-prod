import { getReqOptions } from './index';
import { Api } from '../apiClient';
import {
    SalePointRequest,
    ListResponse,
    SalePointDto,
    DefaultCreateDtoResponse,
    DefaultApiResponse,
    SalePointTypesList,
    SalePointType,
} from '@types';

export async function getSalePoints(searchParams: string) {
    return Api.get<SalePointTypesList>(`/admin/salepoint?${searchParams}`, getReqOptions());
}

export async function deleteSalePoint(id: number) {
    return Api.delete<DefaultApiResponse>(`/admin/salepoint/${id}`, getReqOptions());
}

export function addSalePoint(data: SalePointRequest) {
    return Api.post<DefaultCreateDtoResponse>('/admin/salepoint', data, getReqOptions());
}

export function editSalePoint(id: number, data: SalePointRequest) {
    return Api.put<DefaultApiResponse>(`/admin/salepoint/${id}`, data, getReqOptions());
}

export function getSalePointTypesList() {
    return Api.get<ListResponse<SalePointType>>('/admin/salepoint/type', getReqOptions());
}

export async function getSalePointTypesOptions() {
    const { list } = await getSalePointTypesList();
    return list.map(({ name, id }) => ({ label: name, value: id }));
}

export async function getSalePointsByText(name: string, locationId?: number) {
    const params = Object.entries({ name, locationId }).reduce((result, [key, val]) => {
        if (!val) {
            return result;
        }

        return { ...result, [key]: val };
    }, {});
    const { list } = await Api.get<ListResponse<SalePointDto>>(`/salepoint/search?${new URLSearchParams(params).toString()}`, getReqOptions());

    return list;
}
