export const ROUTE = {
    CORE:           '/',
    APP:            '/app',
    LOGIN:          '/login',
    AUDITOR:        '/auditor',
    ADMIN:          '/admin',
    OWNER:          '/owner',
    USER_MANAGER:   '/user-manager',
    CLIENT_APPS:    '/client-apps',
    OLD_DESIGN:     '/old_design',
};

const PAGE = {
    AUDIT:          'audit',
    CATEGORY:       'category',
    DZO:            'dzo',
    DASHBOARD:      'dashboard',
    FILES:          'files',
    PRESENTATION:   'presentation',
    PROMO_CAMPAIGN: 'promo-campaign',
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
    OLD_DESIGN_USERS: `${ ROUTE.OLD_DESIGN }${ ROUTE.ADMIN }/${ PAGE.USERS }`,
    OLD_DESIGN_PROMO_CAMPAIGN: `${ ROUTE.OLD_DESIGN }${ ROUTE.ADMIN }/${ PAGE.PROMO_CAMPAIGN }`,
    DASHBOARD:      `${ ROUTE.ADMIN }/${ PAGE.DASHBOARD }`,
    USERS:          `${ ROUTE.ADMIN }/${ PAGE.USERS }`,
    FILES:          `${ ROUTE.ADMIN }/${ PAGE.FILES }`,
    DZO:            `${ ROUTE.ADMIN }/${ PAGE.DZO }`,
    PRESENTATION:   `${ ROUTE.ADMIN }/${ PAGE.PRESENTATION }`,
    CATEGORY:       `${ ROUTE.ADMIN }/${ PAGE.CATEGORY }`,
    PROMO_CAMPAIGN: `${ ROUTE.ADMIN }/${ PAGE.PROMO_CAMPAIGN }`,
    APPS:           `${ ROUTE.ADMIN }/${ PAGE.APPS }`,
};

export const ROUTE_OWNER = {
    OLD_DESIGN_PROMO_CAMPAIGN: `${ ROUTE.OLD_DESIGN }${ ROUTE.OWNER }/${ PAGE.PROMO_CAMPAIGN }`,
    DASHBOARD:      `${ ROUTE.OWNER }/${ PAGE.DASHBOARD }`,
    DZO:            `${ ROUTE.OWNER }/${ PAGE.DZO }`,
    PRESENTATION:   `${ ROUTE.OWNER }/${ PAGE.PRESENTATION }`,
    FILES:          `${ ROUTE.OWNER }/${ PAGE.FILES }`,
    CATEGORY:       `${ ROUTE.OWNER }/${ PAGE.CATEGORY }`,
    PROMO_CAMPAIGN: `${ ROUTE.OWNER }/${ PAGE.PROMO_CAMPAIGN }`,
};

export const ROUTE_ADMIN_APPS = {
    ADD_APP:        `${ ROUTE_ADMIN.APPS}/create`,
};
