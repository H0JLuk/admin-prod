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
    locationId: number;
    locationName: string;
    loginType: LoginTypes | null;
    personalNumber: string;
    parentUserName: string | null;
    role: ROLES;
    salePointId: number;
    salePointName: string;
    tempPassword: boolean;
    tmpBlocked: boolean;
    uuid: string | null;
};

export type RegisterUserRequest = {
    role?: ROLES;
    loginType?: LoginTypes;
    clientAppIds?: number[];
    personalNumber: string;
    salePointId?: number;
    parent: string | null;
    generateUuid?: boolean;
};

export type UpdateUserRequest = Omit<RegisterUserRequest, 'personalNumber'> & { generateUuid?: boolean; };

export type UserPaginationResponse = DefaultPaginationResponse & {
    users: UserInfo[];
};

export type ResetUserPassword = DefaultApiResponse & {
    generatedPassword: string;
};

export type SaveUserResponse = DefaultApiResponse & {
    userName: string;
    generatedPassword: string;
};

export type UpdateUsersSalePoint = {
    salePointId?: number;
    userIds: number[];
};

export type LoginResponse = {
    authority: ROLES;
    availableApps: ClientAppDto[];
    loginType: LoginTypes;
    token: string;
};

export type DirectLinkRequest = {
    clientAppCode: string;
    userId: number;
};

export type QRRequest = {
    clientAppCode: string;
    parentId: number;
    userIds: number[];
};
