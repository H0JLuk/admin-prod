import behaviorTypes from '../../constants/behaviorTypes';
import { getReqOptions } from './index';
import { Api, FORM_DATA_CONTENT_TYPE } from '../apiClient';

const DEFAULT_OFFER_DURATION = 90;

export async function getPromoCampaignList() {
    return Api.post('/promo-campaign/list/filter', { checkVisibility: false }, getReqOptions());
}

export async function getPromoCampaignStatistics(promoCampaignId) {
    return Api.get(`/admin/promoCampaign/${promoCampaignId}/statistics`, getReqOptions());
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

export async function editPromoCampaign(promoCampaign) {
    return Api.put(`/admin/promoCampaign/${promoCampaign.id}`, normalizePromoCampaign(promoCampaign), getReqOptions());
}

export async function reorderPromoCampaigns(idMap) {
    return Api.post('/admin/promoCampaign/reorder/', { idMap }, getReqOptions());
}

export async function uploadPromoCodes(campaignId, data) {
    return Api.upload(`/admin/promoCampaign/promoCode?campaign-id=${campaignId}`, data, getReqOptions(FORM_DATA_CONTENT_TYPE));
}

export async function deletePromoCampaign(promoCampaignId) {
    return Api.delete(`/admin/promoCampaign/${promoCampaignId}`, getReqOptions());
}

export function getLocationsByText(value) {
    return Api.get(`/admin/location/search?name=${value}`, getReqOptions());
}

export function getSalePointsByText(value) {
    return Api.get(`/admin/salepoint/search?name=${value}`, getReqOptions());
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

export function getPromoCampaignVisibilitySettings(promoCampaignId, urlSearchParams) {
    return Api.get(`/admin/visibility-setting/promoCampaign/${promoCampaignId}?${urlSearchParams}`, getReqOptions());
}

export function editPromoCampaignVisibilitySetting(visibilitySettingId, visibilitySetting) {
    return Api.put(`/admin/visibility-setting/${visibilitySettingId}`, visibilitySetting, getReqOptions());
}

export function deletePromoCampaignVisibilitySetting(visibilitySettingId) {
    return Api.delete(`/admin/visibility-setting/${visibilitySettingId}`, getReqOptions());
}
