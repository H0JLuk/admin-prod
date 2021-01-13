import ROLES from './roles';
import { ROUTE_ADMIN, ROUTE_AUDITOR, ROUTE_OWNER, ROUTE_USER_MANAGER } from './route';
import { menuItemLables as labels } from './lables';
import { getDefaultAppCode } from '../api/services/clientAppService';

const AUDITOR_MENU_ITEMS = [
    { label: labels.AUDIT, path: ROUTE_AUDITOR.AUDIT }
];

const USER_MANAGER_MENU_ITEMS = [
    { label: labels.USERS, path: ROUTE_USER_MANAGER.USERS }
];

const ADMIN_MENU_ITEMS = [
    { label: labels.DASHBOARD, path: ROUTE_ADMIN.DASHBOARD },
    { label: labels.USERS, path: ROUTE_ADMIN.USERS },
    { label: labels.FILES, path: ROUTE_ADMIN.FILES },
    { label: labels.DZO, path: ROUTE_ADMIN.DZO },
    { label: labels.LANDING, path: ROUTE_ADMIN.LANDING },
    { label: labels.CATEGORY, path: ROUTE_ADMIN.CATEGORY },
    { label: labels.PROMO_CAMPAIGNS, path: ROUTE_ADMIN.PROMO_CAMPAIGN },
];

// Список доступных вкладок для приложений с кодом оканчивающимся на "-point", таких как "promo-point" и "mcdonalds-point"
const ADMIN_MENU_FOR_POINT_APP = [
    { label: labels.DASHBOARD, path: ROUTE_ADMIN.DASHBOARD },
    { label: labels.USERS, path: ROUTE_ADMIN.USERS },
    { label: labels.FILES, path: ROUTE_ADMIN.FILES },
    { label: labels.DZO, path: ROUTE_ADMIN.DZO },
    { label: labels.PROMO_CAMPAIGNS, path: ROUTE_ADMIN.PROMO_CAMPAIGN },
];

const PRODUCT_OWNER_MENU_ITEMS = [
    { label: labels.DASHBOARD, path: ROUTE_OWNER.DASHBOARD },
    { label: labels.DZO, path: ROUTE_OWNER.DZO },
    { label: labels.LANDING, path: ROUTE_OWNER.LANDING },
    { label: labels.CATEGORY, path: ROUTE_OWNER.CATEGORY },
    { label: labels.PROMO_CAMPAIGNS, path: ROUTE_OWNER.PROMO_CAMPAIGN },
];

// Список доступных вкладок для приложений с кодом оканчивающимся на "-point", таких как "promo-point" и "mcdonalds-point"
const PRODUCT_OWNER_MENU_FOR_POINT_APP = [
    { label: labels.DASHBOARD, path: ROUTE_OWNER.DASHBOARD },
    { label: labels.DZO, path: ROUTE_OWNER.DZO },
    { label: labels.PROMO_CAMPAIGNS, path: ROUTE_OWNER.PROMO_CAMPAIGN },
];

export const resolveMenuItemsByRoleAndAppCode = (role, appCode) => {
    if (!appCode) {
        appCode = getDefaultAppCode(); // TODO: remove getDefaultAppCode after second phase
    }

    switch (role) {
        case ROLES.AUDITOR:
            return AUDITOR_MENU_ITEMS;
        case ROLES.ADMIN:
            return (appCode.endsWith('-point') && appCode !== 'greenday-point')
                ? ADMIN_MENU_FOR_POINT_APP
                : ADMIN_MENU_ITEMS;
        case ROLES.PRODUCT_OWNER:
            return (appCode.endsWith('-point') && appCode !== 'greenday-point')
                ? PRODUCT_OWNER_MENU_FOR_POINT_APP
                : PRODUCT_OWNER_MENU_ITEMS;
        case ROLES.USER_MANAGER:
            return USER_MANAGER_MENU_ITEMS;
        default: return [];
    }
};

/* REDESIGNED MENU */
const REDESIGN_USER_MANAGER_SIDEBAR_MENU_ITEMS = [
    { label: labels.USERS, path: ROUTE_USER_MANAGER.USERS },
];

const REDESIGN_USER_MANAGER_TOP_MENU_ITEMS = [
];

const REDESIGN_ADMIN_SIDEBAR_MENU_ITEMS = [
    { label: labels.DASHBOARD, path: ROUTE_ADMIN.DASHBOARD },
    { label: labels.USERS, path: ROUTE_ADMIN.REDESIGNED_USERS },
    { label: labels.DZO, path: ROUTE_ADMIN.DZO },
    { label: labels.CATEGORY, path: ROUTE_ADMIN.CATEGORY },
];

const REDESIGN_ADMIN_TOP_MENU_ITEMS = [
    { label: labels.PRESENTATION, path: ROUTE_ADMIN.DZO }, // temporary
    { label: labels.PROMO_CAMPAIGNS, path: ROUTE_ADMIN.REDESIGNED_PROMO_CAMPAIGN },
    { label: labels.INSTRUCTIONS, path: ROUTE_ADMIN.DZO }, // temporary
    { label: labels.LANDING, path: ROUTE_ADMIN.LANDING },
    { label: labels.FILES, path: ROUTE_ADMIN.FILES },
];

// Список доступных вкладок для приложений с кодом оканчивающимся на "-point", таких как "promo-point" и "mcdonalds-point"
const REDESIGN_ADMIN_SIDEBAR_MENU_FOR_POINT_APP = [
    { label: labels.DASHBOARD, path: ROUTE_ADMIN.DASHBOARD },
    { label: labels.USERS, path: ROUTE_ADMIN.REDESIGNED_USERS },
    { label: labels.DZO, path: ROUTE_ADMIN.DZO },
];

const REDESIGN_ADMIN_TOP_MENU_FOR_POINT_APP = [
    { label: labels.PRESENTATION, path: ROUTE_ADMIN.DZO }, // temporary
    { label: labels.PROMO_CAMPAIGNS, path: ROUTE_ADMIN.REDESIGNED_PROMO_CAMPAIGN },
    { label: labels.INSTRUCTIONS, path: ROUTE_ADMIN.DZO }, // temporary
    { label: labels.FILES, path: ROUTE_ADMIN.FILES },
];

const REDESIGN_PRODUCT_OWNER_SIDEBAR_MENU_ITEMS = [
    { label: labels.DASHBOARD, path: ROUTE_OWNER.DASHBOARD },
    { label: labels.DZO, path: ROUTE_OWNER.DZO },
    { label: labels.CATEGORY, path: ROUTE_OWNER.CATEGORY },
];

const REDESIGN_PRODUCT_OWNER_TOP_MENU_ITEMS = [
    { label: labels.PRESENTATION, path: ROUTE_ADMIN.DZO }, // temporary
    { label: labels.PROMO_CAMPAIGNS, path: ROUTE_OWNER.REDESIGNED_PROMO_CAMPAIGN },
    { label: labels.LANDING, path: ROUTE_OWNER.LANDING },
];

// Список доступных вкладок для приложений с кодом оканчивающимся на "-point", таких как "promo-point" и "mcdonalds-point"
const REDESIGN_PRODUCT_OWNER_SIDEBAR_FOR_POINT_APP = [
    { label: labels.DASHBOARD, path: ROUTE_OWNER.DASHBOARD },
    { label: labels.DZO, path: ROUTE_OWNER.DZO },
];

const REDESIGN_PRODUCT_OWNER_TOP_FOR_POINT_APP = [
    { label: labels.PRESENTATION, path: ROUTE_ADMIN.DZO }, // temporary
    { label: labels.PROMO_CAMPAIGNS, path: ROUTE_OWNER.REDESIGNED_PROMO_CAMPAIGN },
    { label: labels.INSTRUCTIONS, path: ROUTE_ADMIN.DZO }, // temporary
];

/**
 * @param {string} role user role
 * @param {string} appCode
 * @returns {{label: string; path: string;}[][]}
 */
export const resolveRedesignedMenuItemsByRoleAndAppCode = (role, appCode = '') => {
    if (!appCode) {
        appCode = getDefaultAppCode(); // TODO: remove getDefaultAppCode after second phase
    }

    switch (role) {
        // case ROLES.AUDITOR:
        //     return AUDITOR_MENU_ITEMS;
        case ROLES.ADMIN:
            return (appCode.endsWith('-point') && appCode !== 'greenday-point')
                ? [REDESIGN_ADMIN_SIDEBAR_MENU_FOR_POINT_APP, REDESIGN_ADMIN_TOP_MENU_FOR_POINT_APP]
                : [REDESIGN_ADMIN_SIDEBAR_MENU_ITEMS, REDESIGN_ADMIN_TOP_MENU_ITEMS];
        case ROLES.PRODUCT_OWNER:
            return (appCode.endsWith('-point') && appCode !== 'greenday-point')
                ? [REDESIGN_PRODUCT_OWNER_SIDEBAR_FOR_POINT_APP, REDESIGN_PRODUCT_OWNER_TOP_FOR_POINT_APP]
                : [REDESIGN_PRODUCT_OWNER_SIDEBAR_MENU_ITEMS, REDESIGN_PRODUCT_OWNER_TOP_MENU_ITEMS];
        case ROLES.USER_MANAGER:
            return [REDESIGN_USER_MANAGER_SIDEBAR_MENU_ITEMS, REDESIGN_USER_MANAGER_TOP_MENU_ITEMS];
        default:
            return [];
    }
};
/* REDESIGNED MENU */
