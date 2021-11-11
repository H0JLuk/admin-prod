export enum APP_MECHANIC {
    PRESENTS = 'PRESENTS',
    ECOSYSTEM = 'ECOSYSTEM',
    PRESENTATION = 'PRESENTATION',
    BUNDLE = 'BUNDLE',
    EXPRESS = 'EXPRESS',
    MIX = 'MIX',
}

export const APP_MECHANIC_RU: Record<APP_MECHANIC, string> = {
    [APP_MECHANIC.PRESENTS]: 'Подарки',
    [APP_MECHANIC.ECOSYSTEM]: 'Продукты',
    [APP_MECHANIC.PRESENTATION]: 'Экскурсия',
    [APP_MECHANIC.BUNDLE]: 'ВАУ',
    [APP_MECHANIC.EXPRESS]: 'Экспресс',
    [APP_MECHANIC.MIX]: 'Микс',
};

export const APP_MECHANIC_OPTIONS = Object.entries(APP_MECHANIC_RU).map(([value, label]) => ({ label, value }));

export const MECHANICS_ERROR = `Необходимо выбрать хотя бы одну обязательную механику (${APP_MECHANIC_RU.PRESENTS}, ${APP_MECHANIC_RU.ECOSYSTEM}, ${APP_MECHANIC_RU.BUNDLE}, ${APP_MECHANIC_RU.EXPRESS} или ${APP_MECHANIC_RU.MIX})`;

export enum GAME_MECHANIC {
    SCRATCH = 'SCRATCH',
}

export const GAME_MECHANIC_OPTIONS = [
    { label: 'Скретч-слой подарка на экране успеха', value: GAME_MECHANIC.SCRATCH },
];

export enum NOTIFICATION_TYPES {
    PUSH = 'PUSH',
    // SMS: 'SMS',
    // EMAIL: 'EMAIL',
}

export const NOTIFICATION_TYPES_OPTIONS = [
    { label: 'Push', value: NOTIFICATION_TYPES.PUSH },
    // { label: 'SMS', value: NOTIFICATION_TYPES.SMS },
    // { label: 'Email', value: NOTIFICATION_TYPES.EMAIL },
];
