import behaviorTypes from '../../constants/behaviorTypes';
import { getReqOptions } from './index';
import { Api, FORM_DATA_CONTENT_TYPE } from '../apiClient';

const DEFAULT_OFFER_DURATION = 90;

export async function getPromoCampaignList() {
    return Api.post('/promo-campaign/list/filter', { checkVisibility: false }, getReqOptions());
}

export function getFilteredPromoCampaignList(data) {
    if (!data.sortBy) {
        delete data.sortBy;
        delete data.direction;
    }
    return Api.post('/promo-campaign/list/filter', { ...data, checkVisibility: false }, getReqOptions());
}

export function getExactFilteredPromoCampaignList(filterText, appCode) {
    const options = getReqOptions();
    if (appCode) {
        options.headers.clientAppCode = appCode;
    }
    return Api.post('/promo-campaign/list/filter', { filterText, checkVisibility: false, exactMatch: true }, options);
}

export function getExactExternalIDPromoCampaignList(externalId) {
    return Api.post('/promo-campaign/list/filter', { externalId, checkVisibility: false, ignoreAppCode: true }, getReqOptions());
}

export async function getPromoCampaignStatistics(promoCampaignId) {
    return Api.get(`/admin/promoCampaign/${promoCampaignId}/statistics`, getReqOptions());
}

export function getPromoCampaignById(id) {
    return Api.get(`/promo-campaign/list/?id=${id}`, getReqOptions());
}

function normalizePromoCampaign(promoCampaign) {
    // TODO: send original promoCampaign without changing behaviorType and offerDuration
    const behaviorType = promoCampaign?.behaviorType ?? behaviorTypes.QR;
    const offerDuration = promoCampaign?.offerDuration ?? DEFAULT_OFFER_DURATION;
    return { ...promoCampaign, behaviorType, offerDuration };
}

export async function createPromoCampaign(promoCampaign) {
    return Api.post('/admin/promoCampaign', normalizePromoCampaign(promoCampaign), getReqOptions());
}

export function newPromoCampaign(promoCampaign, appCode) {
    const options = getReqOptions();
    options.headers.clientAppCode = appCode;
    return Api.post('/admin/promoCampaign', normalizePromoCampaign(promoCampaign), options);
}

export async function editPromoCampaign(promoCampaign) {
    return Api.put(`/admin/promoCampaign/${promoCampaign.id}`, normalizePromoCampaign(promoCampaign), getReqOptions());
}

export function copyPromoCampaign(id, promoCampaign) {
    return Api.post(`/admin/promoCampaign/${id}`, normalizePromoCampaign(promoCampaign), getReqOptions());
}

export async function reorderPromoCampaigns(idMap) {
    return Api.post('/admin/promoCampaign/reorder/', { idMap }, getReqOptions());
}

export async function uploadPromoCodes(campaignId, data) {
    return Api.upload(`/admin/promoCampaign/promoCode?campaign-id=${campaignId}`, data, getReqOptions(FORM_DATA_CONTENT_TYPE));
}

export function deletePromoCampaign(promoCampaignId) {
    return Api.delete(`/admin/promoCampaign/${promoCampaignId}`, getReqOptions());
}

export function getLocationsByText(value) {
    return Api.get(`/admin/location/search?name=${value}`, getReqOptions());
}

function getSalePointParams(name, locationId) {
    const params = Object.entries({ name, locationId }).reduce((result, [key, val]) => {
        if (!val) {
            return result;
        }

        return { ...result, [key]: val };
    }, {});

    return new URLSearchParams(params).toString();
}

export function getSalePointsByText(value, locationId) {
    return Api.get(`/admin/salepoint/search?${getSalePointParams(value, locationId)}`, getReqOptions());
}

/**
 * @param {{
 *  locationId: number;
 *  promoCampaignId: number;
 *  salePointId?: number | undefined;
 *  visible: boolean;
 * }} data
 */
export function addVisibilitySetting(data) {
    return Api.post('/admin/visibility-setting', data, getReqOptions());
}

export function newVisibilitySetting(data, appCode) {
    const options = getReqOptions();
    options.headers.clientAppCode = appCode;
    return Api.post('/admin/visibility-setting', data, options);
}

export function getPromoCampaignVisibilitySettings(promoCampaignId, urlSearchParams) {
    return Api.get(`/admin/visibility-setting/promoCampaign/${promoCampaignId}?${urlSearchParams}`, getReqOptions());
}

export function editPromoCampaignVisibilitySetting(visibilitySettingId, visibilitySetting) {
    return Api.put(`/admin/visibility-setting/${visibilitySettingId}`, visibilitySetting, getReqOptions());
}

export function deletePromoCampaignVisibilitySetting(visibilitySettingId) {
    return Api.delete(`/admin/visibility-setting/${visibilitySettingId}`, getReqOptions());
}

export function getPromoCampaignByExternalId(externalId) {
    return Api.get(`/promo-campaign/external/${externalId}`, getReqOptions(), 'text');
}
