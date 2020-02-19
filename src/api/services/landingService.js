import {Api} from "../apiClient";
import {getReqOptions} from "./index";

export async function getLandingList() {
    return  Api.get('/landing', getReqOptions());
}

export async function addLanding(landingDto) {
    return Api.post('/admin/landing', landingDto, getReqOptions());
}

export async function deleteLanding(id) {
    return Api.delete(`/admin/landing/${id}`, getReqOptions());
}

export async function updateLanding(id, landingDto) {
    return Api.put(`/admin/landing/${id}`, landingDto, getReqOptions());
}
