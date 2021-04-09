import { getRole } from '../api/services/sessionService';
import ROLES from './roles';

const DEFAULT_USERS_INTERACTIONS = {
    editUser: [],
    resetUserPassword: [],
    unlockUser: [],
    deleteUser: [],
    canSelectUserInTable: [],
};

const USERS_INTERACTIONS_BY_ROLE = {
    [ROLES.ADMIN]: {
        editUser: [ROLES.USER],
        resetUserPassword: [ROLES.USER],
        unlockUser: [ROLES.USER],
        deleteUser: [ROLES.USER],
        canSelectUserInTable: [ROLES.USER],
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
export const INTERACTIONS_CURR_USER_WITH_OTHER_USER = Object.values(ROLES).reduce((allInteractions, currRole) => {
    const currInteractions = USERS_INTERACTIONS_BY_ROLE[currRole] || DEFAULT_USERS_INTERACTIONS;

    const interactionsForOtherUser = Object.values(ROLES).reduce((interactionsForOtherRole, otherRole) => {
        const interactionsCurrUserWithOtherUser = Object.entries(currInteractions).reduce((result, [key, value]) => ({
            ...result,
            [key]: value.includes(otherRole),
        }), {});

        return {
            ...interactionsForOtherRole,
            [otherRole]: interactionsCurrUserWithOtherUser,
        };
    }, {});

    return {
        ...allInteractions,
        [currRole]: {
            ...interactionsForOtherUser,
        },
    };
}, {});

export function getCurrUserInteractions() {
    return INTERACTIONS_CURR_USER_WITH_OTHER_USER[getRole()] || {};
}

export function getCurrUserInteractionsForOtherUser(role) {
    return getCurrUserInteractions()[role] || {};
}
