import { Api } from '../apiClient';
import { getReqOptions } from './index';
import _ from 'lodash';

const contentType = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet';
const options = {
    headers: {
        Accept: '*/*',
        'Content-Type': contentType
    }
};

const reqOptions = _.merge(options, getReqOptions());

export async function addUser(data) {
    return Api.post('/admin/user', data, reqOptions);
}

export const getOffers = async () => {
    return Api.get('/admin/offer/excel', reqOptions, 'blob');
};

export const getFeedback = async () => {
    return Api.get('/admin/feedback/excel', reqOptions, 'blob');
};