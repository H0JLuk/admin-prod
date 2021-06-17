import { DefaultPaginationResponse } from './Api';

export type VisibilitySettingsRequest = {
    promoCampaignId: number;
    locationId?: number;
    salePointId?: number;
    visible?: boolean;
};

export type VisibilitySettingDto = {
    id: number;
    locationId: number;
    locationName: string;
    salePointId: number;
    salePointName: string;
    visible: boolean;
};

export type VisibilitySettingsPaginationResponse = DefaultPaginationResponse & {
    visibilitySettings: VisibilitySettingDto[];
};
