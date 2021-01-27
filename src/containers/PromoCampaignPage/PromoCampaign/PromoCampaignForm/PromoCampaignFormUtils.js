import { deletePromoCampaignBanner, newCreatePromoCampaignBanner, newEditPromoCampaignBanner } from '../../../../api/services/promoCampaignBannerService';
import { newVisibilitySetting } from '../../../../api/services/promoCampaignService';
import { deletePromoCampaignText, newEditPromoCampaignText, newPromoCampaignText } from '../../../../api/services/promoCampaignTextService';
import { getStaticUrl } from '../../../../api/services/settingsService';
import { APPLICATION_JSON_TYPE, BANNER_REQUEST, IMAGE, promoCampaignBannerTypes } from './PromoCampaignFormConstants';

export function arrayToObject(array, keyForKey, keyForValue) {
    return array.reduce((result, item) => ({ ...result, [item[keyForKey]]: item[keyForValue] }), {});
}

export function createTexts(promoCampaignTexts, promoCampaignId, appCode) {
    return Object.keys(promoCampaignTexts)
        .filter(type => Boolean(promoCampaignTexts[type]))
        .map(type => {
            const value = promoCampaignTexts[type];
            return newPromoCampaignText({ promoCampaignId, type, value }, appCode);
    });
}

export async function createImgBanners(promoCampaignBanners, promoCampaignId, appCode) {
    for (const formBannerType of Object.keys(promoCampaignBanners)) {
        if (!promoCampaignBanners[formBannerType] || !promoCampaignBanners[formBannerType].length) {
            continue;
        }

        const formData = new FormData();
        const [bannerFile] = promoCampaignBanners[formBannerType];
        const promoCampaignBanner = {
            type: promoCampaignBannerTypes[formBannerType],
            promoCampaignId,
        };

        formData.append(IMAGE, bannerFile.originFileObj, bannerFile.name);
        formData.append(
            BANNER_REQUEST,
            new Blob([JSON.stringify(promoCampaignBanner)], {
                type: APPLICATION_JSON_TYPE,
            })
        );

        await newCreatePromoCampaignBanner(formData, appCode);
    }
}

export function createVisibilities(visibilitySettings, promoCampaignId, appCode) {
    return visibilitySettings
        .filter(({ salePoint }) => Boolean(salePoint))
        .map(setting => newVisibilitySetting(
            {
                promoCampaignId,
                locationId: setting.location?.id,
                salePointId: setting.salePoint.id,
                visible: setting.visible,
            },
            appCode
        ));
}

export function editTextBanners(promoCampaignTexts, promoCampaign, appCode) {
    return Object.keys(promoCampaignTexts).map((type) => {
        const textWithType = promoCampaign.promoCampaignTexts.find(text => text.type === type);
        const newValue = promoCampaignTexts[type];
        const prevValue = textWithType?.value;

        if (newValue !== prevValue) {
            const textId = textWithType?.id;

            if (textId) {
                if (!newValue?.trim()) {
                    return deletePromoCampaignText(textId);
                }

                const text = {
                    type,
                    promoCampaignId: promoCampaign.id,
                    value: newValue,
                    id: textId,
                };

                return newEditPromoCampaignText(text.id, text, appCode);
            } else if (newValue?.trim()) {
                const text = {
                    type,
                    promoCampaignId: promoCampaign.id,
                    value: newValue,
                };
                return newPromoCampaignText(text, appCode);
            }
        }
        return null;
    });
}

export async function EditImgBanners(promoCampaignBanners, promoCampaign, changedImgs, appCode) {
    for (const formBannerType of Object.keys(promoCampaignBanners)) {
        const formData = new FormData();
        const bannerType = promoCampaignBannerTypes[formBannerType];
        const promoCampaignBanner = {
            type: bannerType,
            promoCampaignId: promoCampaign.id,
        };

        if (changedImgs.includes(formBannerType)) {
            const bannerId = promoCampaign.promoCampaignBanners.find(banner => banner.type === bannerType)?.id;
            const [bannerFile] = promoCampaignBanners[formBannerType];

            if (bannerId && !bannerFile) {
                await deletePromoCampaignBanner(bannerId);
                continue;
            }
            if (!bannerFile) continue;

            formData.append(IMAGE, bannerFile.originFileObj, bannerFile.name);
            formData.append(
                BANNER_REQUEST,
                new Blob([JSON.stringify(promoCampaignBanner)], {
                    type: APPLICATION_JSON_TYPE,
                })
            );
            const request = bannerId
                ? newEditPromoCampaignBanner(bannerId, formData, appCode)
                : newCreatePromoCampaignBanner(formData, appCode);
            await request;
        }
    }
}

export function getFileURL(file) {
    const staticUrl = getStaticUrl();
    return `${ staticUrl }${ file }`;
}

export const getDataForSend = ({
    name,
    dzoId,
    webUrl,
    active,
    offerDuration,
    finishDate,
    startDate,
    promoCodeType,
    typePromoCampaign,
    categoryIdList,
    settings,
}) => ({
    name,
    dzoId,
    webUrl,
    active,
    offerDuration,
    finishDate,
    startDate,
    promoCodeType,
    settings,
    type: typePromoCampaign,
    categoryIdList,
});
