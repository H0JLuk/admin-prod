import _ from 'lodash';
import { Api } from '../apiClient';
import { getReqOptions } from './index';

const contentType = 'image/jpeg';
const options = {
    headers: {
        Accept: '*/*',
        'Content-Type': contentType
    }
};

const reqOptions = () => _.merge(options, getReqOptions());

export async function getOffers(start, end) {
    const url = (start && end)
        ? `/admin/offer/excel?start=${start}&end=${end}`
        : '/admin/offer/excel';
    return Api.get(url, reqOptions(), 'blob');
}

export async function getFeedback(start, end) {
    const url = (start && end)
        ? `/admin/feedback/excel?start=${start}&end=${end}`
        : '/admin/feedback/excel';
    return Api.get(url, reqOptions(), 'blob');
}

export async function swapPositions(firstId, secondId, subDir) {
    subDir = !subDir ? '' : `${subDir}/`;
    return Api.put(`/admin/${subDir}swap`, { firstId, secondId }, getReqOptions());
}

export async function uploadFile(binaryFile, path) {
    return Api.upload(`/admin/file?path=${path}`, binaryFile, reqOptions());
}

export async function getDashboardInfo() {
    return Api.get('/admin/promoCampaign/promoCode/availablePromocodeReport', reqOptions());
}