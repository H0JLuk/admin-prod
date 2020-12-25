import { getRole } from '../api/services/sessionService';
import { PROMO_CAMPAIGN_PAGES, ROUTE, ROUTE_ADMIN, ROUTE_OWNER, ROUTE_USER_MANAGER } from '../constants/route';
import ROLES from '../constants/roles';

export const goToLogin = (history) => {
    if (history) {
        history.push(ROUTE.LOGIN);
        return;
    }
    window.location.href = ROUTE.LOGIN;
};

export const goToClientApps = (history) => {
    history.push(ROUTE.CLIENT_APPS);
};

export const goToDashboard = (history, role) => {
    switch (role) {
        case ROLES.ADMIN:
            history.push(ROUTE_ADMIN.DASHBOARD);
            break;
        case ROLES.PRODUCT_OWNER:
            history.push(ROUTE_OWNER.DASHBOARD);
            break;
        default:
            goToClientApps(history);
    }
};

export const goToAudit = (history) => {
    history.push(ROUTE.AUDITOR);
};

export const goToAdmin = (history, toRedesign) => {
    if (toRedesign) {
        history.push(ROUTE_ADMIN.REDESIGNED_PROMO_CAMPAIGN);
        return;
    }
    history.push(ROUTE.ADMIN);
};

export const goToUserManager = (history) => {
    history.push(ROUTE.USER_MANAGER);
};

export const goToProduct = (history, toRedesign) => {
    if (toRedesign) {
        history.push(ROUTE_OWNER.REDESIGNED_PROMO_CAMPAIGN);
        return;
    }
    history.push(ROUTE.OWNER);
};

export const goApp = (history, role, toRedesign) => {
    switch (role) {
        case ROLES.AUDITOR:
            goToAudit(history);
            break;
        case ROLES.ADMIN:
            goToAdmin(history, toRedesign);
            break;
        case ROLES.USER_MANAGER:
            goToUserManager(history);
            break;
        case ROLES.PRODUCT_OWNER:
        default:
            goToProduct(history, toRedesign);
    }
};

export const goPromoCampaigns = (history) => {
    switch (getRole()) {
        case ROLES.ADMIN:
            history.push(ROUTE_ADMIN.PROMO_CAMPAIGN);
            break;
        case ROLES.PRODUCT_OWNER:
            history.push(ROUTE_OWNER.PROMO_CAMPAIGN);
            break;
        default:
            return null;
    }
};

export const goBack = (history) => {
    history.goBack();
};

// TODO: remove after delete old user page
export function getLinkForRedesignUsers() {
    switch (getRole()) {
        case ROLES.ADMIN:
            return ROUTE_ADMIN.REDESIGNED_USERS;
        case ROLES.PRODUCT_OWNER:
            return ROUTE_OWNER.REDESIGNED_USERS;
        case ROLES.USER_MANAGER:
            return ROUTE_USER_MANAGER.REDESIGNED_USERS;
        default:
            return '';
    }
}

export function getLinkForCreatePromoCampaign() {
    switch (getRole()) {
        case ROLES.ADMIN:
            return `${ ROUTE_ADMIN.REDESIGNED_PROMO_CAMPAIGN }${ PROMO_CAMPAIGN_PAGES.ADD_PROMO_CAMPAIGN }`;
        case ROLES.PRODUCT_OWNER:
            return `${ ROUTE_OWNER.REDESIGNED_PROMO_CAMPAIGN }${ PROMO_CAMPAIGN_PAGES.ADD_PROMO_CAMPAIGN }`;
        default:
            return '';
    }
}

export function getPathForCreatePromoCampaignVisibititySetting() {
    switch (getRole()) {
        case ROLES.ADMIN:
            return `${ ROUTE_ADMIN.REDESIGNED_PROMO_CAMPAIGN }${ PROMO_CAMPAIGN_PAGES.VISIBILITY_SETTINGS }/create`;
        case ROLES.PRODUCT_OWNER:
            return `${ ROUTE_OWNER.REDESIGNED_PROMO_CAMPAIGN }${ PROMO_CAMPAIGN_PAGES.VISIBILITY_SETTINGS }/create`;
        default:
            return '';
    }
}

// TODO: remove after delete old promo-campaign page
export function getLinkForRedesignPromoCampaign() {
    switch (getRole()) {
        case ROLES.ADMIN:
            return ROUTE_ADMIN.REDESIGNED_PROMO_CAMPAIGN;
        case ROLES.PRODUCT_OWNER:
            return ROUTE_OWNER.REDESIGNED_PROMO_CAMPAIGN;
        default:
            return '';
    }
}
