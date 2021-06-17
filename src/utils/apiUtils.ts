import { ApiRequestOptions } from '@types';
import { Api } from '../api/apiClient';

type ICache = Record<string, string>;

const cache: ICache = {};

export const getRequestCacheDecorator = (url: string, params: ApiRequestOptions, responseType: XMLHttpRequestResponseType) => {
    if (cache[url] !== undefined) {
        return Promise.resolve(cache[url]);
    }
    return Api.get<string>(url, params, responseType).then(response => (
        cache[url] = response
    ));
};
