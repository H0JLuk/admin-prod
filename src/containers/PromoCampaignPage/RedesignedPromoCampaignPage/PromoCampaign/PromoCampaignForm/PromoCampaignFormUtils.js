import { newCreatePromoCampaignBanner, newEditPromoCampaignBanner } from '../../../../../api/services/promoCampaignBannerService';
import { newVisibilitySetting } from '../../../../../api/services/promoCampaignService';
import { deletePromoCampaignText, newEditPromoCampaignText, newPromoCampaignText } from '../../../../../api/services/promoCampaignTextService';
import { APPLICATION_JSON_TYPE, BANNER_REQUEST, IMAGE, imgTypes, pageTypes, promoCampaignBannerTypes, promoCampaignTextTypes } from './PromoCampaignFormConstants';

export function getImgName(type, promoCampaignBanners = []) {
    const url = promoCampaignBanners.find((el) => el.type === type)?.url || '';
    return url.split('/').pop() || '';
}

function getBannerObj (type = '', blobObj, promoCampaignBanners) {
    if (type && type in blobObj) {
        return [{
            originFileObj: blobObj[type],
            name: getImgName(imgTypes[type], promoCampaignBanners)
        }];
    }
}

export function makeImg(blobObj, type, promoCampaignBanners) {
    return type === pageTypes.present
        ? {
            presents_main_banner: getBannerObj(imgTypes.card.toLowerCase(), blobObj, promoCampaignBanners),
            presents_main_logo_1: getBannerObj(imgTypes.logo_main.toLowerCase(), blobObj, promoCampaignBanners),
            presents_scan_icon: getBannerObj(imgTypes.logo_icon.toLowerCase(), blobObj, promoCampaignBanners),
            landing: getBannerObj(imgTypes.screen.toLowerCase(), blobObj, promoCampaignBanners),
        } : {
            main_banner: getBannerObj(imgTypes.card.toLowerCase(), blobObj, promoCampaignBanners),
            logo_on_screen_with_phone: getBannerObj(imgTypes.logo_secondary.toLowerCase(), blobObj, promoCampaignBanners),
            logo_on_screen_with_qr_code: getBannerObj(imgTypes.logo_main.toLowerCase(), blobObj, promoCampaignBanners),
            landing: getBannerObj(imgTypes.screen.toLowerCase(), blobObj, promoCampaignBanners),
        };
}

export function makeText(type, promoCampaignTexts = []) {
    const textObj = promoCampaignTexts.reduce((result, textObj) => ({
        ...result,
        [textObj.type.toLowerCase()]: textObj.value,
    }), {});
    return type === pageTypes.present
        ? { giftText: textObj.header, giftTextOption: textObj.description, excursionConditions: textObj.rules }
        : { excursionTitleQR: textObj.header, excursionConditions: textObj.rules };
}


export async function getImage(banner) {
    const response = await fetch(banner.url);
    const blob = await response.blob();
    return { blob, name: banner.type.toLowerCase() };
}

export async function getImages(promoCampaignBanners) {
    const requestPromises = promoCampaignBanners.map(getImage);
    const images = await Promise.all(requestPromises);
    return images.reduce((result, blobObj) => {
        if (Object.prototype.hasOwnProperty.call(result, blobObj.name)) {
            return result;
        }
        return { ...result, [blobObj.name]: blobObj.blob };
    }, {});
}

export function createTexts(promoCampaignTexts, promoCampaignId, appCode) {
    return Object.keys(promoCampaignTexts)
        .filter(textType => Boolean(promoCampaignTexts[textType]))
        .map(textType => {
            const text = {
                promoCampaignId,
                type: promoCampaignTextTypes[textType],
                value: promoCampaignTexts[textType],
            };
            return newPromoCampaignText(text, appCode);
    });
}

export async function createImgBanners(promoCampaignBanners, promoCampaignId, appCode) {
    for (const formBannerType of Object.keys(promoCampaignBanners)) {
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
                locationId: setting.location?.id,
                salePointId: setting.salePoint.id,
                promoCampaignId,
                visible: setting.visible,
            },
            appCode
        ));
}

export function editTextBanners(promoCampaignTexts, promoCampaign, appCode) {
    return Object.keys(promoCampaignTexts).map((textType) => {
        const textWithType = promoCampaign.promoCampaignTexts.find(text => text.type === promoCampaignTextTypes[textType]);
        const newValue = promoCampaignTexts[textType];
        const prevValue = textWithType?.value;

        if (newValue !== prevValue) {
            const textId = textWithType?.id;

            if (textId) {
                if (!newValue?.trim()) {
                    return deletePromoCampaignText(textId);
                }

                const text = {
                    promoCampaignId: promoCampaign.id,
                    type: promoCampaignTextTypes[textType],
                    value: newValue,
                    id: textId,
                };

                return newEditPromoCampaignText(text.id, text, appCode);
            } else if (newValue?.trim()) {
                const text = {
                    promoCampaignId: promoCampaign.id,
                    type: promoCampaignTextTypes[textType],
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
        const [bannerFile] = promoCampaignBanners[formBannerType];
        const promoCampaignBanner = {
            type: bannerType,
            promoCampaignId: promoCampaign.id,
        };

        if (changedImgs.includes(formBannerType)) {
            const bannerId = promoCampaign.promoCampaignBanners.find(banner => banner.type === bannerType)?.id;

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
