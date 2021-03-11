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
} from '../../../api/services/campaignGroupService';
import { APPLICATION_JSON_TYPE, BANNER_REQUEST, IMAGE } from '../../PromoCampaignPage/PromoCampaign/PromoCampaignForm/PromoCampaignFormConstants';

export function arrayToObject(array, keyForKey, keyForValue) {
    return array.reduce((result, item) => ({ ...result, [item[keyForKey]]: item[keyForValue] }), {});
}

function isArray(item) {
    return Array.isArray(item);
}

//  create group banners
export async function createGroupBanner(banners, groupId) {

    for (const bannerType of Object.keys(banners)) {
        const file = banners[bannerType];

        if (isArray(file) && file.length > 0) {
            const [bannerFile] = banners[bannerType];
            const formData = new FormData();
            const bannerRequest = {
                type: bannerType,
                groupId,
            };
            formData.append(IMAGE, bannerFile.originFileObj, bannerFile.name);
            formData.append(BANNER_REQUEST, new Blob([JSON.stringify(bannerRequest)], { type: APPLICATION_JSON_TYPE }));
            await createCampaignGroupBanner(formData);
        }
    }
}

//  create group texts
export async function createGroupTexts (texts, groupId) {
    const textsPromises = Object.entries(texts)
        .filter(([, value]) => Boolean(value))
        .reduce((prev, [key, value]) => [...prev, { type: key, value, groupId }], [])
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

export async function createGroupLink(bundleData = [], groupId) {

    for (const { banners, texts, campaignId } of bundleData) {
        const { id } = await createCampaignGroupLink(campaignId, groupId);
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

const createLinksTexts = (texts, linkId) => {
    return Object.entries(texts || {})
        .filter(([, value]) => Boolean(value))
        .reduce((prev, [key, value]) => [...prev, { type: key, value, linkId }], [])
        .map(createCampaignGroupLinkText);
};

/**
 *
 * create banners links
 *
 *
 */

const createLinksBanner = (banners, linkId) => {
    return Object.entries(banners).map(([type, bannerFile]) => {
        if (isArray(bannerFile) && bannerFile.length > 0) {
            const formData = new FormData();
            const [file] = bannerFile;
            const bannerRequest = { type, linkId };
            formData.append(IMAGE, file.originFileObj, file.name);
            formData.append(BANNER_REQUEST, new Blob([JSON.stringify(bannerRequest)], { type: APPLICATION_JSON_TYPE }));
            return createCampaignGroupLinkBanner(formData);
        } return null;
    });
};

// edit group

export async function editCampaignGroupTextAndBanners(bundleData, prevBundle, groupId) {

    const arrayBundle = [{ texts: bundleData.texts || {}, banners: bundleData.banners || {} }];

    for (const { texts, banners } of arrayBundle) {

        const textsPromises = editCampaignGroupTexts(texts, prevBundle.texts, groupId);

        const bannersPromises = editCampaignGroupBanners(banners, prevBundle.banners, groupId);

        await Promise.all(bannersPromises);
        await Promise.all(textsPromises);
    }
    return true;
}

//  edit group text

export function editCampaignGroupTexts(currentTexts, oldTexts = [], groupId) {
    return Object.entries(currentTexts).map(([type, nextValue]) => {
        const text = oldTexts.find((text) => text.type === type);
        if (nextValue !== text?.value) {
            const isTextID = typeof text?.id === 'number';
            const nextText = { type, value: nextValue, groupId };
            if (isTextID) {
                if (!nextValue.trim()) {
                    return deleteCampaignGroupText(text.id);
                }
                return updateCampaignGroupText(nextText, text.id);
            } else {
                return nextValue?.trim() && createCampaignGroupText(nextText);
            }
        }
        return null;
    });
}

export function editCampaignGroupBanners(currentBanners, oldBanners, groupId) {
    return Object.entries(currentBanners).map(([type, file]) => {
        if (isArray(file)) {
            const banner = oldBanners.find((banner) => banner.type === type);
            const fileIsEmpty = file.length === 0;
            const isBannerID = typeof banner?.id === 'number';

            if (fileIsEmpty && isBannerID) {
                return deleteCampaignGroupBanner(banner.id);
            }

            if (!fileIsEmpty) {
                const formData = new FormData();
                const [bannerFile] = file;
                const bannerRequest = { type, groupId };
                formData.append(IMAGE, bannerFile.originFileObj, bannerFile.name);
                formData.append(BANNER_REQUEST, new Blob([JSON.stringify(bannerRequest)], { type: APPLICATION_JSON_TYPE }));

                if (isBannerID) {
                    return updateCampaignGroupBanner(formData, banner.id);
                } else {
                    return createCampaignGroupBanner(formData);
                }
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

export async function editCampaignGroupLinks(bundleData, prevBundle, groupId) {

    const currentBundleList = bundleData.reduce((prev, { id }) => ([...prev, id]), []);

    const deletedGroupLinks = prevBundle.links.map(({ id }) => {
        if (!currentBundleList.includes(id)) {
            return deleteCampaignGroupLink(id);
        }
        return null;
    });

    await Promise.all(deletedGroupLinks);

    for (const { banners, texts, campaignId, id: linkId } of bundleData) {
        if (typeof linkId === 'number') {
            const link = prevBundle.links.find(({ id }) => +id === linkId);
            const textsPromises = editCampaignGroupLinkTexts(texts, link.texts, linkId);

            if (+campaignId !== link.campaignId) {
                await updateCampaignGroupLink(linkId, campaignId, groupId);
            }

            await Promise.all(textsPromises);

            const bannersPromises = editCampaignGroupLinkBanners(banners, link.banners, linkId);

            await Promise.all(bannersPromises);
        } else {
            const { id: linkId } = await createCampaignGroupLink(campaignId, groupId);
            const bannersPromises = createLinksBanner(banners, linkId);
            await Promise.all(bannersPromises);
            const textPromises = createLinksTexts(texts, linkId);
            await Promise.all(textPromises);
        }
    }
}

export function editCampaignGroupLinkTexts(currentTexts, oldTexts = [], linkId) {
    return Object.entries(currentTexts).map(([type, nextValue]) => {
        const text = oldTexts.find((text) => text.type === type);
        if (nextValue !== text?.value) {
            const isTextID = typeof text?.id === 'number';
            const nextText = { type, value: nextValue, linkId };
            if (isTextID) {
                if (!nextValue.trim()) {
                    return deleteCampaignGroupLinkText(text.id);
                }
                return updateCampaignGroupLinkText(text.id, nextText);
            } else {
                return nextValue?.trim() && createCampaignGroupLinkText(nextText);
            }
        }
        return null;
    });
}

export function editCampaignGroupLinkBanners(currentBanners, oldBanners = [], linkId){

    return Object.entries(currentBanners).map(([type, file]) => {
        if (isArray(file)) {
            const banner = oldBanners.find((banner) => banner.type === type);
            const fileIsEmpty = file.length === 0;
            const isBannerID = typeof banner?.id === 'number';

            if (fileIsEmpty && isBannerID) {
                return deleteCampaignGroupLinkBanner(banner.id);
            }

            if (!fileIsEmpty) {
                const formData = new FormData();
                const [bannerFile] = file;
                const bannerRequest = { type, linkId };
                formData.append(IMAGE, bannerFile.originFileObj, bannerFile.name);
                formData.append(BANNER_REQUEST, new Blob([JSON.stringify(bannerRequest)], { type: APPLICATION_JSON_TYPE }));

                if (isBannerID) {
                    return updateCampaignGroupLinkBanner(banner.id, formData);
                } else {
                    return createCampaignGroupLinkBanner(formData);
                }
            }
            return null;
        }
        return null;
    });
}

export function getInitialValue(state) {
    const initialValue = {
        texts: [],
        banners: [],
        links: [],
        name: '',
    };

    if (!state) {
        return initialValue;
    }

    return { ...initialValue, ...state };
}