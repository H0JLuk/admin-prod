export const ROUTE = {
    CORE:           '/',
    APP:            '/app',
    LOGIN:          '/login',
    AUDITOR:        '/auditor',
    ADMIN:          '/admin',
    OWNER:          '/owner',
    CLIENT_APPS:    '/client-apps'
};

const PAGE = {
    AUDIT:          'audit',
    CATEGORY:       'category',
    DZO:            'dzo',
    FILES:          'files',
    LANDING:        'landing',
    PROMO_CAMPAIGN: 'promo-campaign',
    SLIDER:         'slider',
    USERS:          'users'
};

export const ROUTE_AUDITOR = {
    AUDIT:          `${ ROUTE.AUDITOR }/${ PAGE.AUDIT }`
};

export const ROUTE_ADMIN = {
    USERS:          `${ ROUTE.ADMIN }/${ PAGE.USERS }`,
    FILES:          `${ ROUTE.ADMIN }/${ PAGE.FILES }`,
    DZO:            `${ ROUTE.ADMIN }/${ PAGE.DZO }`,
    LANDING:        `${ ROUTE.ADMIN }/${ PAGE.LANDING }`,
    CATEGORY:       `${ ROUTE.ADMIN }/${ PAGE.CATEGORY }`,
    SLIDER:         `${ ROUTE.ADMIN }/${ PAGE.SLIDER }`,
    PROMO_CAMPAIGN: `${ ROUTE.ADMIN }/${ PAGE.PROMO_CAMPAIGN }`
};

export const ROUTE_OWNER = {
    DZO:            `${ ROUTE.OWNER }/${ PAGE.DZO }`,
    LANDING:        `${ ROUTE.OWNER }/${ PAGE.LANDING }`,
    CATEGORY:       `${ ROUTE.OWNER }/${ PAGE.CATEGORY }`,
    SLIDER:         `${ ROUTE.OWNER }/${ PAGE.SLIDER }`,
    PROMO_CAMPAIGN: `${ ROUTE.OWNER }/${ PAGE.PROMO_CAMPAIGN }`,
};