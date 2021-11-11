import { getRole } from '../api/services/sessionService';
import ROLES from './roles';

export type UsersInteractions = Record<string, ROLES[]>;

const DEFAULT_USERS_INTERACTIONS: UsersInteractions = {
    editUser: [],
    resetUserPassword: [],
    unlockUser: [],
    deleteUser: [],
    canSelectUserInTable: [],
    canGenerateQRCode: [],
};

const USERS_INTERACTIONS_BY_ROLE: Record<ROLES, UsersInteractions> = {
    [ROLES.ADMIN]: {
        editUser: [ROLES.USER, ROLES.PARTNER, ROLES.EXTERNAL_USER, ROLES.REFERAL_LINK],
        resetUserPassword: [ROLES.USER, ROLES.PARTNER, ROLES.EXTERNAL_USER, ROLES.REFERAL_LINK],
        unlockUser: [ROLES.USER, ROLES.PARTNER, ROLES.EXTERNAL_USER, ROLES.REFERAL_LINK],
        deleteUser: [ROLES.USER, ROLES.PARTNER, ROLES.EXTERNAL_USER, ROLES.REFERAL_LINK],
        canSelectUserInTable: [ROLES.USER, ROLES.PARTNER, ROLES.EXTERNAL_USER, ROLES.REFERAL_LINK],
        canGenerateQRCode: [ROLES.USER, ROLES.PARTNER, ROLES.EXTERNAL_USER, ROLES.REFERAL_LINK],
    },
    [ROLES.USER_MANAGER]: {
        editUser: [ROLES.USER],
        resetUserPassword: [ROLES.USER],
        unlockUser: [ROLES.USER],
        deleteUser: [ROLES.USER],
        canSelectUserInTable: [ROLES.USER],
    },
    [ROLES.AUDITOR]: {
        ...DEFAULT_USERS_INTERACTIONS,
    },
    [ROLES.PRODUCT_OWNER]: {
        ...DEFAULT_USERS_INTERACTIONS,
    },
    [ROLES.USER]: {
        ...DEFAULT_USERS_INTERACTIONS,
    },
    [ROLES.PARTNER]: {
        editUser: [ROLES.EXTERNAL_USER, ROLES.REFERAL_LINK],
        resetUserPassword: [ROLES.EXTERNAL_USER, ROLES.REFERAL_LINK],
        unlockUser: [ROLES.EXTERNAL_USER, ROLES.REFERAL_LINK],
        deleteUser: [ROLES.EXTERNAL_USER, ROLES.REFERAL_LINK],
        canSelectUserInTable: [ROLES.EXTERNAL_USER, ROLES.REFERAL_LINK],
    },
    [ROLES.EXTERNAL_USER]: {
        ...DEFAULT_USERS_INTERACTIONS,
    },
    [ROLES.REFERAL_LINK]: {
        ...DEFAULT_USERS_INTERACTIONS,
    },
};

export type CommonPermissions = {
    canSetUserRole: boolean;
    canSetUserPartner: boolean;
    canSetLoginType: boolean;
};

const COMMON_PERMISSIONS_BY_ROLE: Record<ROLES, CommonPermissions> = {
    [ROLES.ADMIN]: {
        canSetUserRole: true,
        canSetUserPartner: true,
        canSetLoginType: true,
    },
    [ROLES.USER_MANAGER]: {
        canSetUserRole: false,
        canSetUserPartner: false,
        canSetLoginType: true,
    },
    [ROLES.AUDITOR]: {
        canSetUserRole: false,
        canSetUserPartner: false,
        canSetLoginType: false,
    },
    [ROLES.PRODUCT_OWNER]: {
        canSetUserRole: false,
        canSetUserPartner: false,
        canSetLoginType: false,
    },
    [ROLES.USER]: {
        canSetUserRole: false,
        canSetUserPartner: false,
        canSetLoginType: false,
    },
    [ROLES.PARTNER]: {
        canSetUserRole: false,
        canSetUserPartner: false,
        canSetLoginType: false,
    },
    [ROLES.EXTERNAL_USER]: {
        canSetUserRole: false,
        canSetUserPartner: false,
        canSetLoginType: false,
    },
    [ROLES.REFERAL_LINK]: {
        canSetUserRole: false,
        canSetUserPartner: false,
        canSetLoginType: false,
    },
};

/**
 * Объект, который определяет какие взаимодействия доступны для ролей в отношении пользователей с другими ролями
 * На выходе получится объект вида:
 * {
 *    Admin: {
 *       Admin: {
 *          editUser: boolean,
 *          resetUserPassword: boolean,
 *          unlockUser: boolean,
 *          deleteUser: boolean,
 *       },
 *       User: {....}
 *    }
 * }
 * Чтобы получить объект с настройками взаимодействия текущего пользователя
 * с другим выбранным пользователем нужно первым ключём передать роль текущего пользователя,
 * а вторым параметром передать роль выбранного пользователя
 *
 * INTERACTIONS_CURR_USER_WITH_OTHER_USER[getRole()][userRole]; // где `userRole` роль выбранного пользователя
 */

export type InteractionsCurrUserToOtherUser = Record<string, boolean>;
export type InteractionsForOtherUser = Record<ROLES, InteractionsCurrUserToOtherUser>;
export type InteractionsCurrUserWIthOtherUser = Record<ROLES, InteractionsForOtherUser>;

export const INTERACTIONS_CURR_USER_WITH_OTHER_USER = Object.values(ROLES).reduce((allInteractions, currRole) => {
    const currInteractions = USERS_INTERACTIONS_BY_ROLE[currRole] || DEFAULT_USERS_INTERACTIONS;

    const interactionsForOtherUser = Object.values(ROLES).reduce((interactionsForOtherRole, otherRole) => {
        const interactionsCurrUserWithOtherUser = Object.entries(currInteractions).reduce((result, [key, value]) => ({
            ...result,
            [key]: value.includes(otherRole),
        }), {} as InteractionsCurrUserToOtherUser);

        return {
            ...interactionsForOtherRole,
            [otherRole]: interactionsCurrUserWithOtherUser,
        };
    }, {} as InteractionsForOtherUser);

    return {
        ...allInteractions,
        [currRole]: {
            ...interactionsForOtherUser,
        },
    };
}, {} as InteractionsCurrUserWIthOtherUser);

export function getCommonPermissionsByRole() {
    return COMMON_PERMISSIONS_BY_ROLE[getRole()] || {};
}

export function getCurrUserInteractions() {
    return INTERACTIONS_CURR_USER_WITH_OTHER_USER[getRole()] || {};
}

export function getCurrUserInteractionsForOtherUser(role: ROLES) {
    return getCurrUserInteractions()[role] || {};
}
