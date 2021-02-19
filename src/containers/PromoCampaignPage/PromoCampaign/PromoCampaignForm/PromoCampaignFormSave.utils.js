export function filterBanner (promoCampaign, bannersIdList, textsList) {
    const textsIDs = textsList.map((text) => text.id);
    const promoCampaignTexts = promoCampaign.promoCampaignTexts.filter((text) => !textsIDs.includes(text.id));
    const promoCampaignBanners = promoCampaign.promoCampaignBanners.filter((banner) => !bannersIdList.includes(banner.id));

    return { ...promoCampaign, promoCampaignBanners, promoCampaignTexts };
}

export function deleteText(promoCampaign, id) {
    const promoCampaignTexts = promoCampaign.promoCampaignTexts.filter((text) => text.id !== id);
    return { ...promoCampaign, promoCampaignTexts };
}
