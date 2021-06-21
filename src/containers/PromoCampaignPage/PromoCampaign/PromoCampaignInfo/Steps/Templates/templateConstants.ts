import { BANNER_TEXT_TYPE, BANNER_TYPE } from '@constants/common';

export type IRowObj = {
    label: string;
    type: 'banner' | 'logo' | 'text';
};

export type IRow = Record<string, IRowObj>;

export const EXCURSION_TYPE_ROWS: IRow[] = [
    {
        [BANNER_TYPE.CARD]: { label: 'Баннер на главной', type: 'banner' },
        [BANNER_TYPE.LOGO_SECONDARY]: { label: 'Логотип на экране с номером (белый)', type: 'logo' },
    },
    {
        [BANNER_TYPE.SCREEN]: { label: 'Лендинг', type: 'banner' },
        [BANNER_TYPE.LOGO_MAIN]: { label: 'Логотип на экране с QR', type: 'logo' },
    },
    {
        RULES: { label: 'Условия', type: 'text' },
        HEADER: { label: 'Заголовок на экране с QR', type: 'text' },
    },
];

export const GIFT_TYPE_ROWS: IRow[] = [
    {
        [BANNER_TYPE.CARD]: { label: 'Карточка на главной', type: 'banner' },
        [BANNER_TYPE.LOGO_MAIN]: { label: 'Логотип на главной', type: 'logo' },
    },
    {
        [BANNER_TYPE.LOGO_SECONDARY]: { label: 'Иконка приложения', type: 'logo' },
        // [BANNER_TYPE.SCREEN]: { label: 'Лендинг', type: 'banner' },
    },
    {
        [BANNER_TEXT_TYPE.HEADER]: { label: 'Текст заголовка', type: 'text' },
        [BANNER_TEXT_TYPE.DESCRIPTION]: { label: 'Описание заголовка', type: 'text' },
    },
    {
        [BANNER_TEXT_TYPE.RULES]: { label: 'Условия', type: 'text' },
    },
];

export const INFO_ROWS: Record<string, IRow[]> = {
    NORMAL: EXCURSION_TYPE_ROWS,
    PRESENT: GIFT_TYPE_ROWS,
};
