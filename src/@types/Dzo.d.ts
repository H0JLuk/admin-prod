import { BannerDto } from './Banner';

export type DzoApplication = {
    applicationId: number;
    applicationType: string;
    applicationUrl: string;
    dzoId: number;
    deleted: boolean;
};

export type DzoDto = {
    cardUrl: string;
    description: string | null;
    dzoCode: string;
    dzoId: number;
    dzoName: string;
    dzoPresentationUrl?: string;
    deleted: boolean;
    header: string | null;
    logoUrl: string;
    screenUrl: string;
    webUrl: string;
    applicationList: DzoApplication[];
    dzoBannerList: BannerDto[];
};

export interface IDzoListResponse extends DefaultApiResponse {
    dzoDtoList: DzoDto[];
}

export type SaveDzoApplicationRequest = {
    applicationType: string;
    applicationUrl: string;
    dzoId: number;
};
