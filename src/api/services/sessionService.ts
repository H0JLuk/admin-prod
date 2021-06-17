import ROLES from '@constants/roles';
import { removeDefaultAppCode } from './clientAppService';

const TOKEN = 'dzo_token';
const ROLE = 'role';
const APP_CODE = 'appCode';

export function storeUserData(userToken: string, userRole: string) {
    window.sessionStorage.setItem(TOKEN, userToken);
    window.sessionStorage.setItem(ROLE, userRole);
}

export function deleteUserData() {
    window.sessionStorage.removeItem(TOKEN);
    window.sessionStorage.removeItem(ROLE);
    deleteAppCode();
    removeDefaultAppCode(); /* TODO: remove this after second phase */
}

export function getSession() {
    return window.sessionStorage.getItem(TOKEN);
}

export function getRole(): ROLES {
    return (window.sessionStorage.getItem(ROLE) || '') as ROLES;
}

export function saveAppCode(appCode: string) {
    window.sessionStorage.setItem(APP_CODE, appCode);
}

export function deleteAppCode() {
    window.sessionStorage.removeItem(APP_CODE);
}

export function getAppCode() {
    return window.sessionStorage.getItem(APP_CODE);
}
