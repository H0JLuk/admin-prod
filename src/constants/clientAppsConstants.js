export const APP_MECHANICS = {
    PRESENTS: { value: 'PRESENTS', label: 'Подарки' },
    ECOSYSTEM: { value: 'ECOSYSTEM', label: 'Продукты' },
    PRESENTATION: { value: 'PRESENTATION', label: 'Экскурсия' },
    BUNDLE: { value: 'BUNDLE', label: 'ВАУ' },
};

export const MECHANICS_CHECKBOXES = Object.values(APP_MECHANICS);

export const NOTIFICATION_TYPES = {
    PUSH: 'PUSH',
    // SMS: 'SMS',
    // EMAIL: 'EMAIL',
};

export const NOTIFICATION_TYPES_OPTIONS = [
    { label: 'Push', value: NOTIFICATION_TYPES.PUSH },
    // { label: 'SMS', value: NOTIFICATION_TYPES.SMS },
    // { label: 'Email', value: NOTIFICATION_TYPES.EMAIL },
];

export const MECHANICS_ERROR = `Необходимо выбрать хотя бы одну обязательную механику (${APP_MECHANICS.PRESENTS.label}, ${APP_MECHANICS.ECOSYSTEM.label} или ${APP_MECHANICS.BUNDLE.label})`;
