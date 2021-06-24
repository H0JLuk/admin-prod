import { History } from 'history';
import merge from 'lodash/merge';
import cloneDeep from 'lodash/cloneDeep';
import { goToLogin } from '@utils/appNavigation';
import { deleteUserData } from '@apiServices/sessionService';
import { APPLICATION_JSON_TYPE } from '@constants/common';
import { ApiRequestOptions, ApiConfig, ApiRequest, ApiRequestBody } from '@types';

const defaultOptions = {
    headers: {
        Accept: APPLICATION_JSON_TYPE,
        'Content-Type': APPLICATION_JSON_TYPE,
    },
};

export default class ApiClient {
    baseUrl?: string;
    options: ApiRequestOptions;
    history!: History;

    constructor(config: ApiConfig) {
        this.baseUrl = config.baseUrl;
        this.options = merge(cloneDeep(defaultOptions), config.options);
    }

    setHistory(history: History) {
        this.history = history;
    }

    async request(url: string, reqOptions = {} as ApiRequest, responseType: XMLHttpRequestResponseType = 'json') {
        const { body, ...restOptions } = reqOptions;
        const urlWithParams = new URL(`${this.baseUrl}${url}`);
        const mergedOptions = merge(cloneDeep(this.options), restOptions);

        try {
            const contentType = mergedOptions.headers['Content-Type'] ?? '';
            if (contentType.startsWith('multipart/form-data')) {
                delete mergedOptions.headers['Content-Type'];
            }
            const response = await fetch(urlWithParams.toString(), {
                ...mergedOptions,
                body,
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

    get<R = any>(
        url: string,
        reqOptions: ApiRequestOptions,
        responseType?: XMLHttpRequestResponseType,
    ): Promise<R> {
        return this.request(url, reqOptions, responseType);
    }

    post<R = any>(
        url: string,
        body: ApiRequestBody,
        reqOptions = {} as ApiRequestOptions,
        responseType?: XMLHttpRequestResponseType,
    ): Promise<R> {
        return this.request(url, {
            ...reqOptions,
            method: 'POST',
            body: JSON.stringify(body),
        }, responseType);
    }

    upload<R = any>(
        url: string,
        body: Blob | FormData,
        reqOptions = {} as ApiRequestOptions,
        responseType: XMLHttpRequestResponseType = 'json',
    ): Promise<R> {
        return this.request(url, {
            ...reqOptions,
            method: 'POST',
            body,
        }, responseType);
    }

    update<R = any>(url: string, body: FormData, reqOptions = {} as ApiRequestOptions): Promise<R> {
        return this.request(url, {
            ...reqOptions,
            method: 'PUT',
            body,
        });
    }

    put<R = any>(url: string, body: ApiRequestBody, reqOptions: ApiRequestOptions): Promise<R> {
        return this.request(url, {
            ...reqOptions,
            method: 'PUT',
            body: JSON.stringify(body),
        });
    }

    delete<R = any>(url: string, reqOptions: ApiRequestOptions): Promise<R> {
        return this.request(url, {
            ...reqOptions,
            method: 'DELETE',
        });
    }

    authErrorHandler() {
        return Promise.reject(new Error('Auth failed'));
    }

    async errorMessageHandler(errorResponse: Response) {
        console.log('Api client: request errorCode', errorResponse);
        let msg: string | Record<string, string> = '';
        const responseText = await errorResponse.text();
        try {
            msg = JSON.parse(responseText);
            if (typeof msg !== 'string' && msg.message) {
                console.log(msg.message);
            }
        } catch (e) {
            console.info('Couldn\'t parse error response JSON: ', e);
            msg = responseText;
        }
        return Promise.reject(msg);
    }

    defaultErrorHandler(error: any) {
        console.log('Api client: request errorCode', error);
        return Promise.reject(error);
    }
}
