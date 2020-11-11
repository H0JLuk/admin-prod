import ROLES from './roles';
import { ROUTE_ADMIN, ROUTE_AUDITOR, ROUTE_OWNER } from './route';
import { menuItemLables as labels } from './lables';

const AUDITOR_MENU_ITEMS = [
    { label: labels.AUDIT, path: ROUTE_AUDITOR.AUDIT }
];

const ADMIN_MENU_ITEMS = [
    { label: labels.USERS, path: ROUTE_ADMIN.USERS },
    { label: labels.FILES, path: ROUTE_ADMIN.FILES },
    { label: labels.DZO, path: ROUTE_ADMIN.DZO },
    { label: labels.LANDING, path: ROUTE_ADMIN.LANDING },
    { label: labels.CATEGORY, path: ROUTE_ADMIN.CATEGORY },
    { label: labels.PROMO_CAMPAIGNS, path: ROUTE_ADMIN.PROMO_CAMPAIGN }
];

// Список доступных вкладок для приложений с кодом оканчивающимся на "-point", таких как "promo-point" и "mcdonalds-point"
const ADMIN_MENU_FOR_POINT_APP = [
    { label: labels.USERS, path: ROUTE_ADMIN.USERS },
    { label: labels.FILES, path: ROUTE_ADMIN.FILES },
    { label: labels.DZO, path: ROUTE_ADMIN.DZO },
    { label: labels.PROMO_CAMPAIGNS, path: ROUTE_ADMIN.PROMO_CAMPAIGN }
];

const PRODUCT_OWNER_MENU_ITEMS = [
    { label: labels.DZO, path: ROUTE_OWNER.DZO },
    { label: labels.LANDING, path: ROUTE_OWNER.LANDING },
    { label: labels.CATEGORY, path: ROUTE_OWNER.CATEGORY },
    { label: labels.PROMO_CAMPAIGNS, path: ROUTE_OWNER.PROMO_CAMPAIGN }
];

// Список доступных вкладок для приложений с кодом оканчивающимся на "-point", таких как "promo-point" и "mcdonalds-point"
const PRODUCT_OWNER_MENU_FOR_POINT_APP = [
    { label: labels.DZO, path: ROUTE_OWNER.DZO },
    { label: labels.PROMO_CAMPAIGNS, path: ROUTE_OWNER.PROMO_CAMPAIGN }
];

export const resolveMenuItemsByRoleAndAppCode = (role, appCode) => {
    switch (role) {
        case ROLES.AUDITOR: return AUDITOR_MENU_ITEMS;
        case ROLES.ADMIN: if (appCode.endsWith('-point') && appCode !== 'greenday-point') {
            return ADMIN_MENU_FOR_POINT_APP;
        }
            return ADMIN_MENU_ITEMS;
        case ROLES.PRODUCT_OWNER: if (appCode.endsWith('-point') && appCode !== 'greenday-point') {
            return PRODUCT_OWNER_MENU_FOR_POINT_APP;
        }
            return PRODUCT_OWNER_MENU_ITEMS;
        default: return [];
    }
};
