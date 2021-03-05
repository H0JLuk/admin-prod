import merge from 'lodash/merge';
import cloneDeep from 'lodash/cloneDeep';
import { goToLogin } from '../../utils/appNavigation';
import { deleteUserData } from '../services/sessionService';

const defaultOptions = {
    headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json'
    }
};

export default class ApiClient {
    constructor(config) {
        this.baseUrl = config.baseUrl;
        this.options = merge(cloneDeep(defaultOptions), config.options);
    }

    setHistory(history) {
        this.history = history;
    }

    async request(url, reqOptions = {}, responseType = 'json') {
        const { body, ...restOptions } = reqOptions;
        const urlWithParams = new URL(`${this.baseUrl}${url}`);
        const mergedOptions = merge(cloneDeep(this.options), restOptions);

        try {
            const contentType = mergedOptions.headers['Content-Type'];
            if (contentType.startsWith('multipart/form-data')) {
                delete mergedOptions.headers['Content-Type'];
            }
            const response = await fetch(urlWithParams.toString(), {
                ...mergedOptions,
                body
            });

            if (response.ok) {
                switch (responseType) {
                    case 'text':
                        return response.text();
                    case 'blob':
                        return response.blob();
                    case 'json':
                        return response.json();
                    default:
                        return response;
                }
            }

            if (response.status >= 400) {
                if (response.status === 403) {
                    deleteUserData();
                    goToLogin(this.history);
                    // window.location.href = ROUTE.LOGIN;
                }
                return this.errorMessageHandler(response);
            }

            return this.errorMessageHandler(response);
        } catch (error) {
            return this.defaultErrorHandler(error);
        }
    }

    async get(url, reqOptions, responseType) {
        return this.request(url, reqOptions, responseType);
    }

    async post(url, body, reqOptions, responseType) {
        return this.request(url, {
            ...reqOptions,
            method: 'POST',
            body: JSON.stringify(body)
        }, responseType);
    }

    async upload(url, body, reqOptions = {}, responseType = 'json') {
        return this.request(url, {
            ...reqOptions,
            method: 'POST',
            body
        }, responseType);
    }

    async update(url, body, reqOptions = {}) {
        return this.request(url, {
            ...reqOptions,
            method: 'PUT',
            body
        });
    }

    async put(url, body, reqOptions) {
        return this.request(url, {
            ...reqOptions,
            method: 'PUT',
            body: JSON.stringify(body)
        });
    }

    async delete(url, reqOptions) {
        return this.request(url, {
            ...reqOptions,
            method: 'DELETE'
        });
    }

    authErrorHandler() {
        return Promise.reject(new Error('Auth failed'));
    }

    async errorMessageHandler(errorResponse) {
        console.log('Api client: request errorCode', errorResponse);
        let msg = '';
        const responseText = await errorResponse.text();
        try {
            msg = JSON.parse(responseText);
            if (msg.message) {
                console.log(msg.message);
            }
        } catch (e) {
            console.info('Couldn\'t parse error response JSON: ', e);
            msg = responseText;
        }
        return Promise.reject(msg);
    }

    defaultErrorHandler(error) {
        console.log('Api client: request errorCode', error);
        return Promise.reject(error);
    }
}
