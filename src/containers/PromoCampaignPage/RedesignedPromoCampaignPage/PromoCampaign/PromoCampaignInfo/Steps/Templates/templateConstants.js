export const EXCURSION_TYPE_ROWS = [
    {
        CARD: { label: 'Баннер на главной', type: 'image' },
        LOGO_SECONDARY: { label: 'Логотип на экране с номером', type: 'icon' },
    },
    {
        SCREEN: { label: 'Лендинг', type: 'image' },
        LOGO_MAIN: { label: 'Логотип на экране с QR', type: 'icon' },
    },
    {
        RULES: { label: 'Условия', type: 'text' },
        HEADER: { label: 'Заголовок на экране с QR', type: 'text' },
    },
];

export const GIFT_TYPE_ROWS = [
    {
        CARD: { label: 'Карточка на главной', type: 'image' },
        LOGO_MAIN: { label: 'Логотип на главной', type: 'icon' },
    },
    {
        LOGO_ICON: { label: 'Иконка приложения', type: 'icon' },
        SCREEN: { label: 'Лендинг', type: 'image' },
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
    excursion: EXCURSION_TYPE_ROWS,
    gift: GIFT_TYPE_ROWS,
};
