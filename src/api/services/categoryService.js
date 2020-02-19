import {Api} from "../apiClient";
import {getReqOptions} from "./index";

export async function getCategoryList() {
    return  Api.get('/categories', getReqOptions());
}

export async function addCategory(categoryDto) {
    return Api.post('/admin/category', categoryDto, getReqOptions());
}

export async function deleteCategory(id) {
    return Api.delete(`/admin/category/${id}`, getReqOptions());
}

export async function updateCategory(id, categoryDto) {
    return Api.put(`/admin/category/${id}`, categoryDto, getReqOptions());
}