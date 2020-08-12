import { Api } from '../apiClient';
import { getReqOptions } from './index';
import { getRequestCacheDecorator } from '../../utils/apiUtils';


const STATIC_URL = 'STATIC_URL';

export async function getStaticUrlFromBackend() {
    return Api.get( '/settings/getStaticUrl', getReqOptions(), 'text' );
}

export async function getInstallationUrl() {
    return getRequestCacheDecorator(Api, '/settings/getInstallationUrl', getReqOptions(), 'text' );
}

export async function getUsageUrl() {
    return getRequestCacheDecorator(Api, '/settings/getUsageUrl', getReqOptions(), 'text' );
}

export function saveStaticUrl(staticUrl) {
    window.localStorage.setItem(STATIC_URL, staticUrl);
}

export function getStaticUrl() {
    return window.localStorage.getItem(STATIC_URL);
}
