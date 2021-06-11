import { Api } from '../apiClient';
import { getReqOptions } from './index';

const STATIC_URL = 'STATIC_URL';

export async function getStaticUrlFromBackend() {
    return Api.get('/settings/getStaticUrl', getReqOptions(), 'text');
}

export function updateSettingsList(updatedSettingsObj) {
    const options = getReqOptions();
    delete options.headers.clientAppCode;
    return Api.put('/admin/setting', updatedSettingsObj, options);
}

export function addSettings(settingObj) {
    return Api.post('/admin/setting/addList', settingObj, getReqOptions());
}

export function getSettingsList(appCode) {
    const options = getReqOptions();
    delete options.headers.clientAppCode;
    return Api.get(`/admin/setting/${appCode}`, options);
}

export function getAllSettings() {
    return Api.get('/admin/setting/', getReqOptions());
}

export function saveStaticUrl(staticUrl) {
    window.localStorage.setItem(STATIC_URL, staticUrl);
}

export function getStaticUrl() {
    return window.localStorage.getItem(STATIC_URL);
}

export function getBusinessRoles() {
    return Api.get('/business-role/list', getReqOptions());
}

export function getBusinessRolesByClientApp(clientAppId) {
    return Api.get(`/admin/business-role/list?clientAppId=${clientAppId}`, getReqOptions());
}
