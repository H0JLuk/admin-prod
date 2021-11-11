import { BannerCreateDto, BannerCreateTextDto, BundleDto, BundleLinksFormDto } from '@types';

export type CreateGroupLinkDto = Pick<LinksCreateDto, 'texts' | 'banners' | 'campaignId' | 'settings'> & {
    id?: number | null;
};

export type BundleInitialValue = Pick<BundleDto, 'texts' | 'banners' | 'links' | 'name'> & {
    mainCampaignId?: number;
};

export type BundleEditDto = Omit<BundleDto, 'clientApplicationDto' | 'deleted'>;

export type LinksCreateDto = {
    texts: BannerCreateTextDto;
    banners: BannerCreateDto;
    id: number | null;
    campaignId?: number;
    mainCampaignId?: number;
    settings: Record<string, any>;
};

export type GroupLinkSettings = { display_logo_on_bundle: boolean; };

export type BundleGroupDto = Pick<BundleDto, 'active' | 'name' | 'type' | 'externalId'> & {
    texts: Record<string, string>;
    banners: Record<string, string>;
    links: BundleLinksFormDto[];
};

export type EditGroupBannersAndTextsDto = Omit<CreateGroupLinkDto, 'campaignId' | 'settings'>;
