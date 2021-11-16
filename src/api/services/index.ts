import { ApiRequestHeaders, ApiRequestOptions } from '@types';
import { getDefaultAppCode } from './clientAppService';
import { getAppCode, getSession } from './sessionService';

const TOKEN_HEADER = 'token';
const APP_CODE_HEADER = 'clientAppCode';
const CONTENT_TYPE = 'Content-Type';
const ACCEPT = 'Accept';

export const getReqOptions = (contentType?: string, currAppCode?: string): ApiRequestOptions => {
    const token = getSession();
    const appCode = currAppCode || getAppCode() || getDefaultAppCode(); // TODO: remove getDefaultAppCode after second phase
    const headers = {} as ApiRequestHeaders;
    token && (headers[TOKEN_HEADER] = token);
    appCode && (headers[APP_CODE_HEADER] = appCode);
    contentType && (headers[ACCEPT] = '*/*');
    contentType && (headers[CONTENT_TYPE] = contentType);
    return { headers };
};

export const withDefaultArrayData = async <R = Record<string, any>>(apiRequest: Promise<R>, fieldKey: Exclude<keyof R, 'message' | 'status'>) => {
    const response = await apiRequest;
    if (!response[fieldKey]) {
        response[fieldKey] = [] as unknown as R[Exclude<keyof R, 'message' | 'status'>];
    }
    return response;
};
