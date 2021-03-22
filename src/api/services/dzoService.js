import { Api, FORM_DATA_CONTENT_TYPE } from '../apiClient';
import { getReqOptions } from './index';

export async function getDzoList() {
    return Api.get('/dzo', getReqOptions());
}

export async function getAllDzoList() {
    return Api.get('/admin/dzo/list', getReqOptions());
}

export function addDzo(dzoDto) {
    return Api.upload('/admin/dzo', dzoDto, getReqOptions(FORM_DATA_CONTENT_TYPE));
}

export async function deleteDzo(id) {
    return Api.delete(`/admin/dzo/${id}`, getReqOptions());
}

export function updateDzo(id, dzoDto) {
    return Api.update(`/admin/dzo/${id}`, dzoDto, getReqOptions(FORM_DATA_CONTENT_TYPE));
}

export async function getBehaviorTypes() {
    return Api.get('/dzo/behaviorTypes', getReqOptions());
}

export function addApplication(newApplication) {
    return Api.post('/admin/application', newApplication, getReqOptions());
}

export function deleteApp (applicationId) {
    return Api.delete(`/admin/application/${applicationId}`, getReqOptions());
}

export function updateApp (updateAppObject) {
    return Api.put('/admin/application', updateAppObject, getReqOptions());
}
