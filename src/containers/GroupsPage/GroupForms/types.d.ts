import { BannerCreateDto, BannerCreateTextDto, BundleDto } from '@types';

export type CreateGroupLinkDto = Pick<LinksCreateDto, 'texts' | 'banners'> & {
    campaignId?: number;
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
};

export type BundleGroupDto = Pick<BundleDto, 'active' | 'name' | 'type'> & {
    texts: Record<string, string>;
    banners: Record<string, string>;
    links: LinksCreateDto[];
};

export type EditGroupBannersAndTextsDto = Omit<CreateGroupLinkDto, 'campaignId'>;
