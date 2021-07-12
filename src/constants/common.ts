import { TextAreaProps } from 'antd/lib/input';

export const showCount: TextAreaProps['showCount'] = {
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
    SAVE: 'Сохранить',
    ADD: 'Добавить',
    CREATE: 'Создать',
    CANCEL: 'Отменить',
    SELECT: 'Выбрать',
    SELECT_ALL: 'Выбрать все',
    CANCEL_ALL: 'Отменить все',
    DELETE: 'Удалить',
    CHOSEN: 'Выбрано',
    EDIT: 'Редактировать',
    OK: 'Хорошо',
    COPY: 'Копировать',
    CHANGE_ORDER: 'Изменить порядок',
};
