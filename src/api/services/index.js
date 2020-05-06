import {getClientAppCodeHeader, getSession} from './sessionService';

export const getReqOptions = () => {
    const token = getSession();
    const clientAppCode = getClientAppCodeHeader();
    return {
        headers: { token, clientAppCode }
    };
};
