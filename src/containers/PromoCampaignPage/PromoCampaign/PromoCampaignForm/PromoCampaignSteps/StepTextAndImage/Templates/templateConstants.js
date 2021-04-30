import landing from '../../../../../../../static/images/landing.png';
import logo_on_screen_with_phone from '../../../../../../../static/images/logo_on_screen_with_phone.png';
import logo_on_screen_with_qr_code from '../../../../../../../static/images/logo_on_screen_with_qr_code.png';
import main_banner from '../../../../../../../static/images/main_banner.png';
import presents_main_banner from '../../../../../../../static/images/presents_main_banner.png';
import presents_main_logo_1 from '../../../../../../../static/images/presents_main_logo_1.png';
import presents_main_logo_2 from '../../../../../../../static/images/presents_main_logo_2.png';
import { getPatternAndMessage } from '../../../../../../../utils/validators';
// import presents_scan_icon from '../../../../../../../static/images/presents_scan_icon.png';
// import landing_gift from '../../../../../../../static/images/landing.png';

export const EXCURSION_TYPE_ROWS = [
    {
        CARD: {
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
        LOGO_SECONDARY: {
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
        SCREEN: {
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
        LOGO_MAIN: {
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
        RULES: {
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
        HEADER: {
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

export const GIFT_TYPE_ROWS = [
    {
        CARD: {
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
        LOGO_MAIN: {
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
        LOGO_SECONDARY: {
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
        HEADER: {
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
        DESCRIPTION: {
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
        RULES: {
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
