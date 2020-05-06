const token = 'dzo_token';
const clientAppCodeHeader = 'clientAppCode'

export function storeUserData(userToken) {
    window.sessionStorage.setItem(token, userToken);
}

export function deleteUserData() {
    window.sessionStorage.removeItem(token);
}

export function getSession() {
    return window.sessionStorage.getItem(token);
}

export function storeClientAppCodeHeader(clientAppCode) {
    window.sessionStorage.setItem(clientAppCodeHeader, clientAppCode);
}

export function deleteClientAppCodeHeader() {
    window.sessionStorage.removeItem(clientAppCodeHeader);
}

export function getClientAppCodeHeader() {
    return window.sessionStorage.getItem(clientAppCodeHeader);
}