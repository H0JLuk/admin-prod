import _ from 'lodash';
import { Api } from '../apiClient';
import { getReqOptions } from './index';

export async function getUser(pn) {
    return Api.get(`/admin/user/${pn}`, getReqOptions());
}

export function oldAddUser(data) {
    return Api.post('/admin/user', data, getReqOptions());
}

export async function addUser(data) {
    return Api.post('/admin/user/register', data, getReqOptions());
}

export function oldRemoveUser(pn) {
    return Api.delete(`/admin/user/${pn}`, getReqOptions());
}

export async function removeUser(pn) {
    return Api.delete(`/admin/user/delete/${pn}`, getReqOptions());
}

export async function getUsersList(pageNo = 0, pageSize = 10, filters = {}) {
    const urlParams = new URLSearchParams();

    urlParams.append('pageNo', pageNo);
    urlParams.append('pageSize', pageSize);
    Object.keys(filters).forEach((key) => {
        if (filters[key] !== '') {
            urlParams.append(key, filters[key]);
        }
    });

    return Api.get(`/admin/user/filtered?${urlParams.toString()}`, getReqOptions());
}

/**
 * @param {string} usersIds
 */
export function removeUsers(usersIds) {
    return Api.delete(`/admin/user/${usersIds}`);
}

export async function resetUser(pn) {
    return Api.post(`/admin/user/reset/${pn}`, '', getReqOptions());
}

export async function unblockUser(pn) {
    return Api.post(`/admin/user/unblock/${pn}`, '', getReqOptions());
}

export function saveUser(id, data) {
    return Api.post(`/admin/user/edit/${id}`, data, getReqOptions());
}

export function editLocationAndSalePointUsers(data) {
    return Api.post('/admin/user/editSalePoint', data, getReqOptions());
}

const contentType = 'image/jpeg';
const options = {
    headers: {
        Accept: '*/*',
        'Content-Type': contentType
    }
};

const reqOptions = () => _.merge(options, getReqOptions());

export async function getOffers(start, end) {
    const url = (start && end)
        ? `/admin/offer/excel?start=${start}&end=${end}`
        : '/admin/offer/excel';
    return Api.get(url, reqOptions(), 'blob');
}

export async function getFeedback(start, end) {
    const url = (start && end)
        ? `/admin/feedback/excel?start=${start}&end=${end}`
        : '/admin/feedback/excel';
    return Api.get(url, reqOptions(), 'blob');
}

export async function swapPositions(firstId, secondId, subDir) {
    subDir = !subDir ? '' : `${subDir}/`;
    return Api.put(`/admin/${subDir}swap`, { firstId, secondId }, getReqOptions());
}

export async function uploadFile(binaryFile, path) {
    return Api.upload(`/admin/file?path=${path}`, binaryFile, reqOptions());
}

export async function getDashboardInfo() {
    return Api.get('/admin/promoCampaign/promoCode/availablePromocodeReport', reqOptions());
}