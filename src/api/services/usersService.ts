import ROLES from '@constants/roles';
import { getURLSearchParams } from '@utils/helper';
import { Api } from '../apiClient';
import { getReqOptions } from './index';
import { DIRECTION } from '@constants/common';
import {
    DefaultApiResponse,
    DirectLinkRequest,
    RegisterUserRequest,
    ResetUserPassword,
    SaveUserResponse,
    QRRequest,
    UpdateUserRequest,
    UpdateUsersSalePoint,
    UserInfo,
    UserPaginationResponse,
    UpdateUsersLoginType,
} from '@types';

export function getUser(userId: string | number) {
    return Api.get<UserInfo>(`/admin/user/${userId}`, getReqOptions());
}

export function addUser(data: RegisterUserRequest) {
    return Api.post<SaveUserResponse>('/admin/user/register', data, getReqOptions());
}

export function removeUser(userId: number) {
    return Api.delete<DefaultApiResponse>(`/admin/user/delete/${userId}`, getReqOptions());
}

export function getUsersList(searchParams: string, parentUserName?: string) {
    if (parentUserName) {
        searchParams += `&parentUserName=${parentUserName}`;
    }
    return Api.get<UserPaginationResponse>(`/admin/user/filtered?${searchParams}`, getReqOptions());
}

export async function getPartnersList(filterText = '') {
    const searchParams = getURLSearchParams({
        filterText,
        pageNo: 0,
        direction: DIRECTION.ASC,
        pageSize: 15,
        userRole: ROLES.PARTNER,
    });
    const { users } = await getUsersList(searchParams);
    return users;
}

export function resetUser(pn: string) {
    return Api.post<ResetUserPassword>(`/admin/user/reset/${pn}`, {}, getReqOptions());
}

export function unblockUser(pn: string) {
    return Api.post<DefaultApiResponse>(`/admin/user/unblock/${pn}`, {}, getReqOptions());
}

export function editUser(id: number, data: UpdateUserRequest) {
    return Api.post<DefaultApiResponse & { newPassword?: string; }>(`/admin/user/edit/${id}`, data, getReqOptions());
}

export function editLoginTypeUsers(data: UpdateUsersLoginType) {
    return Api.post<DefaultApiResponse>('/admin/user/editLoginType', data, getReqOptions());
}

export function editLocationAndSalePointUsers(data: UpdateUsersSalePoint) {
    return Api.post<DefaultApiResponse>('/admin/user/editSalePoint', data, getReqOptions());
}

export function getLinkForQR(data: DirectLinkRequest) {
    return Api.post<string>('/admin/user/direct/link', data, getReqOptions(), 'text');
}

export function generateQRCodes(data: QRRequest) {
    return Api.post<Blob>('/admin/user/direct/links', data, getReqOptions('application/json'), 'blob');
}

function getReqForFileUpload(appCode: string) {
    const options = getReqOptions('multipart/form-data');
    options.headers.clientAppCode = appCode;
    return options;
}

export function addUsersWithTemplate(appCode: string, data: FormData) {
    const options = getReqForFileUpload(appCode);
    return Api.upload<Blob>('/admin/user/upload/file', data, options, 'blob');
}

export function deleteUsersWithTemplate(appCode: string, data: FormData) {
    const options = getReqForFileUpload(appCode);
    return Api.upload<Blob>('/admin/user/delete/file', data, options, 'blob');
}
