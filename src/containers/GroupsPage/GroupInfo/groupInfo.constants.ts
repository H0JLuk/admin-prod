export type BundleRowsValueDto = {
    label: string;
    type: string;
};

export type BundleRowsDto = Record<string, Omit<BundleRowsValueDto, 'type'>>;

export const groupBundleRows = [
    {
        // CURRENT_CAMPAIGN: { label:'Кампания с которой связан бандл' },
        // HEADER: { label:'Текст заголовка' },
        // DESCRIPTION: { label:'Описание' },
        LOGO_ICON: { label: 'Баннер на карточке', type: 'logo' },
    }
];

export const associationGroupRows = [
    {
        HEADER: { label: 'Текст заголовка', type: 'text' },
        LOGO_MAIN: { label: 'Логотип связанной промо-кампании', type: 'logo' },
    }
];

export const BUNDLE_ROWS = {
    LOGO_ICON: {
        label: 'Баннер на карточке',
    },
    HEADER: {
        label: 'Текст заголовка'
    },
    DESCRIPTION: {
        label: 'Текст описания'
    },
    CARD: {
        label: 'Баннер на главной'
    }
};

export const imagesTypes = {
    CARD: 'CARD',
    LOGO_ICON: 'LOGO_ICON',
};

export const textsTypes = {
    DESCRIPTION: 'DESCRIPTION',
    HEADER: 'HEADER',
};
