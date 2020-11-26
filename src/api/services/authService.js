import { getSession, deleteUserData } from './sessionService';
import { Api } from '../apiClient';
import { getReqOptions } from './index';

export async function login(credentials) {
    return Api.post('/login', credentials);
}

export async function logout() {
    try {
        await Api.post('/logout','', getReqOptions(), 'text');
    } catch (e) {
        console.error(e.message);
    } finally {
        deleteUserData();
    }
}

export const isLoggedIn = () => !!getSession();