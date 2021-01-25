import { Api } from '../apiClient';
import { getReqOptions } from './index';
import { getRequestCacheDecorator } from '../../utils/apiUtils';


const STATIC_URL = 'STATIC_URL';

export async function getStaticUrlFromBackend() {
    return Api.get('/settings/getStaticUrl', getReqOptions(), 'text');
}

export async function getInstallationUrl() {
    return getRequestCacheDecorator(Api, '/settings/getInstallationUrl', getReqOptions(), 'text');
}

export async function getUsageUrl() {
    return getRequestCacheDecorator(Api, '/settings/getUsageUrl', getReqOptions(), 'text');
}

export function updateSettingsList(updatedSettingsObj) {
    const options = getReqOptions();
    delete options.headers.clientAppCode;
    return Api.put('/admin/setting', updatedSettingsObj, options);
}

export function addSetting(settingObj) {
    return Api.post('/admin/setting', settingObj, getReqOptions());
}

export function getSettingsList(appCode) {
    const options = getReqOptions();
    delete options.headers.clientAppCode;
    return Api.get(`/admin/setting/${appCode}`, options);
}

export function saveStaticUrl(staticUrl) {
    window.localStorage.setItem(STATIC_URL, staticUrl);
}

export function getStaticUrl() {
    return window.localStorage.getItem(STATIC_URL);
}
