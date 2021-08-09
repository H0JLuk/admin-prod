import { TextAreaProps } from 'antd/lib/input';

export const showCount: TextAreaProps['showCount'] = {
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    formatter: ({ count, maxLength }) => `Осталось символов ${maxLength! - count}`,
};

export const APPLICATION_JSON_TYPE = 'application/json';
export const DEFAULT_SLEEP_TIME = 500; // in milliseconds

export enum DIRECTION {
    ASC = 'ASC',
    DESC = 'DESC',
}

export enum BANNER_TYPE {
    CARD = 'CARD',
    LOGO_MAIN = 'LOGO_MAIN',
    LOGO_ICON = 'LOGO_ICON',
    LOGO_SECONDARY = 'LOGO_SECONDARY',
    SCREEN = 'SCREEN',
    VIDEO = 'VIDEO',
}

export enum BANNER_TEXT_TYPE {
    DESCRIPTION = 'DESCRIPTION',
    HEADER = 'HEADER',
    RULES = 'RULES',
}

export enum SALE_POINT_TYPE {
    INTERNAL = 'INTERNAL',
    EXTERNAL = 'EXTERNAL',
}

export const SALE_POINT_TYPE_RU = {
    [SALE_POINT_TYPE.EXTERNAL]: 'Внешняя',
    [SALE_POINT_TYPE.INTERNAL]: 'Внутренняя',
};

export const BUTTON_TEXT = {
    ADD: 'Добавить',
    CANCEL: 'Отменить',
    CANCEL_ALL: 'Отменить все',
    CHANGE: 'Изменить',
    CHANGE_ORDER: 'Изменить порядок',
    CHOSEN: 'Выбрано',
    COPY: 'Копировать',
    CREATE: 'Создать',
    DELETE: 'Удалить',
    EDIT: 'Редактировать',
    LOGIN: 'Вход',
    MOVE_UP: 'Переместить вверх',
    MOVE_DOWN: 'Переместить вниз',
    OK: 'Хорошо',
    RESET_PASS: 'Сбросить пароль',
    SAVE: 'Сохранить',
    SELECT: 'Выбрать',
    SELECT_ALL: 'Выбрать все',
};
