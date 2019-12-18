const token = 'dzo_token';

export function storeUserData(userToken) {
    window.sessionStorage.setItem(token, userToken);
}

export function deleteUserData() {
    window.sessionStorage.removeItem(token);
}

export function getSession() {
    return window.sessionStorage.getItem(token);
}