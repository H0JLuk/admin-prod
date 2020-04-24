import {Api} from "../apiClient";
import {getReqOptions} from "./index";

export async function getDzoList() {
    return  Api.get('/dzo', getReqOptions());
}

export async function getAllDzoList() {
    return  Api.get('/admin/dzo/list', getReqOptions());
}

export async function addDzo(dzoDto) {
    return Api.post('/admin/dzo', dzoDto, getReqOptions());
}

export async function deleteDzo(id) {
    return Api.delete(`/admin/dzo/${id}`, getReqOptions());
}

export async function updateDzo(id, dzoDto) {
    return Api.put(`/admin/dzo/${id}`, dzoDto, getReqOptions());
}

export async function getBehaviorTypes() {
    return Api.get('/dzo/behaviorTypes', getReqOptions());
}

export async function addApplication(newApplication) {
    return Api.post('/admin/application', newApplication, getReqOptions());
}
