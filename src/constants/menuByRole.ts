import ROLES from './roles';
import {
    BUSINESS_ROLE_PAGES,
    ROUTE_ADMIN,
    ROUTE_OWNER,
    ROUTE_PARTNER,
    ROUTE_USER_MANAGER,
    SALE_POINT_PAGES,
    LOCATIONS_PAGES,
    LOCATIONS_TYPES_PAGES,
    SALE_POINT_TYPES_PAGES,
} from './route';
import { menuItemLabels as labels } from './labels';
import { getDefaultAppCode } from '@apiServices/clientAppService';

type MenuItem = {
    label: string;
    path: string;
};

const USER_MANAGER_SIDEBAR_MENU_ITEMS: MenuItem[] = [
    { label: labels.USERS, path: ROUTE_USER_MANAGER.USERS },
];

const USER_MANAGER_TOP_MENU_ITEMS: MenuItem[] = [
];

const PARTNER_SIDEBAR_MENU_ITEMS: MenuItem[] = [
    { label: labels.USERS, path: ROUTE_PARTNER.USERS },
    { label: labels.APP, path: ROUTE_PARTNER.APPS },
    { label: labels.REPORTS, path: ROUTE_PARTNER.REPORTS },
];

const PARTNER_TOP_MENU_ITEMS: MenuItem[] = [
];

const ADMIN_SIDEBAR_MENU_ITEMS: MenuItem[] = [
    { label: labels.DASHBOARD, path: ROUTE_ADMIN.DASHBOARD },
    { label: labels.USERS, path: ROUTE_ADMIN.USERS },
    { label: labels.DZO, path: ROUTE_ADMIN.DZO },
    { label: labels.REFERENCE_BOOKS, path: ROUTE_ADMIN.REFERENCE_BOOKS },
    { label: labels.CATEGORY, path: ROUTE_ADMIN.CATEGORY },
    { label: labels.CONSENTS, path: ROUTE_ADMIN.CONSENTS },
    { label: labels.APP, path: ROUTE_ADMIN.APPS },
];

const ADMIN_TOP_MENU_ITEMS: MenuItem[] = [
    { label: labels.PROMO_CAMPAIGNS, path: ROUTE_ADMIN.PROMO_CAMPAIGN },
    { label: labels.SETTINGS, path: ROUTE_ADMIN.APP_SETTINGS },
    { label: labels.PRESENTATION, path: ROUTE_ADMIN.PRESENTATION },
    { label: labels.GROUPS, path: ROUTE_ADMIN.GROUPS },
    { label: labels.REPORTS, path: ROUTE_ADMIN.REPORTS },
];

const ADMIN_REFERENCE_BOOKS_MENU_ITEMS = [
    { label: labels.SALE_POINT, path: `${ROUTE_ADMIN.REFERENCE_BOOKS}${SALE_POINT_PAGES.LIST}` },
    { label: labels.LOCATION, path: `${ROUTE_ADMIN.REFERENCE_BOOKS}${LOCATIONS_PAGES.LIST}` },
    { label: labels.SALE_POINT_TYPE, path: `${ROUTE_ADMIN.REFERENCE_BOOKS}${SALE_POINT_TYPES_PAGES.LIST}` },
    { label: labels.LOCATION_TYPE, path: `${ROUTE_ADMIN.REFERENCE_BOOKS}${LOCATIONS_TYPES_PAGES.LIST}` },
    { label: labels.BUSINESS_ROLE, path: `${ROUTE_ADMIN.REFERENCE_BOOKS}${BUSINESS_ROLE_PAGES.LIST}` },
];

// ???????????? ?????????????????? ?????????????? ?????? ???????????????????? ?? ?????????? ???????????????????????????? ???? "-point", ?????????? ?????? "promo-point" ?? "mcdonalds-point"
/* const ADMIN_SIDEBAR_MENU_FOR_POINT_APP: MenuItem[] = [
    { label: labels.DASHBOARD, path: ROUTE_ADMIN.DASHBOARD },
    { label: labels.USERS, path: ROUTE_ADMIN.USERS },
    { label: labels.DZO, path: ROUTE_ADMIN.DZO },
    { label: labels.REFERENCE_BOOKS, path: ROUTE_ADMIN.REFERENCE_BOOKS },
    { label: labels.CONSENTS, path: ROUTE_ADMIN.CONSENTS },
    { label: labels.APP, path: ROUTE_ADMIN.APPS },
];

const ADMIN_TOP_MENU_FOR_POINT_APP: MenuItem[] = [
    { label: labels.PROMO_CAMPAIGNS, path: ROUTE_ADMIN.PROMO_CAMPAIGN },
    { label: labels.SETTINGS, path: ROUTE_ADMIN.APP_SETTINGS },
    { label: labels.GROUPS, path: ROUTE_ADMIN.GROUPS },
    { label: labels.REPORTS, path: ROUTE_ADMIN.REPORTS },
]; */

const PRODUCT_OWNER_SIDEBAR_MENU_ITEMS: MenuItem[] = [
    { label: labels.DASHBOARD, path: ROUTE_OWNER.DASHBOARD },
    { label: labels.DZO, path: ROUTE_OWNER.DZO },
    { label: labels.CATEGORY, path: ROUTE_OWNER.CATEGORY },
    { label: labels.APP, path: ROUTE_OWNER.APPS },
];

const PRODUCT_OWNER_TOP_MENU_ITEMS: MenuItem[] = [
    { label: labels.PROMO_CAMPAIGNS, path: ROUTE_OWNER.PROMO_CAMPAIGN },
    { label: labels.GROUPS, path: ROUTE_OWNER.GROUPS },
    { label: labels.PRESENTATION, path: ROUTE_OWNER.PRESENTATION },
    { label: labels.REPORTS, path: ROUTE_OWNER.REPORTS },
];

// TODO: ???????????? ?????????? ???? ?????????????????? ?????????????????????? ?????????????????????? ?????? ???????????? ?? "-point" ???? ??????????...
// ???????????? ?????????????????? ?????????????? ?????? ???????????????????? ?? ?????????? ???????????????????????????? ???? "-point", ?????????? ?????? "promo-point" ?? "mcdonalds-point"
/* const PRODUCT_OWNER_SIDEBAR_FOR_POINT_APP: MenuItem[] = [
    { label: labels.DASHBOARD, path: ROUTE_OWNER.DASHBOARD },
    { label: labels.DZO, path: ROUTE_OWNER.DZO },
    { label: labels.APP, path: ROUTE_OWNER.APPS },
];

const PRODUCT_OWNER_TOP_FOR_POINT_APP: MenuItem[] = [
    { label: labels.PROMO_CAMPAIGNS, path: ROUTE_OWNER.PROMO_CAMPAIGN },
    { label: labels.GROUPS, path: ROUTE_OWNER.GROUPS },
    { label: labels.REPORTS, path: ROUTE_OWNER.REPORTS },
]; */

export const resolveMenuItemsByRoleAndAppCode = (role: ROLES, appCode = '', isReferenceBookPage?: boolean) => {
    if (!appCode) {
        appCode = getDefaultAppCode(); // TODO: remove getDefaultAppCode after second phase
    }

    switch (role) {
        // case ROLES.AUDITOR:
        //     return AUDITOR_MENU_ITEMS;
        case ROLES.ADMIN:
            return [
                ADMIN_SIDEBAR_MENU_ITEMS,
                isReferenceBookPage ? ADMIN_REFERENCE_BOOKS_MENU_ITEMS : ADMIN_TOP_MENU_ITEMS,
            ];
        case ROLES.PRODUCT_OWNER:
            return [
                PRODUCT_OWNER_SIDEBAR_MENU_ITEMS,
                isReferenceBookPage ? [] : PRODUCT_OWNER_TOP_MENU_ITEMS,
            ];
        case ROLES.USER_MANAGER:
            return [USER_MANAGER_SIDEBAR_MENU_ITEMS, isReferenceBookPage ? [] : USER_MANAGER_TOP_MENU_ITEMS];
        case ROLES.PARTNER:
            return [PARTNER_SIDEBAR_MENU_ITEMS, isReferenceBookPage ? [] : PARTNER_TOP_MENU_ITEMS];
        default:
            return [[], []];
    }
};
