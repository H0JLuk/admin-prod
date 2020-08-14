import { getAppCode, getSession } from './sessionService';

const TOKEN_HEADER = 'token';
const APP_CODE_HEADER = 'clientAppCode';

export const getReqOptions = () => {
    const token = getSession();
    const appCode = getAppCode();
    const headers = {};
    token && (headers[TOKEN_HEADER] = token);
    appCode && (headers[APP_CODE_HEADER] = appCode);
    return { headers };
};
