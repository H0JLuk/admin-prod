import { BANNER_TEXT_TYPE, BANNER_TYPE } from '@constants/common';

export type BundleRowsValueDto = {
    label: string;
    type: string;
};

export type BundleRowsDto = Record<string, Omit<BundleRowsValueDto, 'type'>>;

export const groupBundleRows = [
    {
        [BANNER_TYPE.LOGO_ICON]: { label: 'Логотип на баннере на главной', type: 'logo' },
        [BANNER_TYPE.CARD]: { label: 'Карточка подарка', type: 'banner' },
    },
];

export const associationGroupRows = [
    {
        [BANNER_TEXT_TYPE.HEADER]: { label: 'Текст заголовка', type: 'text' },
        [BANNER_TYPE.LOGO_MAIN]: { label: 'Логотип связанной промо-кампании', type: 'logo' },
    },
];

export const BUNDLE_ROWS = {
    [BANNER_TYPE.LOGO_ICON]: {
        label: 'Баннер на карточке',
    },
    [BANNER_TEXT_TYPE.HEADER]: {
        label: 'Текст заголовка',
    },
    [BANNER_TEXT_TYPE.DESCRIPTION]: {
        label: 'Текст описания',
    },
    [BANNER_TYPE.CARD]: {
        label: 'Баннер на главной',
    },
};
