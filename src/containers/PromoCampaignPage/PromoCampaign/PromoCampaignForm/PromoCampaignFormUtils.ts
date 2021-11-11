import moment from 'moment';
import {
    deletePromoCampaignBanner,
    createPromoCampaignBanner,
    editPromoCampaignBanner,
} from '@apiServices/promoCampaignBannerService';
import { newVisibilitySetting } from '@apiServices/promoCampaignService';
import {
    deletePromoCampaignText,
    editPromoCampaignText,
    createPromoCampaignText,
} from '@apiServices/promoCampaignTextService';
import {
    BANNER_REQUEST,
    IMAGE,
} from './PromoCampaignFormConstants';
import { getAppCode } from '@apiServices/sessionService';
import behaviorTypes from '@constants/behaviorTypes';
import { APPLICATION_JSON_TYPE, BANNER_TYPE } from '@constants/common';
import {
    PromoCampaignFormInitialState,
    PromoCampaignFormSavedStateRef,
    PromoCampaignFormVisibilitySettingCreateDto,
    PromoCampaignOnDeleteFunction,
} from './types';
import { BannerCreateDto, BannerCreateTextDto, PromoCampaignDto } from '@types';
import { arrayToObject } from '@utils/helper';
import { UploadFile } from 'antd/lib/upload/interface';

export const URL_SOURCE_VALUE_PROMO_CAMPAIGN = 'PROMO_CAMPAIGN';

export function createTexts(promoCampaignTexts: BannerCreateTextDto, promoCampaignId: number, appCode: string) {
    return Object.keys(promoCampaignTexts)
        .filter((type) => Boolean(promoCampaignTexts[type]))
        .map((type) => {
            const value = promoCampaignTexts[type];
            return createPromoCampaignText({ promoCampaignId, type, value }, appCode);
        });
}

export async function createImgBanners(
    promoCampaignBanners: BannerCreateDto,
    promoCampaignId: number,
    appCode: string,
) {
    for (const formBannerType of Object.keys(promoCampaignBanners)) {
        if (!promoCampaignBanners[formBannerType] || !(promoCampaignBanners[formBannerType] as any[]).length) {
            continue;
        }

        const formData = new FormData();
        const [bannerFile] = promoCampaignBanners[formBannerType] as UploadFile[];
        const promoCampaignBanner = {
            type: BANNER_TYPE[formBannerType as BANNER_TYPE],
            promoCampaignId,
        };

        formData.append(IMAGE, bannerFile.originFileObj as File, bannerFile.name);
        formData.append(
            BANNER_REQUEST,
            new Blob([JSON.stringify(promoCampaignBanner)], {
                type: APPLICATION_JSON_TYPE,
            }),
        );

        await createPromoCampaignBanner(formData, appCode);
    }
}

export function createVisibilities(
    visibilitySettings: PromoCampaignFormVisibilitySettingCreateDto[],
    promoCampaignId: number,
    appCode: string,
) {
    return visibilitySettings
        .filter(({ salePoint, location }) => !!salePoint || !!location)
        .map((setting) =>
            newVisibilitySetting(
                {
                    promoCampaignId,
                    locationId: setting.location?.id,
                    salePointId: setting.salePoint?.id,
                    visible: setting.visible,
                },
                appCode,
            ),
        );
}

export function editTextBanners(
    promoCampaignTexts: BannerCreateTextDto,
    promoCampaign: PromoCampaignDto,
    appCode: string,
    onDelete?: PromoCampaignOnDeleteFunction,
) {
    return Object.keys(promoCampaignTexts).map((type) => {
        const textWithType = promoCampaign.texts.find((text) => text.type === type);
        const newValue = promoCampaignTexts[type];
        const prevValue = textWithType?.value;

        if (newValue !== prevValue) {
            const textId = textWithType?.id;

            if (typeof textId === 'number') {
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

                return editPromoCampaignText(text.id, text, appCode);
            } else if (newValue?.trim()) {
                const text = {
                    type,
                    promoCampaignId: promoCampaign.id,
                    value: newValue,
                };
                return createPromoCampaignText(text, appCode);
            }
        }
        return null;
    });
}

export async function EditImgBanners(
    promoCampaignBanners: BannerCreateDto,
    promoCampaign: PromoCampaignDto,
    changedImgs: string[],
    appCode: string,
) {
    const banners = [];
    const deletedBannersId = [];

    for (const formBannerType of Object.keys(promoCampaignBanners)) {
        const formData = new FormData();
        const bannerType = BANNER_TYPE[formBannerType as BANNER_TYPE];
        const promoCampaignBanner = {
            type: bannerType,
            promoCampaignId: promoCampaign.id,
        };

        if (changedImgs.includes(formBannerType)) {
            const bannerId = promoCampaign.banners.find((banner) => banner.type === bannerType)?.id;
            const [bannerFile] = promoCampaignBanners[formBannerType] as UploadFile[];

            if (typeof bannerId === 'number' && !bannerFile) {
                await deletePromoCampaignBanner(bannerId);
                deletedBannersId.push(bannerId);
                continue;
            }

            if (!bannerFile || typeof bannerFile === 'string') {
                continue;
            }

            formData.append(IMAGE, bannerFile.originFileObj as File, bannerFile.name);
            formData.append(
                BANNER_REQUEST,
                new Blob([JSON.stringify(promoCampaignBanner)], {
                    type: APPLICATION_JSON_TYPE,
                }),
            );
            const request = bannerId
                ? editPromoCampaignBanner(bannerId, formData, appCode)
                : createPromoCampaignBanner(formData, appCode);
            const response = await request;
            banners.push(response);
        }
    }

    return { banners, deletedBannersId };
}

export function normalizeFirstStepValue<StepValue extends Record<string, any>>(val: StepValue) {
    const [startDate, finishDate] = val.datePicker || [];

    return {
        ...val,
        startDate: startDate?.utc().startOf('day').toISOString(),
        finishDate: finishDate?.utc().endOf('day').toISOString(),
        settings: {
            ...val.settings,
            priority_on_web_url: val.settings.priority_on_web_url === URL_SOURCE_VALUE_PROMO_CAMPAIGN,
        },
        webUrl: val.webUrl || null,
    };
}

export function normalizePromoCampaignData<Data extends Record<string, any>>({ promoCampaign, appCode, isCopy }: Data) {
    if (!promoCampaign && typeof promoCampaign !== 'object') {
        return {};
    }

    const { banners = [], texts = [] } = promoCampaign;

    return {
        ...promoCampaign,
        name: promoCampaign.name,
        webUrl: promoCampaign.webUrl,
        promoCodeType: isCopy ? undefined : promoCampaign.promoCodeType,
        active: promoCampaign.active,
        dzoId: promoCampaign.dzoId,
        type: promoCampaign.type,
        categoryIdList: (promoCampaign as PromoCampaignDto).categoryList.map(({ categoryId }) => categoryId),
        banners: arrayToObject(banners, 'type', 'url'),
        texts: arrayToObject(texts, 'type', 'value'),
        datePicker: [
            promoCampaign.startDate ? moment.utc(promoCampaign.startDate) : undefined,
            promoCampaign.finishDate ? moment.utc(promoCampaign.finishDate) : undefined,
        ],
        appCode: isCopy ? undefined : appCode ?? getAppCode(),
        offerDuration: promoCampaign.offerDuration,
        settings: promoCampaign.settings,
        standalone: promoCampaign.standalone,
        externalId: isCopy ? '' : promoCampaign.externalId,
        behaviorType: promoCampaign.behaviorType === behaviorTypes.QR,
    };
}

type DataForSendType = {[key in keyof PromoCampaignFormInitialState]: PromoCampaignFormInitialState[key] };
export const getDataForSend = <DataForSend extends DataForSendType & {id?: number;}>({
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
    productOfferingId,
    externalId,
    behaviorType,
}: DataForSend) => ({
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
    productOfferingId: settings.sale_enabled ? productOfferingId : null,
    externalId: externalId || null,
    behaviorType: behaviorType ? behaviorTypes.QR : behaviorTypes.WEB,
});

export function getPromoCampaignForCopy<
    PromoCampaignState extends { [key in keyof PromoCampaignDto]: PromoCampaignState[key] }, visibilitySettings = any[],
>(promoCampaign: PromoCampaignState, copyVisibilitySettings: visibilitySettings) {
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

export function checkUniqVisibilitySettings(setting: PromoCampaignFormVisibilitySettingCreateDto[]) {
    const samePositions: number[][] = [];
    const filteredSettings = setting.filter(({ location, salePoint }) => location || salePoint);
    filteredSettings
        .map(({ location, salePoint }) => `${location?.id ?? ''}${salePoint?.id ?? ''}`)
        .forEach((el, i, array) => {
            const indexInArray = array.indexOf(el);
            const elemIsUniq = indexInArray === i;
            if (!elemIsUniq) {
                samePositions.push([indexInArray, i]);
            }
        });

    return samePositions;
}

export function getVisibilitySettingsWithDoubleError(
    visibilitySettings: PromoCampaignFormVisibilitySettingCreateDto[],
    samePositions: number[][],
) {
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

export function getVisibilitySettingsWithUpdatedErrors(
    settings: PromoCampaignFormVisibilitySettingCreateDto[],
    idx: number,
    needUpdate: boolean,
) {
    if (needUpdate) {
        settings = settings.slice();
        const errorMessage = settings[idx].errors.server;
        const countSettingsWithError = settings.filter((setting) => setting.errors?.server === errorMessage).length;

        if (countSettingsWithError > 2) {
            settings[idx] = {
                ...settings[idx],
                errors: {},
            };
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

export function checkPromoCodes(
    promoCampaignRef: PromoCampaignFormSavedStateRef,
    promoCampaignFromLocation: PromoCampaignDto,
) {
    if (promoCampaignRef.promoCodeType !== promoCampaignFromLocation?.promoCodeType) {
        return promoCampaignRef.promoCodeType;
    }

    return promoCampaignFromLocation.promoCodeType;
}

export function getPromoCampaignValue(
    promoCampaign: PromoCampaignDto,
    refPromoCampaign?: PromoCampaignFormSavedStateRef,
) {
    return refPromoCampaign ?? promoCampaign;
}
