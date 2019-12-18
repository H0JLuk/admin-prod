import { getSession } from './sessionService';

export const getReqOptions = () => {
    const token = getSession();
    return {
        headers: { token }
    };
};
