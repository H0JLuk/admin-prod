import { getAppCode, getSession } from './sessionService';

export const getReqOptions = () => {
    const token = getSession();
    const clientAppCode = getAppCode();
    return {
        headers: { token, clientAppCode }
    };
};
