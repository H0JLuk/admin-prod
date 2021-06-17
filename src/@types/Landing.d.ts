import { DefaultApiResponse } from './Api';

export type LandingDto = {
    landingId: number;
    description: string;
    header: string;
    imageUrl: string;
};

export type SaveLandingRequest = Omit<LandingDto, 'landingId'>;

export type LandingListResponse = DefaultApiResponse & {
    landingDtoList: LandingDto[];
};
