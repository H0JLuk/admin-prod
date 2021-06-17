import { BundleDto } from '@types';

export type BundleDtoWithLinksLength = BundleDto & {
    linksLength: number;
};

export type BundlesRelatedCampaigns = {
    bundles: BundleDtoWithLinksLength[];
    relatedCampaigns: BundleDtoWithLinksLength[];
};

export type CheckedItem = {
    id: number;
    name: string;
    checked: boolean;
};

export type HandlerSelectGroup = (selectItem: CheckedItem) => void;

export type GroupListByTypeProps = {
    type: string;
    checkedItems: Record<number, boolean>;
    dataList: BundleDto[];
    matchPath: string;
    select: boolean;
    handleSelectItem: HandlerSelectGroup;
};

type GroupPromoCampaignOrBundleListItemProps = {
    item: BundleDto;
    checked: boolean;
    matchPath: string;
    select: boolean;
    handleSelectItem: HandlerSelectGroup;
};

