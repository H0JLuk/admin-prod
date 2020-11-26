import { Api } from '../apiClient';
import { getAppCode, getSession } from './sessionService';

const TOKEN_HEADER = 'token';
const APP_CODE_HEADER = 'clientAppCode';
const CONTENT_TYPE = 'Content-Type';
const ACCEPT = 'Accept';

export const getReqOptions = (contentType) => {
    const token = getSession();
    const appCode = getAppCode();
    const headers = {};
    token && (headers[TOKEN_HEADER] = token);
    appCode && (headers[APP_CODE_HEADER] = appCode);
    contentType && (headers[ACCEPT] = '*/*');
    contentType && (headers[CONTENT_TYPE] = contentType);
    return { headers };
};

export function updateTokenLifetime() {
    return Api.post('/user/token/update', {}, getReqOptions());
}
