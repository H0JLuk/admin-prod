import { Api } from '../apiClient';
import { getReqOptions } from './index';
import {
    DefaultApiResponse,
    RegisterUserRequest,
    ResetUserPassword,
    SaveUserResponse,
    UpdateUserRequest,
    UpdateUsersSalePoint,
    UserDto,
    UserInfo,
    UserPaginationResponse,
} from '@types';

export function getUser(pn: string) {
    return Api.get<UserInfo>(`/admin/user/${pn}`, getReqOptions());
}

export function oldAddUser(data: UserDto) {
    return Api.post<SaveUserResponse>('/admin/user', data, getReqOptions());
}

export function addUser(data: RegisterUserRequest) {
    return Api.post<DefaultApiResponse & SaveUserResponse>('/admin/user/register', data, getReqOptions());
}

export function oldRemoveUser(pn: string) {
    return Api.delete<DefaultApiResponse>(`/admin/user/${pn}`, getReqOptions());
}

export function removeUser(userId: number) {
    return Api.delete<DefaultApiResponse>(`/admin/user/delete/${userId}`, getReqOptions());
}

export function getUsersList(searchParams: string) {
    return Api.get<UserPaginationResponse>(`/admin/user/filtered?${searchParams}`, getReqOptions());
}

// TODO: раскомментировать после добавления на бэке запроса на удаление нескольких пользователей
/*
export function removeUsers(usersIds: number[]) {
    return Api.delete(`/admin/user/${usersIds}`, getReqOptions());
}
*/

export function resetUser(pn: string) {
    return Api.post<ResetUserPassword>(`/admin/user/reset/${pn}`, {}, getReqOptions());
}

export function unblockUser(pn: string) {
    return Api.post<DefaultApiResponse>(`/admin/user/unblock/${pn}`, {}, getReqOptions());
}

export function saveUser(id: number, data: UpdateUserRequest) {
    return Api.post<DefaultApiResponse & { newPassword?: string; }>(`/admin/user/edit/${id}`, data, getReqOptions());
}

export function editLocationAndSalePointUsers(data: UpdateUsersSalePoint) {
    return Api.post<DefaultApiResponse>('/admin/user/editSalePoint', data, getReqOptions());
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
