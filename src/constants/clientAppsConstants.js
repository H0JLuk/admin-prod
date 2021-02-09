export const APP_MECHANICS = {
    PRESENTS: { value: 'PRESENTS', label: 'Подарки' },
    ECOSYSTEM: { value: 'ECOSYSTEM', label: 'Продукты' },
    PRESENTATION: { value: 'PRESENTATION', label: 'Экскурсия' },
};

export const MECHANICS_CHECKBOXES = Object.keys(APP_MECHANICS).map(key => ({
    value: APP_MECHANICS[key].value,
    label: APP_MECHANICS[key].label,
}));

export const MECHANICS_ERROR = `Необходимо выбрать хотя бы одну обязательную механику (${APP_MECHANICS.PRESENTS.label} или ${APP_MECHANICS.ECOSYSTEM.label})`;
