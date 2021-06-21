import { FormItemProps } from 'antd';
import landing from '@imgs/landing.png';
import logo_on_screen_with_phone from '@imgs/logo_on_screen_with_phone.png';
import logo_on_screen_with_qr_code from '@imgs/logo_on_screen_with_qr_code.png';
import main_banner from '@imgs/main_banner.png';
import presents_main_banner from '@imgs/presents_main_banner.png';
import presents_main_logo_1 from '@imgs/presents_main_logo_1.png';
import presents_main_logo_2 from '@imgs/presents_main_logo_2.png';
import { getPatternAndMessage } from '@utils/validators';
import { BANNER_TEXT_TYPE, BANNER_TYPE } from '@constants/common';

export type TemplateRowsValues = {
    title: string;
    description?: string;
    type: 'logo' | 'banner' | 'text';
    tooltipImg?: string;
    access_type?: string;
    maxSize?: number;
    setting?: string;
    rules?: FormItemProps['rules'];
    placeholder?: string;
    maxLength?: number;
};

export const EXCURSION_TYPE_ROWS: Record<string, TemplateRowsValues>[] = [
    {
        [BANNER_TYPE.CARD]: {
            title: 'Баннер на главной',
            description: 'Добавить баннер',
            tooltipImg: main_banner,
            access_type: '.jpg,.jpeg,.png',
            rules: [{ required: true, message: 'Заполните поле' }],
            type: 'banner',
            maxSize: 2,
            get setting() {
                return `770px x 368px, ${this.maxSize}МБ ${this.access_type}`;
            }
        },
        [BANNER_TYPE.LOGO_SECONDARY]: {
            title: 'Логотип на экране с номером (белый)',
            description: 'Добавить логотип',
            type: 'logo',
            tooltipImg: logo_on_screen_with_phone,
            access_type: '.svg',
            maxSize: 2,
            get setting() {
                return `48px, ${this.maxSize}МБ ${this.access_type}`;
            }
            // rules: [{ required: true, message: 'Заполните поле' }],
        },
    },
    {
        [BANNER_TYPE.SCREEN]: {
            title: 'Лендинг',
            description: 'Добавить лендинг',
            tooltipImg: landing,
            access_type: '.jpg,.jpeg,.png',
            type: 'banner',
            rules: [{ required: true, message: 'Заполните поле' }],
            maxSize: 2,
            get setting() {
                return `834px, ${this.maxSize}МБ ${this.access_type}`;
            }
        },
        [BANNER_TYPE.LOGO_MAIN]: {
            title: 'Логотип на экране с QR',
            description: 'Добавить логотип',
            tooltipImg: logo_on_screen_with_qr_code,
            access_type: '.svg',
            type: 'logo',
            maxSize: 2,
            get setting() {
                return `48px, ${this.maxSize}МБ ${this.access_type}`;
            }
            // rules: [{ required: true, message: 'Заполните поле' }],
        },
    },
    {
        [BANNER_TEXT_TYPE.RULES]: {
            title: 'Условия',
            type: 'text',
            placeholder: 'Текст условий',
            rules: [
                {
                    ...getPatternAndMessage('promoCampaign', 'textContent'),
                    validateTrigger: 'onSubmit',
                },
            ],
        },
        [BANNER_TEXT_TYPE.HEADER]: {
            title: 'Заголовок на экране с QR',
            placeholder: 'Текст заголовка',
            maxLength: 60,
            rules: [
                { required: true, message: 'Заполните поле' },
                {
                    ...getPatternAndMessage('promoCampaign', 'textContent'),
                    validateTrigger: 'onSubmit',
                },
            ],
            type: 'text',
        },
    },
];

export const GIFT_TYPE_ROWS: Record<string, TemplateRowsValues>[] = [
    {
        [BANNER_TYPE.CARD]: {
            title: 'Карточка на главной',
            description: 'Добавить изображение',
            tooltipImg: presents_main_banner,
            access_type: '.jpg,.jpeg,.png',
            type: 'banner',
            rules: [{ required: true, message: 'Заполните поле' }],
            maxSize: 2,
            get setting() {
                return `370px x 220px, ${this.maxSize}МБ ${this.access_type}`;
            },
        },
        [BANNER_TYPE.LOGO_MAIN]: {
            title: 'Логотип на главной',
            description: 'Добавить логотип',
            tooltipImg: presents_main_logo_1,
            access_type: '.svg',
            type: 'logo',
            maxSize: 2,
            get setting() {
                return `48px, ${this.maxSize}МБ ${this.access_type}`;
            },
            // rules: [{ required: true, message: 'Заполните поле' }],
        },
    },
    {
        [BANNER_TYPE.LOGO_SECONDARY]: {
            title: 'Логотип на главной (белый)',
            description: 'Добавить логотип',
            tooltipImg: presents_main_logo_2,
            access_type: '.svg',
            type: 'logo',
            maxSize: 2,
            get setting() {
                return `48px, ${this.maxSize}МБ ${this.access_type}`;
            }
            // rules: [{ required: true, message: 'Заполните поле' }],
        },
    },
    {
        [BANNER_TEXT_TYPE.HEADER]: {
            title: 'Текст заголовка',
            type: 'text',
            placeholder: 'Заголовок',
            maxLength: 60,
            rules: [
                { required: true, message: 'Заполните поле' },
                {
                    ...getPatternAndMessage('promoCampaign', 'textContent'),
                    validateTrigger: 'onSubmit',
                },
            ],
        },
        [BANNER_TEXT_TYPE.DESCRIPTION]: {
            title: 'Текст описания',
            type: 'text',
            placeholder: 'Описание',
            maxLength: 120,
            rules: [
                { required: true, message: 'Заполните поле' },
                {
                    ...getPatternAndMessage('promoCampaign', 'textContent'),
                    validateTrigger: 'onSubmit',
                },
            ],
        },
    },
    {
        [BANNER_TEXT_TYPE.RULES]: {
            title: 'Условия',
            type: 'text',
            placeholder: 'Текст условий',
            rules: [
                {
                    ...getPatternAndMessage('promoCampaign', 'textContent'),
                    validateTrigger: 'onSubmit',
                },
            ],
        },
    }
];

export const INFO_ROWS = {
    NORMAL: EXCURSION_TYPE_ROWS,
    PRESENT: GIFT_TYPE_ROWS,
};

export type INFO_ROWS_KEYS = keyof typeof INFO_ROWS;
