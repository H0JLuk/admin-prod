import { Api } from '../apiClient';
import { getReqOptions } from './index';
import {
    BusinessRoleDto,
    DefaultApiResponse,
    ISettingList,
    ListResponse,
    SettingDto,
} from '@types';

const STATIC_URL = 'STATIC_URL';

export function getStaticUrlFromBackend() {
    return Api.get<string>('/settings/getStaticUrl', getReqOptions(), 'text');
}

export function updateSettingsList(updatedSettingsObj: SettingDto[]) {
    const options = getReqOptions();
    delete options.headers.clientAppCode;
    return Api.put<DefaultApiResponse>('/admin/setting', updatedSettingsObj, options);
}

export function addSettings(settingObj: SettingDto[]) {
    return Api.post<DefaultApiResponse>('/admin/setting/addList', settingObj, getReqOptions());
}

export function getSettingsList(appCode: string) {
    const options = getReqOptions();
    delete options.headers.clientAppCode;
    return Api.get<ISettingList>(`/admin/setting/${appCode}`, options);
}

export function getAllSettings() {
    return Api.get<ISettingList>('/admin/setting', getReqOptions());
}

export function saveStaticUrl(staticUrl: string) {
    window.localStorage.setItem(STATIC_URL, staticUrl);
}

export function getStaticUrl() {
    return window.localStorage.getItem(STATIC_URL);
}

export function getBusinessRoles() {
    return Api.get<ListResponse<BusinessRoleDto>>('/business-role/list', getReqOptions());
}

export function getBusinessRolesByClientApp(clientAppId: number) {
    return Api.get<ListResponse<BusinessRoleDto>>(`/admin/business-role/list?clientAppId=${clientAppId}`, getReqOptions());
}
