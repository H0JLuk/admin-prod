import { ApiRequestHeaders, ApiRequestOptions, DefaultApiResponse } from '@types';
import { Api } from '../apiClient';
import { getDefaultAppCode } from './clientAppService';
import { getAppCode, getSession } from './sessionService';

const TOKEN_HEADER = 'token';
const APP_CODE_HEADER = 'clientAppCode';
const CONTENT_TYPE = 'Content-Type';
const ACCEPT = 'Accept';

export const getReqOptions = (contentType?: string): ApiRequestOptions => {
    const token = getSession();
    const appCode = getAppCode() || getDefaultAppCode(); // TODO: remove getDefaultAppCode after second phase
    const headers = {} as ApiRequestHeaders;
    token && (headers[TOKEN_HEADER] = token);
    appCode && (headers[APP_CODE_HEADER] = appCode);
    contentType && (headers[ACCEPT] = '*/*');
    contentType && (headers[CONTENT_TYPE] = contentType);
    return { headers };
};

export function updateTokenLifetime() {
    return Api.post<DefaultApiResponse>('/user/token/update', {}, getReqOptions());
}
