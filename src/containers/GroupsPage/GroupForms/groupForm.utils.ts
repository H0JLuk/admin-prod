/* eslint-disable @typescript-eslint/no-non-null-assertion */
import {
    BannerCreateDto,
    BannerCreateTextDto,
    BannerDto,
    BannerTextDto,
    BundleDto,
    BundleGroupTextDto,
    BundleLink,
    BundleLinkTextDto,
} from '@types';
import {
    createCampaignGroupBanner,
    createCampaignGroupLink,
    createCampaignGroupLinkBanner,
    createCampaignGroupLinkText,
    createCampaignGroupText,
    deleteCampaignGroupLink,
    updateCampaignGroupBanner,
    updateCampaignGroupLink,
    updateCampaignGroupLinkText,
    updateCampaignGroupText,
    updateCampaignGroupLinkBanner,
    deleteCampaignGroupLinkBanner,
    deleteCampaignGroupLinkText,
    deleteCampaignGroupText,
    deleteCampaignGroupBanner,
} from '@apiServices/campaignGroupService';
import {
    APPLICATION_JSON_TYPE,
    BANNER_REQUEST,
    IMAGE,
} from '../../PromoCampaignPage/PromoCampaign/PromoCampaignForm/PromoCampaignFormConstants';
import { BundleInitialValue, CreateGroupLinkDto, EditGroupBannersAndTextsDto, LinksCreateDto } from './types';
//  create group banners
export async function createGroupBanner(banners: BannerCreateDto, groupId: number) {
    for (const bannerType of Object.keys(banners)) {
        const file = banners[bannerType];

        if (Array.isArray(file) && file.length > 0) {
            const [bannerFile] = file;
            const formData = new FormData();
            const bannerRequest = {
                type: bannerType,
                groupId,
            };
            formData.append(IMAGE, bannerFile.originFileObj as File, bannerFile.name);
            formData.append(BANNER_REQUEST, new Blob([JSON.stringify(bannerRequest)], { type: APPLICATION_JSON_TYPE }));
            await createCampaignGroupBanner(formData);
        }
    }
}

//  create group texts
export async function createGroupTexts(texts: BannerCreateTextDto, groupId: number) {
    const textsPromises = Object.entries(texts)
        .filter(([, value]) => Boolean(value))
        .reduce((prev: BundleGroupTextDto[], [key, value]) => [...prev, { type: key, value, groupId }], [])
        .map(createCampaignGroupText);

    await Promise.all(textsPromises);
    return true;
}

/**
 *
 * create links
 *
 *
 */

export async function createGroupLink(bundleData: CreateGroupLinkDto[] = [], groupId: number) {
    for (const { banners, texts, campaignId } of bundleData) {
        const { id } = await createCampaignGroupLink(Number(campaignId), groupId);
        const bannersPromises = createLinksBanner(banners, id);
        await Promise.all(bannersPromises);
        const textPromises = createLinksTexts(texts, id);
        await Promise.all(textPromises);
    }
}

/**
 *
 * create texts links
 *
 *
 */

const createLinksTexts = (texts: BannerCreateTextDto, linkId: number) =>
    Object.entries(texts || {})
        .filter(([, value]) => Boolean(value))
        .reduce((prev: BundleLinkTextDto[], [key, value]) => [...prev, { type: key, value, linkId }], [])
        .map(createCampaignGroupLinkText);

/**
 *
 * create banners links
 *
 *
 */

const createLinksBanner = (banners: BannerCreateDto, linkId: number) =>
    Object.entries(banners).map(([type, bannerFile]) => {
        if (Array.isArray(bannerFile) && bannerFile.length > 0) {
            const formData = new FormData();
            const [file] = bannerFile;
            const bannerRequest = { type, linkId };
            formData.append(IMAGE, file.originFileObj as File, file.name);
            formData.append(BANNER_REQUEST, new Blob([JSON.stringify(bannerRequest)], { type: APPLICATION_JSON_TYPE }));
            return createCampaignGroupLinkBanner(formData);
        }
        return null;
    });

// edit group

export async function editCampaignGroupTextAndBanners(
    bundleData: EditGroupBannersAndTextsDto,
    prevBundle: BundleDto,
    groupId: number
) {
    const arrayBundle = [{ texts: bundleData.texts || {}, banners: bundleData.banners || {} }];

    for (const { texts, banners } of arrayBundle) {
        const textsPromises = editCampaignGroupTexts(texts, prevBundle.texts, groupId);

        const bannersPromises = editCampaignGroupBanners(banners, prevBundle.banners, groupId);

        await Promise.all<unknown>(bannersPromises);
        await Promise.all<unknown>(textsPromises);
    }
    return true;
}

//  edit group text

export function editCampaignGroupTexts(
    currentTexts: BannerCreateTextDto,
    oldTexts: BannerTextDto[] = [],
    groupId: number
) {
    return Object.entries(currentTexts).map(([type, nextValue]) => {
        const text = oldTexts.find((text) => text.type === type) as BannerTextDto;
        if (nextValue !== text?.value) {
            const isTextID = typeof text?.id === 'number';
            const nextText = { type, value: nextValue, groupId };
            if (isTextID) {
                if (!nextValue.trim()) {
                    return deleteCampaignGroupText(text.id);
                }
                return updateCampaignGroupText(nextText, text.id);
            }

            return nextValue?.trim() && createCampaignGroupText(nextText);
        }
        return null;
    });
}

export function editCampaignGroupBanners(currentBanners: BannerCreateDto, oldBanners: BannerDto[], groupId: number) {
    return Object.entries(currentBanners).map(([type, file]) => {
        if (Array.isArray(file)) {
            const banner = oldBanners.find((banner) => banner.type === type);
            const fileIsEmpty = file.length === 0;
            const isBannerID = typeof banner?.id === 'number';

            if (fileIsEmpty && isBannerID) {
                // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                return deleteCampaignGroupBanner(banner!.id);
            }

            if (!fileIsEmpty) {
                const formData = new FormData();
                const [bannerFile] = file;
                const bannerRequest = { type, groupId };
                formData.append(IMAGE, bannerFile.originFileObj as File, bannerFile.name);
                formData.append(
                    BANNER_REQUEST,
                    new Blob([JSON.stringify(bannerRequest)], { type: APPLICATION_JSON_TYPE })
                );

                if (isBannerID) {
                    return updateCampaignGroupBanner(formData, banner!.id);
                }

                return createCampaignGroupBanner(formData);
            }
            return null;
        }
        return null;
    });
}

/**
 *
 * Edit links
 *
 *
 */

export async function editCampaignGroupLinks(bundleData: LinksCreateDto[], prevBundle: BundleDto, groupId: number) {
    const currentBundleList = bundleData.reduce((prev: (number | null)[], { id }) => [...prev, id], []);

    const deletedGroupLinks = prevBundle.links.map(({ id }) => {
        if (!currentBundleList.includes(id)) {
            return deleteCampaignGroupLink(id);
        }
        return null;
    });

    await Promise.all<unknown>(deletedGroupLinks);

    for (const { banners, texts, campaignId, id: linkId } of bundleData) {
        if (typeof linkId === 'number') {
            const link = prevBundle.links.find(({ id }) => +id === linkId) as BundleLink;
            const textsPromises = editCampaignGroupLinkTexts(texts, link.texts, linkId);

            if (Number(campaignId) !== link.campaignId) {
                await updateCampaignGroupLink(linkId, Number(campaignId), groupId);
            }

            await Promise.all<unknown>(textsPromises);

            const bannersPromises = editCampaignGroupLinkBanners(banners, link.banners, linkId);

            await Promise.all<unknown>(bannersPromises);
        } else {
            const { id: linkId } = await createCampaignGroupLink(Number(campaignId), groupId);
            const bannersPromises = createLinksBanner(banners, linkId);
            await Promise.all(bannersPromises);
            const textPromises = createLinksTexts(texts, linkId);
            await Promise.all(textPromises);
        }
    }
}

export function editCampaignGroupLinkTexts(
    currentTexts: BannerCreateTextDto,
    oldTexts: BannerTextDto[] = [],
    linkId: number
) {
    return Object.entries(currentTexts).map(([type, nextValue]) => {
        const text = oldTexts.find((text) => text.type === type);
        if (nextValue !== text?.value) {
            const isTextID = typeof text?.id === 'number';
            const nextText = { type, value: nextValue, linkId };
            if (isTextID) {
                if (!nextValue.trim()) {
                    return deleteCampaignGroupLinkText(text!.id);
                }
                return updateCampaignGroupLinkText(text!.id, nextText);
            }

            return nextValue?.trim() && createCampaignGroupLinkText(nextText);
        }
        return null;
    });
}

export function editCampaignGroupLinkBanners(
    currentBanners: BannerCreateDto,
    oldBanners: BannerDto[] = [],
    linkId: number
) {
    return Object.entries(currentBanners).map(([type, file]) => {
        if (Array.isArray(file)) {
            const banner = oldBanners.find((banner) => banner.type === type);
            const fileIsEmpty = file.length === 0;
            const isBannerID = typeof banner?.id === 'number';

            if (fileIsEmpty && isBannerID) {
                return deleteCampaignGroupLinkBanner(banner!.id);
            }

            if (!fileIsEmpty) {
                const formData = new FormData();
                const [bannerFile] = file;
                const bannerRequest = { type, linkId };
                formData.append(IMAGE, bannerFile.originFileObj as File, bannerFile.name);
                formData.append(
                    BANNER_REQUEST,
                    new Blob([JSON.stringify(bannerRequest)], { type: APPLICATION_JSON_TYPE })
                );

                if (isBannerID) {
                    return updateCampaignGroupLinkBanner(banner!.id, formData);
                }

                return createCampaignGroupLinkBanner(formData);
            }
            return null;
        }
        return null;
    });
}

export function getInitialValue(state: BundleDto): BundleDto & { mainCampaignId?: number; } {
    const initialValue: BundleInitialValue = {
        texts: [],
        banners: [],
        links: [],
        name: '',
    };

    if (!state) {
        return initialValue as BundleDto & { mainCampaignId?: number; };
    }

    return { ...initialValue, ...state };
}
