import { getReqOptions } from './index';
import { Api, FORM_DATA_CONTENT_TYPE } from '../apiClient';
import {
    DefaultApiResponse,
    BundleCreateDto,
    BundleGroupTextDto,
    BundleListResponse,
    DefaultCreateDtoResponse,
    BundleLinkTextDto,
    BannerDto,
    BannerTextDto,
} from '@types';

export function createCampaignGroup(groupData: BundleCreateDto) {
    return Api.post<DefaultCreateDtoResponse>('/admin/campaign-group', groupData, getReqOptions());
}

export function deleteCampaignGroup(id: number) {
    return Api.delete<DefaultApiResponse>(`/admin/campaign-group/${id}`, getReqOptions());
}

export function editCampaignGroup(groupData: BundleCreateDto, groupId: number) {
    return Api.put<DefaultApiResponse>(`/admin/campaign-group/${groupId}`, groupData, getReqOptions());
}

export function getCampaignGroupList() {
    return Api.get<BundleListResponse>('/admin/campaign-group/list', getReqOptions());
}

export function createCampaignGroupBanner(formData: FormData) {
    return Api.upload<BannerDto>('/admin/campaign-group/banner/create', formData, getReqOptions(FORM_DATA_CONTENT_TYPE));
}

export function updateCampaignGroupBanner(formData: FormData, id: number) {
    return Api.update<BannerDto>(`/admin/campaign-group/banner/${id}`, formData, getReqOptions(FORM_DATA_CONTENT_TYPE));
}

export function deleteCampaignGroupBanner(id: number) {
    return Api.delete<DefaultApiResponse>(`/admin/campaign-group/banner/${id}`, getReqOptions(FORM_DATA_CONTENT_TYPE));
}

export function createCampaignGroupText(campaignGroupText: BundleGroupTextDto) {
    return Api.post<BundleGroupTextDto>('/admin/campaign-group/text/create', campaignGroupText, getReqOptions());
}

export function updateCampaignGroupText(campaignGroupText: BundleGroupTextDto, id: number) {
    return Api.put<BannerTextDto>(`/admin/campaign-group/text/${id}`, campaignGroupText, getReqOptions());
}

export function deleteCampaignGroupText(id: number) {
    return Api.delete<DefaultApiResponse>(`/admin/campaign-group/text/${id}`, getReqOptions());
}

export function createCampaignGroupLink(campaignId: number, groupId: number) {
    return Api.post<DefaultCreateDtoResponse>('/admin/campaign-group/link', { campaignId, groupId }, getReqOptions());
}

export function updateCampaignGroupLink(linkId: number, campaignId: number, groupId: number) {
    return Api.put<DefaultApiResponse>(`/admin/campaign-group/link/${linkId}`, { campaignId, groupId }, getReqOptions());
}

export function deleteCampaignGroupLink(linkId: number) {
    return Api.delete<DefaultApiResponse>(`/admin/campaign-group/link/${linkId}`, getReqOptions());
}

export function createCampaignGroupLinkBanner(formData: FormData) {
    return Api.upload<BannerDto>('/admin/campaign-group/link/banner/create', formData, getReqOptions(FORM_DATA_CONTENT_TYPE));
}

export function updateCampaignGroupLinkBanner(bannerId: number, formData: FormData) {
    return Api.update<BannerDto>(`/admin/campaign-group/link/banner/${bannerId}`, formData, getReqOptions(FORM_DATA_CONTENT_TYPE));
}

export function deleteCampaignGroupLinkBanner(bannerId: number) {
    return Api.delete<DefaultApiResponse>(`/admin/campaign-group/link/banner/${bannerId}`, getReqOptions());
}

export function createCampaignGroupLinkText(text: BundleLinkTextDto) {
    return Api.post<BannerTextDto>('/admin/campaign-group/link/text/create', text, getReqOptions());
}

export function updateCampaignGroupLinkText(textId: number, text: BundleLinkTextDto) {
    return Api.put<BannerTextDto>(`/admin/campaign-group/link/text/${textId}`, text, getReqOptions());
}

export function deleteCampaignGroupLinkText(textId: number) {
    return Api.delete<DefaultApiResponse>(`/admin/campaign-group/link/text/${textId}`, getReqOptions());
}
