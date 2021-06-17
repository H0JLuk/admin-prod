import { Api } from '../apiClient';
import { getReqOptions } from './index';
import {
    CategoryListResponse,
    DefaultApiResponse,
    DefaultCreateDtoResponse,
    NewCategoryRequest,
    UpdateCategoryRequest,
} from '@types';

export function getCategoryList() {
    return Api.get<CategoryListResponse>('/categories', getReqOptions());
}

export function addCategory(categoryDto: NewCategoryRequest) {
    return Api.post<DefaultCreateDtoResponse>('/admin/category', categoryDto, getReqOptions());
}

export function deleteCategory(id: number) {
    return Api.delete<DefaultApiResponse>(`/admin/category/${id}`, getReqOptions());
}

export function updateCategory(id: number, categoryDto: UpdateCategoryRequest) {
    return Api.put<Omit<DefaultCreateDtoResponse, 'id'>>(`/admin/category/${id}`, categoryDto, getReqOptions());
}
