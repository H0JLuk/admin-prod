export const LOGIN_TYPE = {
    PASSWORD: 'Логин/Пароль',
    SBER_REGISTRY: 'Авторизация через доверенные сервисы Сбера',
    // DIRECT_LINK: 'Ссылка',
};

export const LOGIN_TYPES_ENUM = Object.keys(LOGIN_TYPE).reduce((result, key) => ({ ...result, [key]: key }), {});

export const LOGIN_TYPE_OPTIONS = Object.entries(LOGIN_TYPE).map(([value, label]) => ({ label, value }));
