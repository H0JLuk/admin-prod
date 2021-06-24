export enum ROLES {
    ADMIN = 'Admin',
    AUDITOR = 'Auditor',
    PRODUCT_OWNER = 'Owner',
    USER_MANAGER = 'UserManager',
    USER = 'User',
    PARTNER = 'Partner',
    EXTERNAL_USER = 'ExternalUser',
    REFERAL_LINK = 'ReferralLink',
}

export const ROLES_RU = {
    [ROLES.ADMIN]: 'Админ',
    [ROLES.AUDITOR]: 'Аудитор',
    [ROLES.PRODUCT_OWNER]: 'Владелец',
    [ROLES.USER_MANAGER]: 'Менеджер пользователей',
    [ROLES.USER]: 'Пользователь',
    [ROLES.PARTNER]: 'Партнёр',
    [ROLES.EXTERNAL_USER]: 'Внешний пользователь',
    [ROLES.REFERAL_LINK]: 'Реферал',
};

export const ROLES_OPTIONS = Object.values(ROLES).filter(val => val !== ROLES.AUDITOR).map(role => ({
    value: role,
    label: ROLES_RU[role],
}));

export default ROLES;
