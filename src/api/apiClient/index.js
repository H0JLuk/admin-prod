import ApiClient from './ApiClient';

export const Api = new ApiClient({
    baseUrl: process.env.REACT_APP_BACKEND_URL
});
