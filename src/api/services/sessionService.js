const token = 'dzo_token';

export function storeUserData(userToken, personalNumber) {
    window.localStorage.setItem(token, userToken);
}

export function deleteUserData() {
    window.localStorage.removeItem(token);
}

export function getSession() {
    return window.localStorage.getItem(token);
}