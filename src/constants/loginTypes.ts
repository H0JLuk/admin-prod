export const LOGIN_TYPE = {
    PASSWORD: 'Логин/Пароль',
    SBER_REGISTRY: 'Авторизация через доверенные сервисы Сбера',
    // DIRECT_LINK: 'Ссылка',
};

export type LoginTypes = keyof typeof LOGIN_TYPE;

export type LoginTypesEnum = {
    [P in LoginTypes]: P;
};

export const LOGIN_TYPES_ENUM = Object.keys(LOGIN_TYPE).reduce((result, key) => ({ ...result, [key]: key }), {} as LoginTypesEnum);

export const LOGIN_TYPE_OPTIONS = Object.entries(LOGIN_TYPE).map(([value, label]) => ({ label, value }));
