export const APP_MECHANICS = {
    PRESENTS: { value: 'PRESENTS', label: 'Подарки' },
    ECOSYSTEM: { value: 'ECOSYSTEM', label: 'Продукты' },
    PRESENTATION: { value: 'PRESENTATION', label: 'Экскурсия' },
    BUNDLE: { value: 'BUNDLE', label: 'WOW' },
};

export const MECHANICS_CHECKBOXES = Object.keys(APP_MECHANICS).map(key => ({
    value: APP_MECHANICS[key].value,
    label: APP_MECHANICS[key].label,
}));

export const APP_LOGIN_TYPES = [
    { label: 'Логин/Пароль', value: 'PASSWORD' },
    { label: 'СБОЛ ПРО', value: 'SBOL_PRO' },
    { label: 'Ссылка', value: 'DIRECT_LINK' },
];

export const MECHANICS_ERROR = `Необходимо выбрать хотя бы одну обязательную механику (${APP_MECHANICS.PRESENTS.label}, ${APP_MECHANICS.ECOSYSTEM.label} или ${APP_MECHANICS.BUNDLE.label})`;
