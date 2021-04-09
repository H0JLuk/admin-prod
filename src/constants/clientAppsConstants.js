export const APP_MECHANICS = {
    PRESENTS: { value: 'PRESENTS', label: 'Подарки' },
    ECOSYSTEM: { value: 'ECOSYSTEM', label: 'Продукты' },
    PRESENTATION: { value: 'PRESENTATION', label: 'Экскурсия' },
    BUNDLE: { value: 'BUNDLE', label: 'ВАУ' },
};

export const MECHANICS_CHECKBOXES = Object.values(APP_MECHANICS);

export const NOTIFICATION_TYPES = [
    { label: 'Push', value: 'PUSH' },
    // { label: 'SMS', value: 'SMS' },
    // { label: 'Email', value: 'EMAIL' },
];

export const MECHANICS_ERROR = `Необходимо выбрать хотя бы одну обязательную механику (${APP_MECHANICS.PRESENTS.label}, ${APP_MECHANICS.ECOSYSTEM.label} или ${APP_MECHANICS.BUNDLE.label})`;
