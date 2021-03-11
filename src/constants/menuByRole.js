import ROLES from './roles';
import { ROUTE_ADMIN, ROUTE_AUDITOR, ROUTE_OWNER, ROUTE_USER_MANAGER } from './route';
import { menuItemLabels as labels } from './labels';
import { getDefaultAppCode } from '../api/services/clientAppService';

/* OLD DESIGN MENU */
const AUDITOR_MENU_ITEMS = [
    { label: labels.AUDIT, path: ROUTE_AUDITOR.AUDIT },
];

const USER_MANAGER_MENU_ITEMS = [
    { label: labels.USERS, path: ROUTE_USER_MANAGER.USERS },
];

const OLD_ADMIN_MENU_ITEMS = [
    { label: labels.DASHBOARD, path: ROUTE_ADMIN.DASHBOARD },
    { label: labels.USERS, path: ROUTE_ADMIN.OLD_DESIGN_USERS },
    { label: labels.FILES, path: ROUTE_ADMIN.FILES },
    { label: labels.DZO, path: ROUTE_ADMIN.DZO },
    { label: labels.PRESENTATION, path: ROUTE_ADMIN.PRESENTATION },
    { label: labels.CATEGORY, path: ROUTE_ADMIN.CATEGORY },
    { label: labels.PROMO_CAMPAIGNS, path: ROUTE_ADMIN.OLD_DESIGN_PROMO_CAMPAIGN },
];

// Список доступных вкладок для приложений с кодом оканчивающимся на "-point", таких как "promo-point" и "mcdonalds-point"
const OLD_ADMIN_MENU_FOR_POINT_APP = [
    { label: labels.DASHBOARD, path: ROUTE_ADMIN.DASHBOARD },
    { label: labels.USERS, path: ROUTE_ADMIN.OLD_DESIGN_USERS },
    { label: labels.FILES, path: ROUTE_ADMIN.FILES },
    { label: labels.DZO, path: ROUTE_ADMIN.DZO },
    { label: labels.PROMO_CAMPAIGNS, path: ROUTE_ADMIN.OLD_DESIGN_PROMO_CAMPAIGN },
];

const OLD_PRODUCT_OWNER_MENU_ITEMS = [
    { label: labels.DASHBOARD, path: ROUTE_OWNER.DASHBOARD },
    { label: labels.FILES, path: ROUTE_OWNER.FILES },
    { label: labels.DZO, path: ROUTE_OWNER.DZO },
    { label: labels.PRESENTATION, path: ROUTE_OWNER.PRESENTATION },
    { label: labels.CATEGORY, path: ROUTE_OWNER.CATEGORY },
    { label: labels.PROMO_CAMPAIGNS, path: ROUTE_OWNER.OLD_DESIGN_PROMO_CAMPAIGN },
];

// Список доступных вкладок для приложений с кодом оканчивающимся на "-point", таких как "promo-point" и "mcdonalds-point"
const OLD_PRODUCT_OWNER_MENU_FOR_POINT_APP = [
    { label: labels.DASHBOARD, path: ROUTE_OWNER.DASHBOARD },
    { label: labels.FILES, path: ROUTE_OWNER.FILES },
    { label: labels.DZO, path: ROUTE_OWNER.DZO },
    { label: labels.PROMO_CAMPAIGNS, path: ROUTE_OWNER.OLD_DESIGN_PROMO_CAMPAIGN },
];

export const resolveOldMenuItemsByRoleAndAppCode = (role, appCode) => {
    if (!appCode) {
        appCode = getDefaultAppCode(); // TODO: remove getDefaultAppCode after second phase
    }

    switch (role) {
        case ROLES.AUDITOR:
            return AUDITOR_MENU_ITEMS;
        case ROLES.ADMIN:
            return (appCode.endsWith('-point') && appCode !== 'greenday-point')
                ? OLD_ADMIN_MENU_FOR_POINT_APP
                : OLD_ADMIN_MENU_ITEMS;
        case ROLES.PRODUCT_OWNER:
            return (appCode.endsWith('-point') && appCode !== 'greenday-point')
                ? OLD_PRODUCT_OWNER_MENU_FOR_POINT_APP
                : OLD_PRODUCT_OWNER_MENU_ITEMS;
        case ROLES.USER_MANAGER:
            return USER_MANAGER_MENU_ITEMS;
        default: return [];
    }
};
/* OLD DESIGN MENU */

const USER_MANAGER_SIDEBAR_MENU_ITEMS = [
    { label: labels.USERS, path: ROUTE_USER_MANAGER.USERS },
];

const USER_MANAGER_TOP_MENU_ITEMS = [
];

const ADMIN_SIDEBAR_MENU_ITEMS = [
    { label: labels.DASHBOARD, path: ROUTE_ADMIN.DASHBOARD },
    { label: labels.USERS, path: ROUTE_ADMIN.USERS },
    { label: labels.DZO, path: ROUTE_ADMIN.DZO },
    { label: labels.CATEGORY, path: ROUTE_ADMIN.CATEGORY },
    { label: labels.APP, path: ROUTE_ADMIN.APPS }
];

const ADMIN_TOP_MENU_ITEMS = [
    { label: labels.PROMO_CAMPAIGNS, path: ROUTE_ADMIN.PROMO_CAMPAIGN },
    { label: labels.SETTINGS, path: ROUTE_ADMIN.APP_SETTINGS },
    { label: labels.PRESENTATION, path: ROUTE_ADMIN.PRESENTATION },
    { label: labels.GROUPS, path: ROUTE_ADMIN.GROUPS },
    { label: labels.FILES, path: ROUTE_ADMIN.FILES },
];

// Список доступных вкладок для приложений с кодом оканчивающимся на "-point", таких как "promo-point" и "mcdonalds-point"
const ADMIN_SIDEBAR_MENU_FOR_POINT_APP = [
    { label: labels.DASHBOARD, path: ROUTE_ADMIN.DASHBOARD },
    { label: labels.USERS, path: ROUTE_ADMIN.USERS },
    { label: labels.DZO, path: ROUTE_ADMIN.DZO },
    { label: labels.APP, path: ROUTE_ADMIN.APPS },
];

const ADMIN_TOP_MENU_FOR_POINT_APP = [
    { label: labels.PROMO_CAMPAIGNS, path: ROUTE_ADMIN.PROMO_CAMPAIGN },
    { label: labels.SETTINGS, path: ROUTE_ADMIN.APP_SETTINGS },
    { label: labels.GROUPS, path: ROUTE_ADMIN.GROUPS },
    { label: labels.FILES, path: ROUTE_ADMIN.FILES },
];

const PRODUCT_OWNER_SIDEBAR_MENU_ITEMS = [
    { label: labels.DASHBOARD, path: ROUTE_OWNER.DASHBOARD },
    { label: labels.DZO, path: ROUTE_OWNER.DZO },
    { label: labels.CATEGORY, path: ROUTE_OWNER.CATEGORY },
    { label: labels.APP, path: ROUTE_OWNER.APPS }
];

const PRODUCT_OWNER_TOP_MENU_ITEMS = [
    { label: labels.PROMO_CAMPAIGNS, path: ROUTE_OWNER.PROMO_CAMPAIGN },
    { label: labels.GROUPS, path: ROUTE_OWNER.GROUPS },
    { label: labels.PRESENTATION, path: ROUTE_OWNER.PRESENTATION },
    { label: labels.FILES, path: ROUTE_OWNER.FILES },
];

// Список доступных вкладок для приложений с кодом оканчивающимся на "-point", таких как "promo-point" и "mcdonalds-point"
const PRODUCT_OWNER_SIDEBAR_FOR_POINT_APP = [
    { label: labels.DASHBOARD, path: ROUTE_OWNER.DASHBOARD },
    { label: labels.DZO, path: ROUTE_OWNER.DZO },
    { label: labels.APP, path: ROUTE_OWNER.APPS },
];

const PRODUCT_OWNER_TOP_FOR_POINT_APP = [
    { label: labels.PROMO_CAMPAIGNS, path: ROUTE_OWNER.PROMO_CAMPAIGN },
    { label: labels.GROUPS, path: ROUTE_OWNER.GROUPS },
    { label: labels.FILES, path: ROUTE_OWNER.FILES },
];

/**
 * @param {string} role user role
 * @param {string} appCode
 * @returns {{label: string; path: string;}[][]}
 */
export const resolveMenuItemsByRoleAndAppCode = (role, appCode = '') => {
    if (!appCode) {
        appCode = getDefaultAppCode(); // TODO: remove getDefaultAppCode after second phase
    }

    switch (role) {
        // case ROLES.AUDITOR:
        //     return AUDITOR_MENU_ITEMS;
        case ROLES.ADMIN:
            return (appCode.endsWith('-point') && appCode !== 'greenday-point')
                ? [ADMIN_SIDEBAR_MENU_FOR_POINT_APP, ADMIN_TOP_MENU_FOR_POINT_APP]
                : [ADMIN_SIDEBAR_MENU_ITEMS, ADMIN_TOP_MENU_ITEMS];
        case ROLES.PRODUCT_OWNER:
            return (appCode.endsWith('-point') && appCode !== 'greenday-point')
                ? [PRODUCT_OWNER_SIDEBAR_FOR_POINT_APP, PRODUCT_OWNER_TOP_FOR_POINT_APP]
                : [PRODUCT_OWNER_SIDEBAR_MENU_ITEMS, PRODUCT_OWNER_TOP_MENU_ITEMS];
        case ROLES.USER_MANAGER:
            return [USER_MANAGER_SIDEBAR_MENU_ITEMS, USER_MANAGER_TOP_MENU_ITEMS];
        default:
            return [[], []];
    }
};
