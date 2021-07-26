import { getReqOptions } from './index';
import { Api, FORM_DATA_CONTENT_TYPE } from '../apiClient';
import { DEFAULT_OFFER_DURATION } from '@constants/promoCampaigns';
import {
    DefaultApiResponse,
    DefaultCreateDtoResponse,
    ListResponse,
    PromoCampaignCreateDto,
    PromoCampaignDto,
    PromoCampaignListResponse,
    PromoCampaignStatisticsResponse,
    SalePointDto,
    VisibilitySettingsPaginationResponse,
    VisibilitySettingsRequest,
} from '@types';

const stringPropertiesNames = ['details_button_label', 'details_button_url', 'disabled_banner_types'];

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

function normalizePromoCampaign<PromoCampaign extends PromoCampaignCreateDto>(promoCampaign: PromoCampaign) {
    const stringProperties = stringPropertiesNames
        .reduce((acc, curr) => ({ ...acc, [curr]: JSON.stringify(promoCampaign.settings[curr]) }), {});
    return {
        ...promoCampaign,
        offerDuration: promoCampaign?.offerDuration || DEFAULT_OFFER_DURATION,
        settings: {
            ...promoCampaign.settings,
            ...stringProperties,
        },
    };
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

export async function getSalePointByText(text: string, salePointId: number, locationId?: number) {
    const result = await getSalePointsByText(text, locationId);
    return result.find(({ id }) => id === salePointId);
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
        getReqOptions(),
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
