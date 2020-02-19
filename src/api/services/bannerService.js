import {Api} from "../apiClient";
import {getReqOptions} from "./index";

export async function getBannerList() {
    return  Api.get('/banner/list', getReqOptions());
}

export async function addBanner(bannerDto) {
    return Api.post('/admin/banner', bannerDto, getReqOptions());
}

export async function deleteBanner(id) {
    return Api.delete(`/admin/banner/${id}`, getReqOptions());
}

export async function updateBanner(id, bannerDto) {
    return Api.put(`/admin/banner/${id}`, bannerDto, getReqOptions());
}