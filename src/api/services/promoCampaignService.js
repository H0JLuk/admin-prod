import { getReqOptions } from "./index";
import { Api } from "../apiClient";

export async function getPromoCampaignList() {
    return Api.get('/promoCampaign/active', getReqOptions());
}

export async function getPromoCampaignStatistics(promoCampaignId) {
    return Api.get(`/admin/promoCampaign/${promoCampaignId}/statistics`, getReqOptions());
}