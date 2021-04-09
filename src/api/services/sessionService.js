import { removeDefaultAppCode } from './clientAppService';

const TOKEN = 'dzo_token';
const ROLE = 'role';
const APP_CODE = 'appCode';
const LOGIN_TYPE = 'loginType';

export function storeUserData(userToken, userRole) {
    window.sessionStorage.setItem(TOKEN, userToken);
    window.sessionStorage.setItem(ROLE, userRole);
}

export function deleteUserData() {
    window.sessionStorage.removeItem(TOKEN);
    window.sessionStorage.removeItem(ROLE);
    deleteAppCode();
    removeDefaultAppCode(); /* TODO: remove this after second phase */
    deleteLoginType();
}

export function getSession() {
    return window.sessionStorage.getItem(TOKEN);
}

export function getRole() {
    return window.sessionStorage.getItem(ROLE);
}

export function saveAppCode(appCode) {
    window.sessionStorage.setItem(APP_CODE, appCode);
}

export function deleteAppCode() {
    window.sessionStorage.removeItem(APP_CODE);
}

export function getAppCode() {
    return window.sessionStorage.getItem(APP_CODE);
}

export function saveLoginType(loginType) {
    return window.sessionStorage.setItem(LOGIN_TYPE, loginType);
}

export function getLoginType() {
    return window.sessionStorage.getItem(LOGIN_TYPE);
}

export function deleteLoginType() {
    return window.sessionStorage.removeItem(LOGIN_TYPE);
}