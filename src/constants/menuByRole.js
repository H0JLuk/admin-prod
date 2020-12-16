import ROLES from './roles';
import { ROUTE, ROUTE_ADMIN, ROUTE_AUDITOR, ROUTE_OWNER, ROUTE_USER_MANAGER } from './route';
import { menuItemLables as labels } from './lables';

const AUDITOR_MENU_ITEMS = [
    { label: labels.AUDIT, path: ROUTE_AUDITOR.AUDIT }
];

const USER_MANAGER_MENU_ITEMS = [
    { label: labels.USERS, path: ROUTE_USER_MANAGER.USERS }
];

const ADMIN_MENU_ITEMS = [
    { label: labels.DASHBOARD, path: ROUTE.DASHBOARD },
    { label: labels.USERS, path: ROUTE_ADMIN.USERS },
    { label: labels.FILES, path: ROUTE_ADMIN.FILES },
    { label: labels.DZO, path: ROUTE_ADMIN.DZO },
    { label: labels.LANDING, path: ROUTE_ADMIN.LANDING },
    { label: labels.CATEGORY, path: ROUTE_ADMIN.CATEGORY },
    { label: labels.PROMO_CAMPAIGNS, path: ROUTE_ADMIN.PROMO_CAMPAIGN },
];

// Список доступных вкладок для приложений с кодом оканчивающимся на "-point", таких как "promo-point" и "mcdonalds-point"
const ADMIN_MENU_FOR_POINT_APP = [
    { label: labels.DASHBOARD, path: ROUTE.DASHBOARD },
    { label: labels.USERS, path: ROUTE_ADMIN.USERS },
    { label: labels.FILES, path: ROUTE_ADMIN.FILES },
    { label: labels.DZO, path: ROUTE_ADMIN.DZO },
    { label: labels.PROMO_CAMPAIGNS, path: ROUTE_ADMIN.PROMO_CAMPAIGN },
];

const PRODUCT_OWNER_MENU_ITEMS = [
    { label: labels.DASHBOARD, path: ROUTE.DASHBOARD },
    { label: labels.DZO, path: ROUTE_OWNER.DZO },
    { label: labels.LANDING, path: ROUTE_OWNER.LANDING },
    { label: labels.CATEGORY, path: ROUTE_OWNER.CATEGORY },
    { label: labels.PROMO_CAMPAIGNS, path: ROUTE_OWNER.PROMO_CAMPAIGN },
];

// Список доступных вкладок для приложений с кодом оканчивающимся на "-point", таких как "promo-point" и "mcdonalds-point"
const PRODUCT_OWNER_MENU_FOR_POINT_APP = [
    { label: labels.DASHBOARD, path: ROUTE.DASHBOARD },
    { label: labels.DZO, path: ROUTE_OWNER.DZO },
    { label: labels.PROMO_CAMPAIGNS, path: ROUTE_OWNER.PROMO_CAMPAIGN },
];

export const resolveMenuItemsByRoleAndAppCode = (role, appCode) => {
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
