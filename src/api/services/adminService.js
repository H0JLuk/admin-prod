import { Api } from '../apiClient';
import { getReqOptions } from './index';
import _ from 'lodash';

export async function addUser(data) {
    return Api.post('/admin/user', data, getReqOptions());
}

const contentType = 'image/jpeg';
const options = {
    headers: {
        Accept: '*/*',
        'Content-Type': contentType
    }
};

const reqOptions = () => _.merge(options, getReqOptions());

export const getOffers = async () => {
    return Api.get('/admin/offer/excel', getReqOptions(), 'blob');
};

export const getFeedback = async () => {
    return Api.get('/admin/feedback/excel', getReqOptions(), 'blob');
};

export async function reorder(idMap, subDir) {
    return Api.put(`/admin/${subDir}reorder`, { idMap : {...idMap} }, getReqOptions());
}

export async function getDzoDtoList() {
    return  Api.get('/dzo', getReqOptions());
}

export async function getBannerList() {
    return  Api.get('/banner/list', getReqOptions());
}

export async function addBanner(bannerDto) {
    return Api.post('/admin/banner', { ...bannerDto }, getReqOptions());
}

export async function deleteBanner(id) {
    return Api.delete(`/admin/banner/${id}`, getReqOptions());
}

export async function updateBanner(id, bannerDto) {
    return Api.put(`/admin/banner/${id}`, { ...bannerDto }, getReqOptions());
}

export async function uploadFile(binaryFile, path) {
    return Api.upload(`/admin/file?path=${path}`, binaryFile, reqOptions());
}

export async function getStaticServerUrl() {
    return  Api.get('/settings/getStaticUrl', getReqOptions(), 'text');
}

export async function getLandingList() {
    return  Api.get('/landing', getReqOptions());
}

export async function addLanding(landingDto) {
    return Api.post('/admin/landing', { ...landingDto }, getReqOptions());
}

export async function deleteLanding(id) {
    return Api.delete(`/admin/landing/${id}`, getReqOptions());
}

export async function updateLanding(id, landingDto) {
    return Api.put(`/admin/landing/${id}`, { ...landingDto }, getReqOptions());
}
