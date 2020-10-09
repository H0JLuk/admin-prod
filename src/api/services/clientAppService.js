import { Api } from '../apiClient';
import { getReqOptions } from './index';

export async function getClientAppList() {
    return Api.get('/admin/clientApplication', getReqOptions());
}

export async function addClientApp(clientAppDto) {
    return Api.post('/admin/clientApplication', clientAppDto, getReqOptions());
}

export async function copyClientApp(clientAppDto) {
    return Api.post('/admin/clientApplication/copy', clientAppDto, getReqOptions());
}

export async function updateClientApp(id, clientAppDto) {
    return Api.put(`/admin/clientApplication/${id}`, clientAppDto, getReqOptions());
}

export async function deleteClientApp(id) {
    return Api.delete(`/admin/clientApplication/${id}`, getReqOptions());
}

export async function updateProperties(id, properties) {
    return Api.put(`/admin/clientApplication/${id}/properties`, properties, getReqOptions());
}