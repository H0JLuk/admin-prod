import { ROUTE } from '../constants/route';
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

export const goToAudit = (history) => {
    history.push(ROUTE.AUDITOR);
};

export const goToAdmin = (history) => {
    history.push(ROUTE.ADMIN);
};

export const goToProduct= (history) => {
    history.push(ROUTE.PRODUCT);
};

export const goApp = (history, role) => {
    switch (role) {
        case ROLES.AUDITOR:
            goToAudit(history);
            break;
        case ROLES.ADMIN:
            goToAdmin(history);
            break;
        case ROLES.PRODUCT_OWNER:
        default:
            goToProduct(history);
    }
};

export const goBack = (history) => {
    history.goBack();
};
