export const ROUTE = {
    CORE:       '/',
    APP:        '/app',
    LOGIN:      '/login',
    AUDITOR:    '/auditor',
    ADMIN:      '/admin',
    PRODUCT:    '/product',
    CLIENT_APPS: '/clientApps'
};

export const ROUTE_AUDITOR = {
    AUDIT:      `${ ROUTE.AUDITOR }/audit`
};

export const ROUTE_ADMIN = {
    USERS:          `${ ROUTE.ADMIN }/users`,
    FILES:          `${ ROUTE.ADMIN }/files`,
    DZO:            `${ ROUTE.ADMIN }/dzo`,
    LANDING:        `${ ROUTE.ADMIN }/landing`,
    CATEGORY:       `${ ROUTE.ADMIN }/category`,
    SLIDER:         `${ ROUTE.ADMIN }/slider`,
    PROMO_CAMPAIGN: `${ ROUTE.ADMIN }/promoCampaign`
};

export const ROUTE_PRODUCT = {
    DZO:            `${ ROUTE.PRODUCT }/dzo`,
    LANDING:        `${ ROUTE.PRODUCT }/landing`,
    CATEGORY:       `${ ROUTE.PRODUCT }/category`,
    SLIDER:         `${ ROUTE.PRODUCT }/slider`,
    PROMO_CAMPAIGN: `${ ROUTE.PRODUCT }/promoCampaign`,
};