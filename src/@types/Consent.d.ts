import { ClientAppDto } from './ClientApp';

export type ConsentDto = {
    id: number;
    active: boolean;
    clientApplications: ClientAppDto[];
    createDate?: string;
    updateDate?: string;
    signed: boolean;
    text: string;
    version: string;
};

export type SaveConsentRequest = {
    id?: number;
    createDate: string;
    text: string;
    version: string;
};
