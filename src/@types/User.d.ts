import { LoginTypes } from '@constants/loginTypes';
import { ROLES } from '../constants/roles';
import { DefaultApiResponse, DefaultPaginationResponse } from './Api';
import { ClientAppDto } from './ClientApp';

export type UserDto = {
    captchaText?: string;
    captchaUuid?: string;
    firstName?: string;
    lastName?: string;
    loginType?: LoginTypes;
    middleName?: string;
    newPassword?: string;
    password: string;
    personalNumber: string;
    salePointName?: string;
    userRole?: ROLES;
};

export type UserInfo = {
    id: number;
    blocked: boolean;
    clientAppIds: number[] | null;
    id: number;
    locationId: number;
    locationName: string;
    loginType: LoginTypes;
    personalNumber: string;
    role: ROLES;
    salePointId: number;
    salePointName: string;
    tempPassword: boolean;
    tmpBlocked: boolean;
};

export type RegisterUserRequest = {
    clientAppIds?: number[];
    personalNumber: string;
    salePointId: number;
};

export type UpdateUserRequest = Omit<RegisterUserRequest, 'personalNumber'>;

export type UserPaginationResponse = DefaultPaginationResponse & {
    users: UserInfo[];
};

export type ResetUserPassword = DefaultApiResponse & {
    generatedPassword: string;
};

export type SaveUserResponse = DefaultApiResponse & {
    generatedPassword: string;
};

export type UpdateUsersSalePoint = {
    salePointId?: number;
    userIds: number[];
};

export type LoginResponse = {
    authority: ROLES;
    availableApps: ClientAppDto[];
    loginType: string; // TODO: to enum;
    token: string;
};
