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

export const goToClientApps = (history, redirect) => {
    (redirect ? history.replace : history.push)(ROUTE.CLIENT_APPS);
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

export function goToStartPage(history, redirect, role = getRole()) {
    switch (role) {
        case ROLES.ADMIN: {
            const url = ROUTE_ADMIN.DASHBOARD;
            (redirect ? history.replace : history.push)(url);
            return;
        }
        case ROLES.PRODUCT_OWNER: {
            const url = ROUTE_OWNER.DASHBOARD;
            (redirect ? history.replace : history.push)(url);
            return;
        }
        case ROLES.AUDITOR: {
            goToAudit(history, redirect);
            return;
        }
        case ROLES.USER_MANAGER: {
            goToUserManager(history, redirect);
            return;
        }
        case null:
        case '': {
            goToLogin(history);
            return;
        }
        default:
            goToClientApps(history, redirect);
    }
}

export const goToAudit = (history, redirect) => {
    (redirect ? history.replace : history.push)(ROUTE.AUDITOR);
};

export const goToAdmin = (history, oldDesign) => {
    if (oldDesign) {
        history.push(`${ROUTE.OLD_DESIGN}${ROUTE.ADMIN}`);
        return;
    }
    history.push(ROUTE_ADMIN.PROMO_CAMPAIGN);
};

export const goToUserManager = (history, redirect) => {
    (redirect ? history.replace : history.push)(ROUTE_USER_MANAGER.USERS);
};

export const goToProduct = (history, oldDesign) => {
    if (oldDesign) {
        history.push(`${ROUTE.OLD_DESIGN}${ROUTE.OWNER}`);
        return;
    }
    history.push(ROUTE_OWNER.PROMO_CAMPAIGN);
};

export const goApp = (history, role, oldDesign) => {
    switch (role) {
        case ROLES.AUDITOR:
            goToAudit(history);
            break;
        case ROLES.ADMIN:
            goToAdmin(history, oldDesign);
            break;
        case ROLES.USER_MANAGER:
            goToUserManager(history);
            break;
        case ROLES.PRODUCT_OWNER:
        default:
            goToProduct(history, oldDesign);
    }
};

// TODO: remove after delete old user page
export function getLinkForUsersPage() {
    switch (getRole()) {
        case ROLES.ADMIN:
            return ROUTE_ADMIN.USERS;
        case ROLES.PRODUCT_OWNER:
            return ROUTE_OWNER.USERS;
        case ROLES.USER_MANAGER:
            return ROUTE_USER_MANAGER.USERS;
        default:
            return '';
    }
}

export function getLinkForCreatePromoCampaign() {
    switch (getRole()) {
        case ROLES.ADMIN:
            return `${ ROUTE_ADMIN.PROMO_CAMPAIGN }${ PROMO_CAMPAIGN_PAGES.ADD_PROMO_CAMPAIGN }`;
        case ROLES.PRODUCT_OWNER:
            return `${ ROUTE_OWNER.PROMO_CAMPAIGN }${ PROMO_CAMPAIGN_PAGES.ADD_PROMO_CAMPAIGN }`;
        default:
            return '';
    }
}

export function getPathForCopyPromoCampaign() {
    switch (getRole()) {
        case ROLES.ADMIN:
            return `${ ROUTE_ADMIN.PROMO_CAMPAIGN }${ PROMO_CAMPAIGN_PAGES.PROMO_CAMPAIGN_COPY }`;
        case ROLES.PRODUCT_OWNER:
            return `${ ROUTE_OWNER.PROMO_CAMPAIGN }${ PROMO_CAMPAIGN_PAGES.PROMO_CAMPAIGN_COPY }`;
        default:
            return '';
    }
}

export function getPathForPromoCampaignInfo() {
    switch (getRole()) {
        case ROLES.ADMIN:
            return `${ ROUTE_ADMIN.PROMO_CAMPAIGN }${ PROMO_CAMPAIGN_PAGES.PROMO_CAMPAIGN_INFO }`;
        case ROLES.PRODUCT_OWNER:
            return `${ ROUTE_OWNER.PROMO_CAMPAIGN }${ PROMO_CAMPAIGN_PAGES.PROMO_CAMPAIGN_INFO }`;
        default:
            return '';
    }
}

export function getPathForCreatePromoCampaignVisibititySetting() {
    switch (getRole()) {
        case ROLES.ADMIN:
            return `${ ROUTE_ADMIN.PROMO_CAMPAIGN }${ PROMO_CAMPAIGN_PAGES.VISIBILITY_SETTINGS }/create`;
        case ROLES.PRODUCT_OWNER:
            return `${ ROUTE_OWNER.PROMO_CAMPAIGN }${ PROMO_CAMPAIGN_PAGES.VISIBILITY_SETTINGS }/create`;
        default:
            return '';
    }
}

export function getPathForPromoCampaignVisibititySettings() {
    switch (getRole()) {
        case ROLES.ADMIN:
            return `${ ROUTE_ADMIN.PROMO_CAMPAIGN }${ PROMO_CAMPAIGN_PAGES.VISIBILITY_SETTINGS }`;
        case ROLES.PRODUCT_OWNER:
            return `${ ROUTE_OWNER.PROMO_CAMPAIGN }${ PROMO_CAMPAIGN_PAGES.VISIBILITY_SETTINGS }`;
        default:
            return '';
    }
}

// TODO: remove after delete old promo-campaign page
export function getLinkForPromoCampaignPage() {
    switch (getRole()) {
        case ROLES.ADMIN:
            return ROUTE_ADMIN.PROMO_CAMPAIGN;
        case ROLES.PRODUCT_OWNER:
            return ROUTE_OWNER.PROMO_CAMPAIGN;
        default:
            return '';
    }
}
