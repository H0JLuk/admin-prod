import { PromoCampaignDto } from '@types';

export function filterBanner(promoCampaign: PromoCampaignDto, bannersIdList: number[], textsList: PromoCampaignDto['texts']) {
    const textsIDs = textsList.map((text) => text.id);
    const texts = promoCampaign.texts.filter((text) => !textsIDs.includes(text.id));
    const banners = promoCampaign.banners.filter((banner) => !bannersIdList.includes(banner.id));

    return { ...promoCampaign, banners, texts };
}

export function deleteText(promoCampaign: PromoCampaignDto, id: number) {
    const texts = promoCampaign.texts.filter((text) => text.id !== id);
    return { ...promoCampaign, texts };
}
