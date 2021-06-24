import pick from 'lodash/pick';
import moment from 'moment';
import {
    deletePromoCampaignBanner,
    newCreatePromoCampaignBanner,
    newEditPromoCampaignBanner,
} from '@apiServices/promoCampaignBannerService';
import { newVisibilitySetting } from '@apiServices/promoCampaignService';
import {
    deletePromoCampaignText,
    newEditPromoCampaignText,
    newPromoCampaignText,
} from '@apiServices/promoCampaignTextService';
import { getAppCode } from '@apiServices/sessionService';
import {
    createTexts,
    createImgBanners,
    createVisibilities,
    editTextBanners,
    EditImgBanners,
    normalizeFirstStepValue,
    normalizePromoCampaignData,
    getDataForSend,
    getPromoCampaignForCopy,
    checkUniqVisibilitySettings,
    getVisibilitySettingsWithDoubleError,
    getVisibilitySettingsWithUpdatedErrors,
    checkPromoCodes,
    getPromoCampaignValue,
    URL_SOURCE_VALUE_PROMO_CAMPAIGN,
} from './PromoCampaignFormUtils';
import {
    categoryListTestData,
    promoCampaignBannerArray,
    promoCampaignTextsArray,
    promoCampaignTestData,
} from '../../../../../__tests__/constants';
import behaviorTypes from '@constants/behaviorTypes';
import { BANNER_TYPE } from '@constants/common';
import { BannerCreateDto } from '@types';
import { PromoCampaignFormVisibilitySettingCreateDto } from './types';

jest.mock('@apiServices/promoCampaignBannerService', () => ({
    deletePromoCampaignBanner: jest.fn(),
    newCreatePromoCampaignBanner: jest.fn(),
    newEditPromoCampaignBanner: jest.fn(),
}));

jest.mock('@apiServices/promoCampaignService', () => ({
    newVisibilitySetting: jest.fn(),
}));

jest.mock('@apiServices/sessionService', () => ({
    getAppCode: jest.fn(),
}));

jest.mock('@apiServices/promoCampaignTextService', () => ({
    deletePromoCampaignText: jest.fn(),
    newEditPromoCampaignText: jest.fn(),
    newPromoCampaignText: jest.fn(),
}));

const promoCampaignBannersObject = {
    [promoCampaignBannerArray[0].type]: promoCampaignBannerArray[0].url,
    [promoCampaignBannerArray[1].type]: promoCampaignBannerArray[1].url,
};

const promoCampaignBannersForSend = {
    [promoCampaignBannerArray[0].type]: [{
        name: 'test-filename0.jpg',
        originFileObj: new Blob(['test'], { type: 'test' }),
    }],
    [promoCampaignBannerArray[1].type]: [{
        name: 'test-filename1.jpg',
        originFileObj: new Blob(['test2'], { type: 'test2' }),
    }],
} as BannerCreateDto;

const promoCampaignTextsObject = {
    [promoCampaignTextsArray[0].type]: promoCampaignTextsArray[0].value,
    [promoCampaignTextsArray[1].type]: promoCampaignTextsArray[1].value,
};

describe('PromoCampaignFormUtils tests', () => {

    describe('test `createTexts` function', () => {
        beforeEach(() => {
            (newPromoCampaignText as jest.Mock).mockImplementation((data, appCode) => ({ ...data, appCode }));
        });

        it('should create all texts', () => {
            expect(createTexts(promoCampaignTextsObject, 2, 'test')).toEqual([
                {
                    promoCampaignId: 2,
                    type: 'HEADER',
                    value: 'Скидка 300 ₽ при заказе от 500 ₽',
                    appCode: 'test',
                },
                {
                    promoCampaignId: 2,
                    type: 'DESCRIPTION',
                    value: 'Доставка забытого горошка для оливье за 15 мин',
                    appCode: 'test',
                },
            ]);
            expect(newPromoCampaignText).toHaveBeenCalledTimes(2);
        });

        it('should don`t create empty text', () => {
            const newPromoCampaignTextsObject = {
                ...promoCampaignTextsObject,
                HEADER: '',
            };
            expect(createTexts(newPromoCampaignTextsObject, 2, 'test')).toEqual([{
                promoCampaignId: 2,
                type: 'DESCRIPTION',
                value: 'Доставка забытого горошка для оливье за 15 мин',
                appCode: 'test',
            }]);
            expect(newPromoCampaignText).toHaveBeenCalledTimes(1);
        });
    });

    describe('test `createImgBanners` function', () => {
        beforeEach(() => {
            (newCreatePromoCampaignBanner as jest.Mock).mockImplementation(() => Promise.resolve());
        });

        it('should create all banners', async () => {
            await createImgBanners(promoCampaignBannersForSend, 1, 'test-code');
            expect(newCreatePromoCampaignBanner).toBeCalledTimes(2);
            const [
                [firstFormData, firstAppCode],
                [secondFormData, secondCode],
            ] = (newCreatePromoCampaignBanner as jest.Mock).mock.calls;
            expect(firstFormData.get('image').name).toBe('test-filename0.jpg');
            expect(secondFormData.get('image').name).toBe('test-filename1.jpg');
            expect(firstAppCode).toBe('test-code');
            expect(secondCode).toBe('test-code');
        });

        it('should don`t create empty banner', async () => {
            const newPromoCampaignBannersForSend = {
                ...promoCampaignBannersForSend,
                LOGO_MAIN: [],
            };
            await createImgBanners(newPromoCampaignBannersForSend, 2, 'test-code2');
            expect(newCreatePromoCampaignBanner).toBeCalledTimes(1);
            const [[firstFormData, firstAppCode]] = (newCreatePromoCampaignBanner as jest.Mock).mock.calls;
            expect(firstFormData.get('image').name).toBe('test-filename1.jpg');
            expect(firstAppCode).toBe('test-code2');
        });

    });

    describe('test `createVisibilities` function', () => {
        beforeEach(() => {
            (newVisibilitySetting as jest.Mock).mockImplementation((data, appCode) => ({ ...data, appCode }));
        });

        const visibilitySettings = [
            {
                location: { id: 0 },
                salePoint: { id: 2 },
                visible: true,
            },
            {
                location: { id: 2 },
                salePoint: { id: 4 },
                visible: false,
            },
        ] as PromoCampaignFormVisibilitySettingCreateDto[];

        it('should create all settings', () => {
            expect(createVisibilities(visibilitySettings, 1, 'code')).toEqual([
                {
                    promoCampaignId: 1,
                    locationId: 0,
                    salePointId: 2,
                    visible: true,
                    appCode: 'code',
                },
                {
                    promoCampaignId: 1,
                    locationId: 2,
                    salePointId: 4,
                    visible: false,
                    appCode: 'code',
                },
            ]);
            expect(newVisibilitySetting).toHaveBeenCalledTimes(visibilitySettings.length);
        });

        it('should don`t create empty location', () => {
            const newVisibilitySettings = [
                {
                    location: null,
                    salePoint: null,
                    visible: true,
                },
                visibilitySettings[1],
            ] as PromoCampaignFormVisibilitySettingCreateDto[];
            expect(createVisibilities(newVisibilitySettings, 1, 'code')).toEqual([{
                promoCampaignId: 1,
                locationId: 2,
                salePointId: 4,
                visible: false,
                appCode: 'code',
            }]);
            expect(newVisibilitySetting).toHaveBeenCalledTimes(1);
        });
    });

    describe('test `editTextBanners` function', () => {
        beforeEach(() => {
            (deletePromoCampaignText as jest.Mock).mockImplementation(id => id);
            (newEditPromoCampaignText as jest.Mock).mockImplementation((id, text, appCode) => ({ id, text, appCode }));
            (newPromoCampaignText as jest.Mock).mockImplementation((text, appCode) => ({ text, appCode }));
        });

        it('should all create new texts', () => {
            const oldPromoCampaign = {
                ...promoCampaignTestData,
                texts: [],
            } as any;
            expect(editTextBanners(promoCampaignTextsObject, oldPromoCampaign, 'code')).toEqual([
                {
                    text: {
                        type: 'HEADER',
                        promoCampaignId: 24,
                        value: 'Скидка 300 ₽ при заказе от 500 ₽',
                    },
                    appCode: 'code',
                },
                {
                    text: {
                        type: 'DESCRIPTION',
                        promoCampaignId: 24,
                        value: 'Доставка забытого горошка для оливье за 15 мин',
                    },
                    appCode: 'code',
                },
            ]);
            expect(newPromoCampaignText).toHaveBeenCalledTimes(2);
            expect(newEditPromoCampaignText).toHaveBeenCalledTimes(0);
            expect(deletePromoCampaignText).toHaveBeenCalledTimes(0);
        });

        it('should all edit text', () => {
            const newTexts = {
                HEADER: `${promoCampaignTextsObject.HEADER} new`,
                DESCRIPTION: `${promoCampaignTextsObject.DESCRIPTION} new`,
            };
            expect(editTextBanners(newTexts, promoCampaignTestData, 'code')).toEqual([
                {
                    id: 78,
                    text: {
                        type: 'HEADER',
                        promoCampaignId: 24,
                        value: 'Скидка 300 ₽ при заказе от 500 ₽ new',
                        id: 78,
                    },
                    appCode: 'code',
                },
                {
                    id: 79,
                    text: {
                        type: 'DESCRIPTION',
                        promoCampaignId: 24,
                        value: 'Доставка забытого горошка для оливье за 15 мин new',
                        id: 79,
                    },
                    appCode: 'code',
                },
            ]);
            expect(newPromoCampaignText).toHaveBeenCalledTimes(0);
            expect(newEditPromoCampaignText).toHaveBeenCalledTimes(2);
            expect(deletePromoCampaignText).toHaveBeenCalledTimes(0);
        });

        it('should delete all texts', () => {
            const newTexts = {
                HEADER: '',
                DESCRIPTION: '',
            };

            expect(editTextBanners(newTexts, promoCampaignTestData, 'code')).toEqual([78, 79]);
            expect(newPromoCampaignText).toHaveBeenCalledTimes(0);
            expect(newEditPromoCampaignText).toHaveBeenCalledTimes(0);
            expect(deletePromoCampaignText).toHaveBeenCalledTimes(2);
        });

        it('should delete first text and create second', () => {
            const newTexts = {
                HEADER: '',
                DESCRIPTION: 'new text',
            };
            const oldPromoCampaign = {
                ...promoCampaignTestData,
                texts: [
                    promoCampaignTextsArray[0],
                ],
            };
            const onDeleteMock = jest.fn();

            expect(editTextBanners(newTexts, oldPromoCampaign, 'code', onDeleteMock)).toEqual([
                78,
                {
                    text: {
                        type: 'DESCRIPTION',
                        promoCampaignId: 24,
                        value: 'new text',
                    },
                    appCode: 'code',
                },
            ]);
            expect(newPromoCampaignText).toHaveBeenCalledTimes(1);
            expect(newEditPromoCampaignText).toHaveBeenCalledTimes(0);
            expect(deletePromoCampaignText).toHaveBeenCalledTimes(1);
            expect(onDeleteMock).toBeCalledWith(78, 'HEADER');
        });

        it('should delete second text and edit first text', () => {
            const newTexts = {
                HEADER: 'new text',
                DESCRIPTION: '',
            };
            const onDeleteMock = jest.fn();

            expect(editTextBanners(newTexts, promoCampaignTestData, 'code', onDeleteMock)).toEqual([
                {
                    id: 78,
                    text: {
                        id: 78,
                        type: 'HEADER',
                        promoCampaignId: 24,
                        value: 'new text',
                    },
                    appCode: 'code',
                },
                79,
            ]);
            expect(newPromoCampaignText).toHaveBeenCalledTimes(0);
            expect(newEditPromoCampaignText).toHaveBeenCalledTimes(1);
            expect(deletePromoCampaignText).toHaveBeenCalledTimes(1);
            expect(onDeleteMock).toBeCalledWith(79, 'DESCRIPTION');
        });

        it('should create first text and edit second text', () => {
            const newTexts = {
                HEADER: 'new header',
                DESCRIPTION: 'edit description',
            };
            const oldPromoCampaign = {
                ...promoCampaignTestData,
                texts: [
                    promoCampaignTextsArray[1],
                ],
            };

            expect(editTextBanners(newTexts, oldPromoCampaign, 'code')).toEqual([
                {
                    text: { type: 'HEADER', promoCampaignId: 24, value: 'new header' },
                    appCode: 'code',
                },
                {
                    id: 79,
                    text: {
                        type: 'DESCRIPTION',
                        promoCampaignId: 24,
                        value: 'edit description',
                        id: 79,
                    },
                    appCode: 'code',
                },
            ]);
            expect(newPromoCampaignText).toHaveBeenCalledTimes(1);
            expect(newEditPromoCampaignText).toHaveBeenCalledTimes(1);
            expect(deletePromoCampaignText).toHaveBeenCalledTimes(0);
        });

        it('should return `null`', () => {
            expect(editTextBanners(promoCampaignTextsObject, promoCampaignTestData, 'code')).toEqual([null, null]);
            expect(newPromoCampaignText).toHaveBeenCalledTimes(0);
            expect(newEditPromoCampaignText).toHaveBeenCalledTimes(0);
            expect(deletePromoCampaignText).toHaveBeenCalledTimes(0);
        });
    });

    describe('test `EditImgBanners` function', () => {
        beforeEach(() => {
            (deletePromoCampaignBanner as jest.Mock).mockImplementation(id => `delete ${id}`);
            (newEditPromoCampaignBanner as jest.Mock).mockImplementation(
                (id, formData, appCode) => Promise.resolve({ id, formData, appCode }),
            );
            (newCreatePromoCampaignBanner as jest.Mock).mockImplementation(
                (formData, appCode) => Promise.resolve({ formData, appCode }),
            );
        });

        it('should all create new banners', async () => {
            const oldPromoCampaign = {
                ...promoCampaignTestData,
                banners: [],
            };
            const { banners, deletedBannersId } = await EditImgBanners(
                promoCampaignBannersForSend,
                oldPromoCampaign,
                [BANNER_TYPE.LOGO_MAIN, BANNER_TYPE.CARD],
                'code',
            );

            expect(deletedBannersId.length).toBe(0);
            expect(banners.length).toBe(2);

            expect(newCreatePromoCampaignBanner).toBeCalledTimes(2);
            expect(newEditPromoCampaignBanner).toBeCalledTimes(0);
            expect(deletePromoCampaignBanner).toBeCalledTimes(0);
        });

        it('should edit all banners', async () => {
            const { banners, deletedBannersId } = await EditImgBanners(
                promoCampaignBannersForSend,
                promoCampaignTestData,
                [BANNER_TYPE.LOGO_MAIN, BANNER_TYPE.CARD],
                'code',
            );

            expect(deletedBannersId.length).toBe(0);
            expect(banners.length).toBe(2);

            expect(newCreatePromoCampaignBanner).toBeCalledTimes(0);
            expect(newEditPromoCampaignBanner).toBeCalledTimes(2);
            expect(deletePromoCampaignBanner).toBeCalledTimes(0);
        });

        it('should delete all banners', async () => {
            const newBanners = {
                LOGO_MAIN: [],
                CARD: [],
            };
            const { banners, deletedBannersId } = await EditImgBanners(
                newBanners,
                promoCampaignTestData,
                [BANNER_TYPE.LOGO_MAIN, BANNER_TYPE.CARD],
                'code',
            );

            expect(deletedBannersId.length).toBe(2);
            expect(banners.length).toBe(0);

            expect(newCreatePromoCampaignBanner).toBeCalledTimes(0);
            expect(newEditPromoCampaignBanner).toBeCalledTimes(0);
            expect(deletePromoCampaignBanner).toBeCalledTimes(2);
        });

        it('should do nothing', async () => {
            const oldPromoCampaign = {
                ...promoCampaignTestData,
                banners: [],
            };
            const newBanners = {
                LOGO_MAIN: [],
                CARD: [],
            };
            const { banners, deletedBannersId } = await EditImgBanners(
                newBanners,
                oldPromoCampaign,
                [BANNER_TYPE.LOGO_MAIN, BANNER_TYPE.CARD],
                'code',
            );

            expect(deletedBannersId.length).toBe(0);
            expect(banners.length).toBe(0);

            expect(newCreatePromoCampaignBanner).toBeCalledTimes(0);
            expect(newEditPromoCampaignBanner).toBeCalledTimes(0);
            expect(deletePromoCampaignBanner).toBeCalledTimes(0);
        });

        it('should create first banner and edit second', async () => {
            const oldPromoCampaign = {
                ...promoCampaignTestData,
                banners: [
                    promoCampaignBannerArray[1],
                ],
            };

            const { banners, deletedBannersId } = await EditImgBanners(
                promoCampaignBannersForSend,
                oldPromoCampaign,
                [BANNER_TYPE.LOGO_MAIN, BANNER_TYPE.CARD],
                'code',
            );

            expect(deletedBannersId.length).toBe(0);
            expect(banners.length).toBe(2);

            expect(newCreatePromoCampaignBanner).toBeCalledTimes(1);
            expect(newEditPromoCampaignBanner).toBeCalledTimes(1);
            expect(deletePromoCampaignBanner).toBeCalledTimes(0);
        });

        it('should edit first banner and delete second', async () => {
            const newBanners = {
                LOGO_MAIN: promoCampaignBannersForSend.LOGO_MAIN,
                CARD: [],
            };
            const { banners, deletedBannersId } = await EditImgBanners(
                newBanners,
                promoCampaignTestData,
                [BANNER_TYPE.LOGO_MAIN, BANNER_TYPE.CARD],
                'code',
            );

            expect(deletedBannersId.length).toBe(1);
            expect(banners.length).toBe(1);

            expect(newCreatePromoCampaignBanner).toBeCalledTimes(0);
            expect(newEditPromoCampaignBanner).toBeCalledTimes(1);
            expect(deletePromoCampaignBanner).toBeCalledTimes(1);
        });

        it('should delete first banner and create second', async () => {
            const newBanners = {
                LOGO_MAIN: [],
                CARD: promoCampaignBannersForSend.CARD,
            };
            const oldPromoCampaign = {
                ...promoCampaignTestData,
                banners: [
                    promoCampaignBannerArray[0],
                ],
            };
            const { banners, deletedBannersId } = await EditImgBanners(
                newBanners,
                oldPromoCampaign,
                [BANNER_TYPE.LOGO_MAIN, BANNER_TYPE.CARD],
                'code',
            );

            expect(deletedBannersId.length).toBe(1);
            expect(banners.length).toBe(1);

            expect(newCreatePromoCampaignBanner).toBeCalledTimes(1);
            expect(newEditPromoCampaignBanner).toBeCalledTimes(0);
            expect(deletePromoCampaignBanner).toBeCalledTimes(1);
        });
    });

    describe('test `normalizeFirstStepValue` function', () => {
        const dataForNormalize = {
            ...promoCampaignTestData,
            datePicker: [moment('2021-04-21'), moment('2021-05-20')],
            settings: {
                ...promoCampaignTestData.settings,
                priority_on_web_url: URL_SOURCE_VALUE_PROMO_CAMPAIGN,
            },
        };

        it('exist all data', () => {
            expect(normalizeFirstStepValue(dataForNormalize)).toEqual({
                ...dataForNormalize,
                startDate: moment('2021-04-21').startOf('day').toISOString(),
                finishDate: moment('2021-05-20').endOf('day').toISOString(),
                settings: {
                    ...dataForNormalize.settings,
                    priority_on_web_url: true,
                },
            });
        });

        it('`webUrl` should be `null`', () => {
            const newData = {
                ...dataForNormalize,
                webUrl: '',
            };
            expect(normalizeFirstStepValue(newData)).toEqual({
                ...newData,
                startDate: moment('2021-04-21').startOf('day').toISOString(),
                finishDate: moment('2021-05-20').endOf('day').toISOString(),
                settings: {
                    ...newData.settings,
                    priority_on_web_url: true,
                },
                webUrl: null,
            });
        });

        it('`startDate` and `finishDate` should be undefined', () => {
            const newData = {
                ...dataForNormalize,
                datePicker: [],
            };
            expect(normalizeFirstStepValue(newData)).toEqual({
                ...newData,
                startDate: undefined,
                finishDate: undefined,
                settings: {
                    ...newData.settings,
                    priority_on_web_url: true,
                },
            });
        });

        it('`settings.priority_on_web_url` should be false', () => {
            const newData = {
                ...dataForNormalize,
                datePicker: [],
                settings: {
                    ...dataForNormalize.settings,
                    priority_on_web_url: 'another_value',
                },
            };
            expect(normalizeFirstStepValue(newData)).toEqual({
                ...newData,
                startDate: undefined,
                finishDate: undefined,
                settings: {
                    ...newData.settings,
                    priority_on_web_url: false,
                },
            });
        });

    });

    describe('test `normalizePromoCampaignData` function', () => {

        it('should return empty object', () => {
            expect(normalizePromoCampaignData({})).toEqual({});
            expect(normalizePromoCampaignData({ promoCampaign: '' })).toEqual({});
        });

        it('should return full data', () => {
            const result = normalizePromoCampaignData({
                promoCampaign: promoCampaignTestData,
                appCode: 'test',
            });
            expect(result).toEqual({
                ...promoCampaignTestData,
                categoryIdList: categoryListTestData.map(({ categoryId }) => categoryId),
                banners: promoCampaignBannersObject,
                texts: promoCampaignTextsObject,
                datePicker: [
                    moment.utc(promoCampaignTestData.startDate).local(),
                    moment.utc(promoCampaignTestData.finishDate).local(),
                ],
                appCode: 'test',
                behaviorType: promoCampaignTestData.behaviorType === behaviorTypes.QR,
            });
            expect(result.datePicker[0] instanceof moment).toBe(true);
            expect(result.datePicker[1] instanceof moment).toBe(true);
        });

        it('should empty promoCodeType, appCode, externalId', () => {
            const result = normalizePromoCampaignData({
                promoCampaign: promoCampaignTestData,
                appCode: 'test',
                isCopy: true,
            });

            expect(result).toEqual({
                ...promoCampaignTestData,
                categoryIdList: categoryListTestData.map(({ categoryId }) => categoryId),
                banners: promoCampaignBannersObject,
                texts: promoCampaignTextsObject,
                datePicker: [
                    moment.utc(promoCampaignTestData.startDate).local(),
                    moment.utc(promoCampaignTestData.finishDate).local(),
                ],
                appCode: undefined,
                promoCodeType: undefined,
                externalId: '',
                behaviorType: promoCampaignTestData.behaviorType === behaviorTypes.QR,
            });
            expect(result.datePicker[0] instanceof moment).toBe(true);
            expect(result.datePicker[1] instanceof moment).toBe(true);
        });

        it('startDate and finishDate should be undefined', () => {
            const nextPromoCampaignData = {
                ...promoCampaignTestData,
                startDate: null,
                finishDate: null,
            };
            const result = normalizePromoCampaignData({
                promoCampaign: nextPromoCampaignData,
                appCode: 'test',
            });

            expect(result).toEqual({
                ...nextPromoCampaignData,
                categoryIdList: categoryListTestData.map(({ categoryId }) => categoryId),
                banners: promoCampaignBannersObject,
                texts: promoCampaignTextsObject,
                datePicker: [undefined, undefined],
                appCode: 'test',
                behaviorType: promoCampaignTestData.behaviorType === behaviorTypes.QR,
            });
        });

        it('should call `getAppCode` function', () => {
            (getAppCode as jest.Mock).mockImplementation(() => 'testAppCode');
            const result = normalizePromoCampaignData({
                promoCampaign: promoCampaignTestData,
            });
            expect(result).toEqual({
                ...promoCampaignTestData,
                categoryIdList: categoryListTestData.map(({ categoryId }) => categoryId),
                banners: promoCampaignBannersObject,
                texts: promoCampaignTextsObject,
                datePicker: [
                    moment.utc(promoCampaignTestData.startDate).local(),
                    moment.utc(promoCampaignTestData.finishDate).local(),
                ],
                appCode: 'testAppCode',
                behaviorType: promoCampaignTestData.behaviorType === behaviorTypes.QR,
            });
            expect(result.datePicker[0] instanceof moment).toBe(true);
            expect(result.datePicker[1] instanceof moment).toBe(true);
        });

    });

    it('test `getDataForSend` function', () => {
        const pickData = pick(promoCampaignTestData, [
            'name',
            'dzoId',
            'webUrl',
            'active',
            'offerDuration',
            'finishDate',
            'startDate',
            'promoCodeType',
            'settings',
            'standalone',
            'type',
            'categoryIdList',
            'oneLinkAppUrl',
            'behaviorType',
            'externalId',
        ]);

        expect(getDataForSend(promoCampaignTestData as any)).toEqual(pickData);
        expect(
            getDataForSend({ ...(promoCampaignTestData as any), externalId: 'test' }),
        ).toEqual({
            ...pickData,
            externalId: 'test',
        });
        expect(
            getDataForSend({ ...(promoCampaignTestData as any), externalId: '' }),
        ).toEqual({
            ...pickData,
            externalId: null,
        });
    });

    it('test `getPromoCampaignForCopy` function', () => {
        const pickData = pick(promoCampaignTestData, [
            'active',
            'behaviorType',
            'categoryIdList',
            'dzoId',
            'name',
            'externalId',
            'finishDate',
            'startDate',
            'offerDuration',
            'oneLinkAppUrl',
            'promoCodeType',
            'settings',
            'standalone',
            'type',
            'webUrl',
        ]);

        expect(
            getPromoCampaignForCopy(promoCampaignTestData, true),
        ).toEqual({
            ...pickData,
            copyVisibilitySettings: true,
        });

        expect(
            getPromoCampaignForCopy({ ...promoCampaignTestData, externalId: 'testId' }, false),
        ).toEqual({
            ...pickData,
            externalId: 'testId',
            copyVisibilitySettings: false,
        });
    });

    describe('test `checkUniqVisibilitySettings` function', () => {
        const visibilitySettings: PromoCampaignFormVisibilitySettingCreateDto[] = [
            {
                id: 1,
                location: { id: 0 } as any,
                salePoint: { id: 2 } as any,
                visible: true,
                errors: {},
            },
            {
                id: 2,
                location: { id: 2 } as any,
                salePoint: { id: 4 } as any,
                visible: false,
                errors: {},
            },
            {
                id: 3,
                location: { id: 3 } as any,
                salePoint: null,
                visible: false,
                errors: {},
            },
        ];

        it('should all be uniq', () => {
            expect(checkUniqVisibilitySettings(visibilitySettings)).toHaveLength(0);
        });

        it('should same second and last settings', () => {
            expect(
                checkUniqVisibilitySettings([...visibilitySettings, {
                    location: { id: 0 } as any,
                    salePoint: { id: 2 } as any,
                    visible: false,
                    errors: {},
                    id: 0,
                }]),
            ).toEqual([[0, 3]]);
        });

    });

    describe('test `getVisibilitySettingsWithDoubleError` function', () => {
        const visibilitySettings: PromoCampaignFormVisibilitySettingCreateDto[] = [
            {
                id: 0,
                errors: {},
                location: { id: 0, name: 'first location' } as any,
                salePoint: { id: 2, name: 'first salePoint' } as any,
                visible: true,
            },
            {
                id: 2,
                errors: {},
                location: { id: 2, name: 'second location' } as any,
                salePoint: { id: 4, name: 'second salePoint' } as any,
                visible: false,
            },
            {
                id: 22,
                errors: {},
                location: { id: 3, name: 'third location' } as any,
                salePoint: null,
                visible: false,
            },
        ];

        it('should don`t has double error', () => {
            expect(getVisibilitySettingsWithDoubleError(visibilitySettings, [])).toEqual(visibilitySettings);
        });

        it('should be errors in second and last element', () => {
            const handledSettings = getVisibilitySettingsWithDoubleError([...visibilitySettings, {
                location: { id: 2, name: 'second location' } as any,
                salePoint: { id: 4, name: 'second salePoint' } as any,
                visible: true,
                id: 22,
                errors: {},
            }], [[1, 3]]);
            const errText = 'Нельзя добавить одинаковые настройки видимости с локацией \'second location\'  и  точкой продажи \'second salePoint\'';

            expect(handledSettings[1].errors.server).toBe(errText);
            expect(handledSettings[3].errors.server).toBe(errText);
        });
    });

    describe('test `getVisibilitySettingsWithUpdatedErrors` function', () => {
        const visibilitySettings: PromoCampaignFormVisibilitySettingCreateDto[] = [
            {
                id: 0,
                location: { id: 0 } as any,
                salePoint: { id: 2 } as any,
                visible: true,
                errors: {
                    server: 'test error',
                },
            },
            {
                id: 0,
                location: { id: 2 } as any,
                salePoint: { id: 4 } as any,
                visible: false,
                errors: {
                    server: 'test error',
                },
            },
            {
                id: 0,
                location: { id: 3 } as any,
                salePoint: null,
                visible: false,
                errors: {
                    server: 'test error',
                },
            },
        ];

        it('should don`t change array', () => {
            expect(getVisibilitySettingsWithUpdatedErrors(visibilitySettings, 0, false)).toBe(visibilitySettings);
        });

        it('should remove error only from second setting', () => {
            const result = getVisibilitySettingsWithUpdatedErrors(visibilitySettings, 1, true);

            expect(result[0].errors.server).toBe('test error');
            expect(result[1].errors.server).toBeUndefined();
            expect(result[2].errors.server).toBe('test error');
        });

        it('should remove errors from all object', () => {
            const newSettings = visibilitySettings.slice();
            newSettings[0] = {
                ...newSettings[0],
                errors: {},
            };
            const result = getVisibilitySettingsWithUpdatedErrors(newSettings, 1, true);

            expect(result[0].errors).toEqual({});
            expect(result[1].errors).toEqual({});
            expect(result[2].errors).toEqual({});
        });
    });

    it('test `checkPromoCodes` function', () => {
        expect(checkPromoCodes(promoCampaignTestData as any, promoCampaignTestData)).toBe(promoCampaignTestData.promoCodeType);

        expect(
            checkPromoCodes(
                { ...promoCampaignTestData, promoCodeType: 'newType' } as any,
                promoCampaignTestData,
            ),
        ).toBe('newType');
    });

    it('test `getPromoCampaignValue` function', () => {
        expect(getPromoCampaignValue(promoCampaignTestData, undefined)).toBe(promoCampaignTestData);

        expect(
            getPromoCampaignValue(promoCampaignTestData, { ...promoCampaignTestData, test: 123 } as any),
        ).toEqual({ ...promoCampaignTestData, test: 123 });
    });

});
