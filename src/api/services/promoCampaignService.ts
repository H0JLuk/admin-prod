import { getReqOptions } from './index';
import { Api, FORM_DATA_CONTENT_TYPE } from '../apiClient';
import { DEFAULT_OFFER_DURATION } from '@constants/promoCampaigns';
import {
    DefaultApiResponse,
    DefaultCreateDtoResponse,
    ListResponse,
    LocationDto,
    PromoCampaignCreateDto,
    PromoCampaignDto,
    PromoCampaignListResponse,
    PromoCampaignStatisticsResponse,
    SalePointDto,
    VisibilitySettingsPaginationResponse,
    VisibilitySettingsRequest,
} from '@types';

export function getPromoCampaignList() {
    return Api.post<PromoCampaignListResponse>('/promo-campaign/list/filter', { checkVisibility: false }, getReqOptions());
}

export function getFilteredPromoCampaignList(data: Record<string, string | number>) {
    if (!data.sortBy) {
        delete data.sortBy;
        delete data.direction;
    }
    return Api.post<PromoCampaignListResponse>('/promo-campaign/list/filter', { ...data, checkVisibility: false }, getReqOptions());
}

export function getExactFilteredPromoCampaignList(filterText: string, appCode: string) {
    const options = getReqOptions();
    if (appCode) {
        options.headers.clientAppCode = appCode;
    }
    return Api.post<PromoCampaignListResponse>('/promo-campaign/list/filter', { filterText, checkVisibility: false, exactMatch: true }, options);
}

export function getExactExternalIDPromoCampaignList(externalId: string) {
    return Api.post<PromoCampaignListResponse>('/promo-campaign/list/filter', { externalId, checkVisibility: false, ignoreAppCode: true }, getReqOptions());
}

export function getPromoCampaignStatistics(promoCampaignId: number) {
    return Api.get<PromoCampaignStatisticsResponse>(`/admin/promoCampaign/${promoCampaignId}/statistics`, getReqOptions());
}

export function getPromoCampaignById(id: number) {
    return Api.get<PromoCampaignListResponse>(`/promo-campaign/list/?id=${id}`, getReqOptions());
}

function normalizePromoCampaign<PromoCampaign extends Record<string, any>>(promoCampaign: PromoCampaign) {
    // TODO: send original promoCampaign without changing behaviorType and offerDuration
    const offerDuration = promoCampaign?.offerDuration || DEFAULT_OFFER_DURATION;
    return { ...promoCampaign, offerDuration };
}

export function createPromoCampaign(promoCampaign: PromoCampaignCreateDto) {
    return Api.post<DefaultCreateDtoResponse>('/admin/promoCampaign', normalizePromoCampaign(promoCampaign), getReqOptions());
}

export function newPromoCampaign(promoCampaign: PromoCampaignCreateDto, appCode: string) {
    const options = getReqOptions();
    options.headers.clientAppCode = appCode;
    return Api.post<DefaultCreateDtoResponse>('/admin/promoCampaign', normalizePromoCampaign(promoCampaign), options);
}

export function editPromoCampaign(promoCampaign: PromoCampaignDto) {
    return Api.put<DefaultApiResponse>(`/admin/promoCampaign/${promoCampaign.id}`, normalizePromoCampaign(promoCampaign), getReqOptions());
}

export function copyPromoCampaign(id: number, promoCampaign: PromoCampaignDto, appCode: string) {
    const options = getReqOptions();
    if (appCode) {
        options.headers.clientAppCode = appCode;
    }
    return Api.post<PromoCampaignDto>(`/admin/promoCampaign/${id}`, normalizePromoCampaign(promoCampaign), options);
}

export function reorderPromoCampaigns(idMap: Record<number, number>) {
    return Api.post<DefaultApiResponse>('/admin/promoCampaign/reorder/', { idMap }, getReqOptions());
}

export function uploadPromoCodes(campaignId: number, data: Blob) {
    return Api.upload<DefaultApiResponse>(`/admin/promoCampaign/promoCode?campaign-id=${campaignId}`, data, getReqOptions(FORM_DATA_CONTENT_TYPE));
}

export function deletePromoCampaign(promoCampaignId: number) {
    return Api.delete<DefaultApiResponse>(`/admin/promoCampaign/${promoCampaignId}`, getReqOptions());
}

export async function getLocationsByText(value: string) {
    const { list } = await Api.get<ListResponse<LocationDto>>(`/location/search?name=${value}`, getReqOptions());
    return list;
}

export async function getSalePointsByText(name: string, locationId?: number) {
    const params = Object.entries({ name, locationId }).reduce((result, [key, val]) => {
        if (!val) {
            return result;
        }

        return { ...result, [key]: val };
    }, {});
    const { list } = await Api.get<ListResponse<SalePointDto>>(`/salepoint/search?${new URLSearchParams(params).toString()}`, getReqOptions());

    return list;
}

export function addVisibilitySetting(data: VisibilitySettingsRequest) {
    return Api.post<DefaultCreateDtoResponse>('/admin/visibility-setting', data, getReqOptions());
}

export function newVisibilitySetting(data: VisibilitySettingsRequest, appCode: string) {
    const options = getReqOptions();
    options.headers.clientAppCode = appCode;
    return Api.post<DefaultCreateDtoResponse>('/admin/visibility-setting', data, options);
}

export function getPromoCampaignVisibilitySettings(promoCampaignId: number, urlSearchParams: string) {
    return Api.get<VisibilitySettingsPaginationResponse>(
        `/admin/visibility-setting/promoCampaign/${promoCampaignId}?${urlSearchParams}`,
        getReqOptions()
    );
}

export function editPromoCampaignVisibilitySetting(visibilitySettingId: number, visibilitySetting: VisibilitySettingsRequest) {
    return Api.put<DefaultApiResponse>(`/admin/visibility-setting/${visibilitySettingId}`, visibilitySetting, getReqOptions());
}

export function deletePromoCampaignVisibilitySetting(visibilitySettingId: number) {
    return Api.delete<DefaultApiResponse>(`/admin/visibility-setting/${visibilitySettingId}`, getReqOptions());
}

export function changeVisibleOfVisibilitySettings(settings: Record<number, boolean>) {
    return Api.post<DefaultApiResponse>('/admin/visibility-setting/change-visibility/', { settings }, getReqOptions());
}
