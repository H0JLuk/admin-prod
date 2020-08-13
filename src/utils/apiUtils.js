const cache = {};

export const getRequestCacheDecorator = (Api, url, params, responseType) => {
    if (cache[url] !== undefined) {
        return Promise.resolve(cache[url]);
    }
    return Api.get(url, params, responseType).then(response => {
        return cache[url] = response;
    });
};
