import { getSession, deleteUserData } from './sessionService';
import { Api } from '../apiClient';
import { getReqOptions } from './index';

export async function login(credentials) {
    return Api.post('/login', credentials);
}

export async function logout() {
    return Api.post('/logout','', getReqOptions(), 'text')
        .then(() => {
            deleteUserData();
        });
}

export const isLoggedIn = () => !!getSession();