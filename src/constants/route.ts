export const ROUTE = {
    CORE:           '/',
    APP:            '/app',
    LOGIN:          '/login',
    AUDITOR:        '/auditor',
    ADMIN:          '/admin',
    OWNER:          '/owner',
    PARTNER:        '/partner',
    USER_MANAGER:   '/user-manager',
};

const PAGE = {
    AUDIT:           'audit',
    CATEGORY:        'category',
    DZO:             'dzo',
    REFERENCE_BOOKS: 'reference-books',
    DASHBOARD:       'dashboard',
    REPORTS:         'reports',
    PRESENTATION:    'presentation',
    PROMO_CAMPAIGN:  'promo-campaign',
    USERS:           'users',
    CONSENTS:        'consents',
    APPS:            'client-apps',
    GROUPS:          'groups',
};

export const USERS_PAGES = {
    ADD_USER:        '/create',
    USER_INFO:       '/:userId',
    EDIT_USER:       '/:userId/edit',
    EDIT_SOME_USERS: '/multiple_edit',
};

export const PROMO_CAMPAIGN_PAGES = {
    ADD_PROMO_CAMPAIGN:        '/create',
    PROMO_CAMPAIGN_COPY:       '/copy',
    PROMO_CAMPAIGN_INFO:       '/:promoCampaignId/info',
    PROMO_CAMPAIGN_EDIT:       '/:promoCampaignId/edit',
    VISIBILITY_SETTINGS:       '/:promoCampaignId/visibility-setting',
};

export const CLIENT_APPS_PAGES = {
    ADD_APP:        '/create-app',
    EDIT_APP:       '/app-properties',
};

export const DZO_PAGES = {
    ADD_DZO:        '/create',
    DZO_INFO:       '/:dzoId/info',
    DZO_EDIT:       '/:dzoId/edit',
};

export const GROUPS_PAGES = {
    ADD_GROUP:      '/create',
    EDIT_GROUP:     '/:groupId/edit',
    INFO_GROUP:     '/:groupId/info',
};

export const LOCATIONS_PAGES = {
    LIST:           '/location',
    ADD_LOCATION:   '/add',
    EDIT_LOCATION:  '/:locationId/edit',
};

export const SALE_POINT_PAGES = {
    LIST:            '/sale-point',
    ADD_SALE_POINT:  '/add',
    EDIT_SALE_POINT: '/:salePointId/edit',
};

export const LOCATIONS_TYPES_PAGES = {
    LIST:               '/location-type',
    ADD_LOCATION_TYPE:  '/add',
    EDIT_LOCATION_TYPE: '/:locationTypeId/edit',
};

export const SALE_POINT_TYPES_PAGES = {
    LIST:                 '/sale-point-type',
    ADD_SALE_POINT_TYPE:  '/add',
    EDIT_SALE_POINT_TYPE: '/:salePointTypeId/edit',
};

export const BUSINESS_ROLE_PAGES = {
    LIST:               '/business-role',
    ADD_BUSINESS_ROLE:  '/create',
    INFO_BUSINESS_ROLE: '/:businessRoleId/info',
    EDIT_BUSINESS_ROLE: '/:businessRoleId/edit',
};

export const CONSENTS_PAGES = {
    ADD_CONSENT:    '/create',
    INFO_CONSENT:   '/:consentId/info',
    EDIT_CONSENT:   '/:consentId/edit',
};

export const ROUTE_AUDITOR = {
    AUDIT:          `${ ROUTE.AUDITOR }/${ PAGE.AUDIT }`,
};

export const ROUTE_USER_MANAGER = {
    USERS:          `${ ROUTE.USER_MANAGER }/${ PAGE.USERS }`,
};

export const ROUTE_PARTNER = {
    USERS:          `${ ROUTE.PARTNER }/${ PAGE.USERS }`,
    REPORTS:        `${ ROUTE.PARTNER }/${ PAGE.REPORTS }`,
    APPS:           `${ ROUTE.PARTNER }/${ PAGE.APPS }`,
};

export const ROUTE_ADMIN = {
    DASHBOARD:      `${ ROUTE.ADMIN }/${ PAGE.DASHBOARD }`,
    USERS:          `${ ROUTE.ADMIN }/${ PAGE.USERS }`,
    REPORTS:        `${ ROUTE.ADMIN }/${ PAGE.REPORTS }`,
    DZO:            `${ ROUTE.ADMIN }/${ PAGE.DZO }`,
    REFERENCE_BOOKS: `${ROUTE.ADMIN}/${PAGE.REFERENCE_BOOKS}`,
    PRESENTATION:   `${ ROUTE.ADMIN }/${ PAGE.PRESENTATION }`,
    CATEGORY:       `${ ROUTE.ADMIN }/${ PAGE.CATEGORY }`,
    PROMO_CAMPAIGN: `${ ROUTE.ADMIN }/${ PAGE.PROMO_CAMPAIGN }`,
    CONSENTS:       `${ ROUTE.ADMIN }/${ PAGE.CONSENTS }`,
    APPS:           `${ ROUTE.ADMIN }/${ PAGE.APPS }`,
    APP_SETTINGS:   `${ ROUTE.ADMIN }/${ PAGE.APPS }${ CLIENT_APPS_PAGES.EDIT_APP }`,
    GROUPS:         `${ ROUTE.ADMIN }/${ PAGE.GROUPS }`,
};

export const ROUTE_OWNER = {
    DASHBOARD:      `${ ROUTE.OWNER }/${ PAGE.DASHBOARD }`,
    DZO:            `${ ROUTE.OWNER }/${ PAGE.DZO }`,
    PRESENTATION:   `${ ROUTE.OWNER }/${ PAGE.PRESENTATION }`,
    REPORTS:        `${ ROUTE.OWNER }/${ PAGE.REPORTS }`,
    CATEGORY:       `${ ROUTE.OWNER }/${ PAGE.CATEGORY }`,
    PROMO_CAMPAIGN: `${ ROUTE.OWNER }/${ PAGE.PROMO_CAMPAIGN }`,
    CONSENTS:       `${ ROUTE.OWNER }/${ PAGE.CONSENTS }`,
    APPS:           `${ ROUTE.OWNER }/${ PAGE.APPS }`,
    GROUPS:         `${ ROUTE.OWNER }/${ PAGE.GROUPS }`,
};
