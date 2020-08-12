import ROLES from './roles';
import { ROUTE_ADMIN, ROUTE_AUDITOR, ROUTE_PRODUCT } from './route';
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
    { label: labels.SLIDER, path: ROUTE_ADMIN.SLIDER },
    { label: labels.PROMO_CAMPAIGNS, path: ROUTE_ADMIN.PROMO_CAMPAIGN }
];

const PRODUCT_OWNER_MENU_ITEMS = [
    { label: labels.DZO, path: ROUTE_PRODUCT.DZO },
    { label: labels.LANDING, path: ROUTE_PRODUCT.LANDING },
    { label: labels.CATEGORY, path: ROUTE_PRODUCT.CATEGORY },
    { label: labels.SLIDER, path: ROUTE_PRODUCT.SLIDER },
    { label: labels.PROMO_CAMPAIGNS, path: ROUTE_PRODUCT.PROMO_CAMPAIGN }
];

export const resolveMenuItemsByRole = (role) => {
    switch (role) {
        case ROLES.AUDITOR: return AUDITOR_MENU_ITEMS;
        case ROLES.ADMIN: return ADMIN_MENU_ITEMS;
        case ROLES.PRODUCT_OWNER: return PRODUCT_OWNER_MENU_ITEMS;
        default: return [];
    }
};
