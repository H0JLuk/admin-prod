export type DzoApplication = {
    applicationId: number;
    applicationType: string;
    applicationUrl: string;
    dzoId: number;
    deleted: boolean;
};

export type IDzoItem = {
    cardUrl: string;
    description: string;
    dzoCode: string;
    dzoId: number;
    dzoName: string;
    dzoPresentationUrl?: string;
    deleted: boolean;
    header: string;
    logoUrl: string;
    screenUrl: string;
    webUrl: string;
    applicationList: DzoApplication[];
    dzoBannerList: IDzoBannerList[];
};

interface IDzoBannerList {
    default: boolean;
    id: number;
    orderNumber: number;
    type: keyof typeof dzoBannerTypes;
    url: string;
}

export interface IDzoListResponse extends DefaultApiResponse {
    dzoDtoList: IDzoItem[];
}

export type SaveDzoApplicationRequest = {
    applicationType: string;
    applicationUrl: string;
    dzoId: number;
};

export enum dzoBannerTypes {
    LOGO_MAIN = 'LOGO_MAIN',
    LOGO_ICON = 'LOGO_ICON',
    LOGO_SECONDARY = 'LOGO_SECONDARY',
}
