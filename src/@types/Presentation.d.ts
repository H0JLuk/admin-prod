import { DefaultApiResponse } from './Api';

export type PresentationDto = {
    landingId: number;
    description: string;
    header: string;
    imageUrl: string;
};

export type SavePresentationRequest = Omit<PresentationDto, 'landingId'>;

export type PresentationListResponse = DefaultApiResponse & {
    landingDtoList: PresentationDto[];
};
