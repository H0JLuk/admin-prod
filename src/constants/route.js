export const ROUTE = {
    CORE:           '/',
    APP:            '/app',
    LOGIN:          '/login',
    AUDITOR:        '/auditor',
    ADMIN:          '/admin',
    OWNER:          '/owner',
    CLIENT_APPS:    '/client-apps',
    REDESIGNED:     '/redesigned',
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
    REDESIGNED_USERS: `${ROUTE.REDESIGNED}${ ROUTE.ADMIN }/${ PAGE.USERS }`,
    USERS:          `${ ROUTE.ADMIN }/${ PAGE.USERS }`,
    FILES:          `${ ROUTE.ADMIN }/${ PAGE.FILES }`,
    DZO:            `${ ROUTE.ADMIN }/${ PAGE.DZO }`,
    LANDING:        `${ ROUTE.ADMIN }/${ PAGE.LANDING }`,
    CATEGORY:       `${ ROUTE.ADMIN }/${ PAGE.CATEGORY }`,
    SLIDER:         `${ ROUTE.ADMIN }/${ PAGE.SLIDER }`,
    PROMO_CAMPAIGN: `${ ROUTE.ADMIN }/${ PAGE.PROMO_CAMPAIGN }`
};

export const ROUTE_ADMIN_USERS = {
    ADD_USER:        `${ ROUTE_ADMIN.REDESIGNED_USERS }/create`,
    USER_INFO:       `${ ROUTE_ADMIN.REDESIGNED_USERS }/:userId`,
    EDIT_USER:       `${ ROUTE_ADMIN.REDESIGNED_USERS }/:userId/edit`,
    EDIT_SOME_USERS: `${ ROUTE_ADMIN.REDESIGNED_USERS }/multiple_edit/:userIds`, // TODO: Продумать как передавать данные пользователей для редактирования пачкой
};

export const ROUTE_OWNER = {
    DZO:            `${ ROUTE.OWNER }/${ PAGE.DZO }`,
    LANDING:        `${ ROUTE.OWNER }/${ PAGE.LANDING }`,
    CATEGORY:       `${ ROUTE.OWNER }/${ PAGE.CATEGORY }`,
    SLIDER:         `${ ROUTE.OWNER }/${ PAGE.SLIDER }`,
    PROMO_CAMPAIGN: `${ ROUTE.OWNER }/${ PAGE.PROMO_CAMPAIGN }`,
};