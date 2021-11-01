import { DefaultApiResponse } from './Api';
import { BannerDto } from './Banner';
import { BannerTextDto } from './BannerText';
import { BundleLink } from './Bundle';
import { CategoryDto } from './Category';
import { ClientAppDto } from './ClientApp';
import { PromoCodeType } from './PromoCode';

export type PromoCampaignReport = {
    active: boolean;
    clientApplicationCode: string;
    clientApplicationDisplayName: string;
    clientApplicationId: number;
    deleted: boolean;
    dzoId: number;
    dzoName: string;
    expireInDays: number | null;
    issuedCodePercents: number;
    noCodes: boolean;
    promoCampaignId: number;
    promoCampaignName: string;
};

export type PromoCampaignDto = {
    active: boolean;
    banners: BannerDto[];
    categoryList: CategoryDto[];
    categoryIdList: number[];
    childGroups: [];
    clientApplicationDto: ClientAppDto;
    deleted: boolean;
    dzoId: number;
    dzoName: string;
    externalId: number | null;
    finishDate: string;
    id: number;
    landingId: number | null;
    links: BundleLink[];
    name: string;
    offerDuration: number;
    oneLinkAppUrl: string | null;
    orderNumber: number;
    priority: number;
    promoCodeType: PromoCodeType;
    texts: BannerTextDto[];
    productOfferingId: string | null;
    webUrl: string;
    startDate: string;
    type: string;
    settings: PromoCampaignSettingsDto;
    standalone: boolean;
    behaviorType: string;
};

export type PromoCampaignListResponse = DefaultApiResponse & {
    promoCampaignDtoList: PromoCampaignDto[];
};

export type PromoCampaignStatisticsDto = {
    campaignId: number;
    issuedPromoCodesNumber: number;
    totalPromoCodesNumber: number;
};

export type PromoCampaignStatisticsResponse = DefaultApiResponse & {
    promoCampaignStatisticsDto: PromoCampaignStatisticsDto;
};

export type PromoCampaignTextCreateDto = Omit<BannerTextDto, 'id'> & {
    promoCampaignId: number;
};

export type PromoCampaignTextUpdateDto = Omit<PromoCampaignTextCreateDto, 'promoCampaignId'>;

export type PromoCampaignSettingsDto = {
    priority_on_web_url: boolean;
    alternative_offer_mechanic: boolean;
    details_button_label: string;
    details_button_url: string;
    disabled_banner_types: string[];
    sale_enabled: boolean;
};

export type PromoCampaignFilterRequest = Omit<PromoCampaignDto, 'categoryList' | 'categoryIdList'> & {
    categories: number[];
};

export type PromoCampaignCreateDto = {
    active: boolean;
    behaviorType: string;
    categoryIdList: number[];
    dzoId: number;
    externalId: string | number | null;
    finishDate: string;
    name: string;
    offerDuration: number;
    oneLinkAppUrl: string | null;
    promoCodeType: PromoCodeType;
    settings: Record<string, any>;
    standalone: boolean;
    startDate: string;
    type: string;
    webUrl: string;
};
