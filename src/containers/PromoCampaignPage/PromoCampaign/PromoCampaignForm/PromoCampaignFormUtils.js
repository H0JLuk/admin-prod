import { deletePromoCampaignBanner, newCreatePromoCampaignBanner, newEditPromoCampaignBanner } from '../../../../api/services/promoCampaignBannerService';
import { newVisibilitySetting } from '../../../../api/services/promoCampaignService';
import { deletePromoCampaignText, newEditPromoCampaignText, newPromoCampaignText } from '../../../../api/services/promoCampaignTextService';
import { APPLICATION_JSON_TYPE, BANNER_REQUEST, IMAGE, promoCampaignBannerTypes } from './PromoCampaignFormConstants';
import moment from 'moment';
import { getAppCode } from '../../../../api/services/sessionService';
import behaviorTypes from '../../../../constants/behaviorTypes';

const URL_SOURCE_VALUE_PROMO_CAMPAIGN = 'PROMO_CAMPAIGN';

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
        .filter(({ salePoint, location }) => !!salePoint || !!location)
        .map(setting => newVisibilitySetting(
            {
                promoCampaignId,
                locationId: setting.location?.id,
                salePointId: setting.salePoint?.id,
                visible: setting.visible,
            },
            appCode
        ));
}

export function editTextBanners(promoCampaignTexts, promoCampaign, appCode, onDelete) {

    return Object.keys(promoCampaignTexts).map((type) => {
        const textWithType = promoCampaign.texts.find(text => text.type === type);
        const newValue = promoCampaignTexts[type];
        const prevValue = textWithType?.value;

        if (newValue !== prevValue) {
            const textId = textWithType?.id;

            if (textId) {
                if (!newValue?.trim()) {

                    typeof onDelete === 'function' && onDelete(textId, type);
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
    const banners = [];
    const deletedBannersId = [];

    for (const formBannerType of Object.keys(promoCampaignBanners)) {
        const formData = new FormData();
        const bannerType = promoCampaignBannerTypes[formBannerType];
        const promoCampaignBanner = {
            type: bannerType,
            promoCampaignId: promoCampaign.id,
        };

        if (changedImgs.includes(formBannerType)) {
            const bannerId = promoCampaign.banners.find(banner => banner.type === bannerType)?.id;
            const [bannerFile] = promoCampaignBanners[formBannerType];

            if (bannerId && !bannerFile) {
                await deletePromoCampaignBanner(bannerId);
                deletedBannersId.push(bannerId);
                continue;
            }

            if (!bannerFile || typeof bannerFile === 'string') {
                continue;
            }

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
            const response = await request;
            banners.push(response);
        }
    }

    return { banners, deletedBannersId };
}

export function normalizeFirstStepValue(val) {
    const [startDate, finishDate] = val.datePicker || [];

    return {
        ...val,
        startDate: startDate?.startOf('day').toISOString(),
        finishDate: finishDate?.endOf('day').toISOString(),
        settings: {
            ...val.settings,
            priority_on_web_url: val.settings.priority_on_web_url === URL_SOURCE_VALUE_PROMO_CAMPAIGN,
        },
        webUrl: val.webUrl || null,
    };
}


export function normalizePromoCampaignData({ promoCampaign, appCode, isCopy }) {
    if (!promoCampaign && typeof promoCampaign !== 'object') return {};

    const { banners = [], texts = [] } = promoCampaign;

    return {
        ...promoCampaign,
        name: promoCampaign.name,
        webUrl: promoCampaign.webUrl,
        promoCodeType: isCopy ? undefined : promoCampaign.promoCodeType,
        active: promoCampaign.active,
        dzoId: promoCampaign.dzoId,
        type: promoCampaign.type,
        categoryIdList: promoCampaign.categoryList.reduce((prev, curr) => (
            [...prev, curr.categoryId]
        ), []),
        banners: arrayToObject(banners, 'type', 'url'),
        texts: arrayToObject(texts, 'type', 'value'),
        datePicker: [
            promoCampaign.startDate ? moment.utc(promoCampaign.startDate).local() : undefined,
            promoCampaign.finishDate ? moment.utc(promoCampaign.finishDate).local() : undefined,
        ],
        appCode: isCopy ? undefined : appCode ?? getAppCode(),
        offerDuration: promoCampaign.offerDuration,
        settings: promoCampaign.settings,
        standalone: promoCampaign.standalone,
        externalId: isCopy ? '' : promoCampaign.externalId,
        behaviorType: promoCampaign.behaviorType === behaviorTypes.QR ? true : false,
    };
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
    type,
    categoryIdList,
    settings,
    oneLinkAppUrl,
    standalone,
    externalId,
    behaviorType,
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
    standalone,
    type,
    categoryIdList,
    oneLinkAppUrl,
    externalId: externalId || null,
    behaviorType: behaviorType ? behaviorTypes.QR : behaviorTypes.WEB,
});

export function getPromoCampaignForCopy(promoCampaign, copyVisibilitySettings) {
    return {
        active: promoCampaign.active,
        behaviorType: promoCampaign.behaviorType,
        categoryIdList: promoCampaign.categoryIdList,
        dzoId: promoCampaign.dzoId,
        name: promoCampaign.name,
        externalId: promoCampaign.externalId || null,
        finishDate: promoCampaign.finishDate,
        startDate: promoCampaign.startDate,
        offerDuration: promoCampaign.offerDuration,
        oneLinkAppUrl: promoCampaign.oneLinkAppUrl,
        promoCodeType: promoCampaign.promoCodeType,
        settings: promoCampaign.settings,
        standalone: promoCampaign.standalone,
        type: promoCampaign.type,
        webUrl: promoCampaign.webUrl,
        copyVisibilitySettings,
    };
}

export function checkUniqVisibilitySettings(setting) {
    const samePositions = [];
    const filteredSettings = setting.filter(({ location, salePoint }) => location || salePoint);
    filteredSettings
        .map(({ location, salePoint }) => `${location?.id ?? ''}${salePoint?.id ?? ''}`)
        .filter((el, i, array) => {
            const indexInArray = array.indexOf(el);
            const elemIsUniq = indexInArray === i;
            if (!elemIsUniq) {
                samePositions.push([indexInArray, i]);
            }
            return elemIsUniq;
        });

    return samePositions;
}

export function getVisibilitySettingsWithDoubleError(visibilitySettings, samePositions) {
    const nextVisibilitySettings = [...visibilitySettings];
    samePositions.forEach(([firstRepeat, repeat]) => {
        const locationName = visibilitySettings[firstRepeat].location?.name ?? '';
        const salePointName = visibilitySettings[firstRepeat].salePoint?.name ?? '';
        const locationText = locationName ? `локацией '${locationName}'` : '';
        const salePointText = salePointName ? `${locationName ? ' и ' : ''} точкой продажи '${salePointName}'` : '';
        const errors = { server: `Нельзя добавить одинаковые настройки видимости с ${locationText} ${salePointText}` };
        nextVisibilitySettings[firstRepeat] = { ...nextVisibilitySettings[firstRepeat], errors };
        nextVisibilitySettings[repeat] = { ...nextVisibilitySettings[repeat], errors };
    });

    return nextVisibilitySettings;
}

export function getVisibilitySettingsWithUpdatedErrors(settings, idx, needUpdate) {
    if (needUpdate) {
        settings = settings.slice();
        const errorMessage = settings[idx].errors.server;
        const countSettingsWithError = settings.filter(
            (setting) => setting.errors?.server === errorMessage
        ).length;

        if (countSettingsWithError > 2) {
            settings[idx].errors = {};
        } else {
            settings = settings.map((setting) => {
                if (setting.errors?.server === errorMessage) {
                    return { ...setting, errors: {} };
                }
                return setting;
            });
        }
    }

    return settings;
}

export function checkPromoCodes(promoCampaignRef, promoCampaignFromLocation) {

    if (promoCampaignRef.promoCodeType !== promoCampaignFromLocation?.promoCodeType) {
        return promoCampaignRef.promoCodeType;
    } else {
        return promoCampaignFromLocation.promoCodeType;
    }
}

export function getPromoCampaignValue(promoCampaign, refPromoCampaign) {
    return refPromoCampaign ?? promoCampaign;
}
