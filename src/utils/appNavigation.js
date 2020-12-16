import { getRole } from '../api/services/sessionService';
import { ROUTE, ROUTE_ADMIN, ROUTE_OWNER } from '../constants/route';
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

export const goToDashboard = (history) => {
    history.push(ROUTE.DASHBOARD);
};

export const goToAudit = (history) => {
    history.push(ROUTE.AUDITOR);
};

export const goToAdmin = (history) => {
    history.push(ROUTE.ADMIN);
};

export const goToUserManager = (history) => {
    history.push(ROUTE.USER_MANAGER);
};

export const goToProduct= (history) => {
    history.push(ROUTE.OWNER);
};

export const goApp = (history, role) => {
    switch (role) {
        case ROLES.AUDITOR:
            goToAudit(history);
            break;
        case ROLES.ADMIN:
            goToAdmin(history);
            break;
        case ROLES.USER_MANAGER:
            goToUserManager(history);
            break;
        case ROLES.PRODUCT_OWNER:
        default:
            goToProduct(history);
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
