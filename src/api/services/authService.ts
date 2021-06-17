import { getSession, deleteUserData } from './sessionService';
import { Api } from '../apiClient';
import { getReqOptions } from './index';
import { DefaultApiResponse, LoginResponse, UserDto } from '@types';

export function login(credentials: UserDto) {
    return Api.post<LoginResponse>('/login', credentials);
}

export async function logout() {
    try {
        await Api.post<DefaultApiResponse>('/logout', {}, getReqOptions(), 'text');
    } catch (e) {
        console.error(e.message);
    } finally {
        deleteUserData();
    }
}

export const isLoggedIn = () => !!getSession();
