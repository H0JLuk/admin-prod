export const ROUTE = {
    CORE:           '/',
    APP:            '/app',
    LOGIN:          '/login',
    AUDITOR:        '/auditor',
    ADMIN:          '/admin',
    OWNER:          '/owner',
    USER_MANAGER:   '/user-manager',
    CLIENT_APPS:    '/client-apps',
    REDESIGNED:     '/redesigned',
};

const PAGE = {
    AUDIT:          'audit',
    CATEGORY:       'category',
    DZO:            'dzo',
    DASHBOARD:      'dashboard',
    FILES:          'files',
    LANDING:        'landing',
    PROMO_CAMPAIGN: 'promo-campaign',
    SLIDER:         'slider',
    USERS:          'users',
    APPS:           'apps',
};

export const USERS_PAGES = {
    ADD_USER:        '/create',
    USER_INFO:       '/:userId',
    EDIT_USER:       '/:userId/edit',
    EDIT_SOME_USERS: '/multiple_edit',
};

export const PROMO_CAMPAIGN_PAGES = {
    ADD_PROMO_CAMPAIGN:        '/create',
    PROMO_CAMPAIGN_INFO:       '/:promoCampaignId/info',
    PROMO_CAMPAIGN_EDIT:       '/:promoCampaignId/edit',
    VISIBILITY_SETTINGS:       '/:promoCampaignId/visibility-setting',
    LOAD_PROMO_CODES:          '/:promoCampaignId/load-promo-codes',
    PROMO_CODES_STATISTIC:     '/:promoCampaignId/promo-codes-statistic',
};

export const ROUTE_AUDITOR = {
    AUDIT:          `${ ROUTE.AUDITOR }/${ PAGE.AUDIT }`
};

export const ROUTE_USER_MANAGER = {
    USERS:          `${ ROUTE.USER_MANAGER }/${ PAGE.USERS }`,
};

export const ROUTE_ADMIN = {
    REDESIGNED_USERS: `${ ROUTE.REDESIGNED }${ ROUTE.ADMIN }/${ PAGE.USERS }`,
    REDESIGNED_PROMO_CAMPAIGN: `${ ROUTE.REDESIGNED }${ ROUTE.ADMIN }/${ PAGE.PROMO_CAMPAIGN }`,
    DASHBOARD:      `${ ROUTE.REDESIGNED }${ ROUTE.ADMIN }/${ PAGE.DASHBOARD }`,
    USERS:          `${ ROUTE.ADMIN }/${ PAGE.USERS }`,
    FILES:          `${ ROUTE.ADMIN }/${ PAGE.FILES }`,
    DZO:            `${ ROUTE.ADMIN }/${ PAGE.DZO }`,
    LANDING:        `${ ROUTE.ADMIN }/${ PAGE.LANDING }`,
    CATEGORY:       `${ ROUTE.ADMIN }/${ PAGE.CATEGORY }`,
    SLIDER:         `${ ROUTE.ADMIN }/${ PAGE.SLIDER }`,
    PROMO_CAMPAIGN: `${ ROUTE.ADMIN }/${ PAGE.PROMO_CAMPAIGN }`,
    REDESIGNED_APPS: `${ ROUTE.REDESIGNED }${ ROUTE.ADMIN }/${ PAGE.APPS }`,
};

export const ROUTE_OWNER = {
    REDESIGNED_USERS: `${ ROUTE.REDESIGNED }${ ROUTE.OWNER }/${ PAGE.USERS }`,
    REDESIGNED_PROMO_CAMPAIGN: `${ ROUTE.REDESIGNED }${ ROUTE.OWNER }/${ PAGE.PROMO_CAMPAIGN }`,
    DASHBOARD:      `${ ROUTE.REDESIGNED }${ ROUTE.OWNER }/${ PAGE.DASHBOARD }`,
    DZO:            `${ ROUTE.OWNER }/${ PAGE.DZO }`,
    LANDING:        `${ ROUTE.OWNER }/${ PAGE.LANDING }`,
    CATEGORY:       `${ ROUTE.OWNER }/${ PAGE.CATEGORY }`,
    SLIDER:         `${ ROUTE.OWNER }/${ PAGE.SLIDER }`,
    PROMO_CAMPAIGN: `${ ROUTE.OWNER }/${ PAGE.PROMO_CAMPAIGN }`,
};

export const ROUTE_ADMIN_APPS = {
    ADD_APP:        `${ ROUTE_ADMIN.REDESIGNED_APPS}/create`,
};
