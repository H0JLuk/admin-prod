import { Api } from '../apiClient';
import { getReqOptions } from './index';
import _ from 'lodash';

export async function addUser(data) {
    return Api.post('/admin/user', data, getReqOptions());
}

const contentType = 'image/jpeg';
const options = {
    headers: {
        Accept: '*/*',
        'Content-Type': contentType
    }
};

const reqOptions = () => _.merge(options, getReqOptions());

export const getOffers = async () => {
    return Api.get('/admin/offer/excel', getReqOptions(), 'blob');
};

export const getFeedback = async () => {
    return Api.get('/admin/feedback/excel', getReqOptions(), 'blob');
};

export async function swapPositions(firstId, secondId, subDir) {
    subDir = !subDir ? '' : `${subDir}/`
    return Api.put(`/admin/${subDir}swap`, {firstId, secondId}, getReqOptions());
}

export async function uploadFile(binaryFile, path) {
    return Api.upload(`/admin/file?path=${path}`, binaryFile, reqOptions());
}

export async function getStaticUrl() {
    return Api.get('/settings/getStaticUrl', getReqOptions(), 'text');
}
