export function filterBanner (promoCampaign, bannersIdList, textsList) {
    const textsIDs = textsList.map((text) => text.id);
    const texts = promoCampaign.texts.filter((text) => !textsIDs.includes(text.id));
    const banners = promoCampaign.banners.filter((banner) => !bannersIdList.includes(banner.id));

    return { ...promoCampaign, banners, texts };
}

export function deleteText(promoCampaign, id) {
    const texts = promoCampaign.texts.filter((text) => text.id !== id);
    return { ...promoCampaign, texts };
}
