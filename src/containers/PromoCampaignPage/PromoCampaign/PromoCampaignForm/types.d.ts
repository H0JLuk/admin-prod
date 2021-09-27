import {
    BannerCreateDto,
    BannerCreateTextDto,
    LocationDto,
    PromoCampaignDto,
    PromoCampaignSettingsDto,
    SalePointDto,
    VisibilitySettingDto,
} from '@types';
import { INFO_ROWS_KEYS } from './PromoCampaignSteps/StepTextAndImage/Templates/templateConstants';

export type PromoCampaignFormVisibilitySettingCreateDto = {
    salePoint: SalePointDto | null;
    location: LocationDto | null;
    visible: boolean;
    id: number;
    errors: Record<string, any>;
};

export type PromoCampaignFormInitialState = {
    name: string;
    saleEnabled: boolean;
    behaviorType: boolean;
    webUrl: string;
    productOfferingId: number | null;
    active: boolean;
    offerDuration: number;
    finishDate: string;
    startDate: string;
    externalId: string | number | null;
    type: INFO_ROWS_KEYS;
    oneLinkAppUrl?: string;
    settings: PromoCampaignSettingsDto;
    standalone: boolean;
    banners: BannerCreateDto | unknown[];
    texts: BannerCreateTextDto | unknown[];
    dzoId: null | number;
    promoCodeType: string | null;
    datePicker: unknown[];
    appCode: string | null;
    visibilitySettings: PromoCampaignFormVisibilitySettingCreateDto[];
    categoryIdList: number[];
    appCode: string;
};

export type PromoCampaignFormStateFormLocation = {
    promoCampaign: PromoCampaignDto;
    copyVisibilitySettings: PromoCampaignFormVisibilitySettingCreateDto[];
};

export type PromoCampaignFormTextAndBannersRefState = {
    texts: BannerCreateTextDto;
    banners: BannerCreateDto;
};

export type PromoCampaignFormDataFormSend = {
    name: string;
    dzoId: number | null;
    webUrl: string;
    active: boolean;
    finishDate: string;
    startDate: string;
    promoCodeType: string | null;
    settings: PromoCampaignSettingsDto;
    oneLinkAppUrl?: string;
    behaviorType: string;
    standalone: boolean;
    type: string;
    categoryIdList: number[];
    externalId: number | null | string;
};
export type PromoCampaignDtoWithAppCode = PromoCampaignDto & {
    appCode: string;
};

export type PromoCampaignFormSavedStateRef = PromoCampaignDto & {appCode: string;};

export type PromoCampaignOnDeleteFunction = (textId: number, type: string) => void;

export type PromoCampaignFormNormalizedFirstStepFunc = PromoCampaignDto & { datePicker: Moment[]; };

export type PromoCampaignFormNormalizeDataFunc = {
    promoCampaign: PromoCampaignDto;
    appCode?: string;
    isCopy?: boolean | undefined;
};

export type PromoCampaignFormNormalizedDataValue = {
    name: string;
    webUrl: string;
    promoCodeType: string;
    active: boolean;
    dzoId: number;
    type: string;
    categoryIdList: number[];
    banners: Record<string, string>;
    texts: Record<string, string>;
    datePicker: string[] | undefined[];
    appCode: undefined | string;
    offerDuration: number;
    settings: PromoCampaignSettingsDto;
    standalone: boolean;
    externalId: string | number;
};

export type PromoCampaignVisibilitySettingDto = VisibilitySettingDto & {
    errors: Record<string, any>;
};

export type PromoCampaignSaveDataFunc = <SavedData extends {[key in keyof SavedData]: SavedData[key]}>(data: SavedData) => PromoCampaignFormSavedStateRef;
