export const EXCURSION_TYPE_ROWS = [
    {
        CARD: { label: 'Баннер на главной', type: 'banner' },
        LOGO_SECONDARY: { label: 'Логотип на экране с номером (белый)', type: 'logo' },
    },
    {
        SCREEN: { label: 'Лендинг', type: 'banner' },
        LOGO_MAIN: { label: 'Логотип на экране с QR', type: 'logo' },
    },
    {
        RULES: { label: 'Условия', type: 'text' },
        HEADER: { label: 'Заголовок на экране с QR', type: 'text' },
    },
];

export const GIFT_TYPE_ROWS = [
    {
        CARD: { label: 'Карточка на главной', type: 'banner' },
        LOGO_MAIN: { label: 'Логотип на главной', type: 'logo' },
    },
    {
        LOGO_SECONDARY: { label: 'Иконка приложения', type: 'logo' },
        // SCREEN: { label: 'Лендинг', type: 'banner' },
    },
    {
        HEADER: { label: 'Текст заголовка', type: 'text' },
        DESCRIPTION: { label: 'Описание заголовка', type: 'text' },
    },
    {
        RULES: { label: 'Условия', type: 'text' },
    },
];

export const INFO_ROWS = {
    NORMAL: EXCURSION_TYPE_ROWS,
    PRESENT: GIFT_TYPE_ROWS,
};
