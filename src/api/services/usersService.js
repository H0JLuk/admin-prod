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

export async function getUsersList(searchParams) {
    return Api.get(`/admin/user/filtered?${searchParams}`, getReqOptions());
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

function getReqForFileUpload (appCode) {
    const options = getReqOptions();
    options.headers.clientAppCode = appCode;
    options.headers['Content-Type'] = 'multipart/form-data';
    options.headers['Accept'] = '*/*';
    return options;
}

export function addUsersWithTemplate (appCode, data) {
    const options = getReqForFileUpload(appCode);
    return Api.upload('/admin/user/upload/file', data, options, 'blob');
}

export function deleteUsersWithTemplate (appCode, data) {
    const options = getReqForFileUpload(appCode);
    return Api.upload('/admin/user/delete/file', data, options, 'blob');
}