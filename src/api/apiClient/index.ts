import ApiClient from './ApiClient';

export const baseUrl = process.env.REACT_APP_BACKEND_URL;

export const FORM_DATA_CONTENT_TYPE = 'multipart/form-data;';

export const Api = new ApiClient({
    baseUrl,
});
