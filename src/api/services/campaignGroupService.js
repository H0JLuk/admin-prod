import { getReqOptions } from './index';
import { Api, FORM_DATA_CONTENT_TYPE } from '../apiClient';

export function createCampaignGroup(groupData) {
    return Api.post('/admin/campaign-group', groupData, getReqOptions());
}

export function deleteCampaignGroup(id) {
    return Api.delete(`/admin/campaign-group/${id}`, getReqOptions());
}

export function editCampaignGroup(groupData, groupId) {
    return Api.put(`/admin/campaign-group/${groupId}`, groupData, getReqOptions());
}

export function getCampaignGroupList() {
    return Api.get('/admin/campaign-group/list', getReqOptions());
}

export function createCampaignGroupBanner(formData) {
    return Api.upload('/admin/campaign-group/banner/create', formData, getReqOptions(FORM_DATA_CONTENT_TYPE));
}

export function updateCampaignGroupBanner(formData, id) {
    return Api.update(`/admin/campaign-group/banner/${id}`, formData, getReqOptions(FORM_DATA_CONTENT_TYPE));
}

export function deleteCampaignGroupBanner(id) {
    return Api.delete(`/admin/campaign-group/banner/${id}`, getReqOptions(FORM_DATA_CONTENT_TYPE));
}

export function createCampaignGroupText(campaignGroupText) {
    return Api.post('/admin/campaign-group/text/create', campaignGroupText, getReqOptions());
}

export function updateCampaignGroupText(campaignGroupText, id) {
    return Api.put(`/admin/campaign-group/text/${id}`, campaignGroupText, getReqOptions());
}

export function deleteCampaignGroupText(id) {
    return Api.delete(`/admin/campaign-group/text/${id}`, getReqOptions());
}

export function createCampaignGroupLink(campaignId, groupId) {
    return Api.post('/admin/campaign-group/link', { campaignId, groupId }, getReqOptions());
}

export function updateCampaignGroupLink(linkId, campaignId, groupId) {
    return Api.put(`/admin/campaign-group/link/${linkId}`, { campaignId, groupId }, getReqOptions());
}

export function deleteCampaignGroupLink(linkId) {
    return Api.delete(`/admin/campaign-group/link/${linkId}`, getReqOptions());
}

export function createCampaignGroupLinkBanner(formData) {
    return Api.upload('/admin/campaign-group/link/banner/create', formData, getReqOptions(FORM_DATA_CONTENT_TYPE));
}

export function updateCampaignGroupLinkBanner(bannerId, formData) {
    return Api.update(`/admin/campaign-group/link/banner/${bannerId}`, formData, getReqOptions(FORM_DATA_CONTENT_TYPE));
}

export function deleteCampaignGroupLinkBanner(bannerId) {
    return Api.delete(`/admin/campaign-group/link/banner/${bannerId}`, getReqOptions());
}

export function createCampaignGroupLinkText(text) {
    return Api.post('/admin/campaign-group/link/text/create', text, getReqOptions());
}

export function updateCampaignGroupLinkText(textId, text) {
    return Api.put(`/admin/campaign-group/link/text/${textId}`, text, getReqOptions());
}

export function deleteCampaignGroupLinkText(textId) {
    return Api.delete(`/admin/campaign-group/link/text/${textId}`, getReqOptions());
}