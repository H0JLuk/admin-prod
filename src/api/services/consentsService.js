import { Api } from '../apiClient';
import { getReqOptions } from './index';

export function getConsentsList() {
    return Api.get('/admin/consent', getReqOptions());
}

export function deleteConsent(id) {
    return Api.delete(`/admin/consent/${id}`, getReqOptions());
}

export async function createConsent(consent) {
    return Api.post('/admin/consent', consent, getReqOptions());
}

export async function updateConsent(consent) {
    return Api.put('/admin/consent', consent, getReqOptions());
}

export async function attachConsentToClientApp(id, appCode) {
    return Api.post(`/admin/consent/${id}?clientAppCode=${appCode}`, {}, getReqOptions());
}
export const getConsentById = async (consentId) => {
    const { list =[] } = await getConsentsList();
    return list.find(({ id }) => id === +consentId);
};
