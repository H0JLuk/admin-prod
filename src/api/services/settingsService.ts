import { Api } from '../apiClient';
import { getReqOptions, withDefaultArrayData } from './index';
import { DefaultApiResponse, ISettingList, SettingDto, SettingKeys } from '@types';

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
    return withDefaultArrayData(Api.get<ISettingList>(`/admin/setting/${appCode}`, options), 'settingDtoList');
}

export function getSettingsByKeys(settingKey: string, { role, code }: SettingKeys = {}) {
    const keys = {} as Record<string, string>;
    role && (keys.role = role);
    code && (keys.code = code);
    const urlSearchParams = new URLSearchParams(keys);
    return withDefaultArrayData(Api.get<ISettingList>(`/admin/setting/key/${settingKey}?${urlSearchParams}`, getReqOptions()), 'settingDtoList');
}

export function saveStaticUrl(staticUrl: string) {
    window.localStorage.setItem(STATIC_URL, staticUrl);
}

export function getStaticUrl() {
    return window.localStorage.getItem(STATIC_URL);
}
