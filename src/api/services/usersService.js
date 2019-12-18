import {Api} from '../apiClient';
import { getReqOptions } from './index';

export async function addUser(data) {
    return Api.post('/admin/user', data, getReqOptions);
}