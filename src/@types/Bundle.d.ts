import { DefaultApiResponse } from './Api';
import { CategoryDto } from './Category';
import { ClientAppDto } from './ClientApp';
import { BannerTextDto } from './BannerText';
import { BannerDto } from './Banner';

export type BundleGroupTextDto = Omit<BannerTextDto, 'id'> & {
    groupId: number;
};

export type BundleLinkTextDto = Omit<BannerTextDto, 'id'> & {
    linkId: number;
};

export type BundleLink = {
    banners: BannerDto[];
    campaignId: number;
    categoryList: CategoryDto[];
    deleted: boolean;
    dzoId: number;
    id: number;
    mainCampaignId: number;
    mainDzoId: number;
    name: string;
    settings: Record<string, any>;
    texts: BannerTextDto[];
};

export type BundleLinksFormDto = Omit<LinksCreateDto, 'settings'> & { displayLogoOnBundle: boolean; };

export type BundleDto = {
    active?: boolean;
    banners: BannerDto[];
    clientApplicationDto: ClientAppDto;
    deleted: boolean;
    id: number;
    links: BundleLink[];
    name: string;
    texts: BannerTextDto[];
    type: BundleTypes;
    externalId?: string;
};

export type BundleCreateDto = Pick<BundleDto, 'active' | 'type' | 'name' | 'externalId'> & {
    mainCampaignId?: number;
};

export type BundleCreateLinkDto = {
    campaignId: number;
    groupId: number;
};

export type BundleListResponse = DefaultApiResponse & {
    groups: BundleDto[];
};
