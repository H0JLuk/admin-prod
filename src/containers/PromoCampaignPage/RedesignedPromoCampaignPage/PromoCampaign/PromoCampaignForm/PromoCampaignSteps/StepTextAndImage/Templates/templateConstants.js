import landing from '../../../../../../../../static/images/landing.png';
import logo_on_screen_with_phone from '../../../../../../../../static/images/logo_on_screen_with_phone.png';
import logo_on_screen_with_qr_code from '../../../../../../../../static/images/logo_on_screen_with_qr_code.png';
import main_banner from '../../../../../../../../static/images/main_banner.png';
import presents_main_banner from '../../../../../../../../static/images/presents_main_banner.png';
import presents_main_logo_1 from '../../../../../../../../static/images/presents_main_logo_1.png';
// import presents_main_logo_2 from '../../../../../static/images/presents_main_logo_2.png';
import presents_scan_icon from '../../../../../../../../static/images/presents_scan_icon.png';
import landing_gift from '../../../../../../../../static/images/landing.png';

export const EXCURSION_TYPE_ROWS = [
    {
        main_banner: {
            title: 'Баннер на главной',
            description: 'Добавить баннер',
            setting: '770px x 368px, 1МБ .jpg',
            tooltipImg: main_banner,
            access_type: '.jpg,.jpeg,.png',
            rules: [{ required: true, message: 'Заполните поле' }],
            type: 'banner',
        },
        logo_on_screen_with_phone: {
            title: 'Логотип на экране с номером (белый)',
            description: 'Добавить логотип',
            setting: '24px, 1МБ .svg',
            type: 'logo',
            tooltipImg: logo_on_screen_with_phone,
            access_type: '.svg',
            // rules: [{ required: true, message: 'Заполните поле' }],
        },
    },
    {
        landing: {
            title: 'Лендинг',
            description: 'Добавить лендинг',
            setting: '834px, 1МБ .jpg',
            tooltipImg: landing,
            access_type: '.jpg,.jpeg,.png',
            type: 'banner',
            rules: [{ required: true, message: 'Заполните поле' }],
        },
        logo_on_screen_with_qr_code: {
            title: 'Логотип на экране с QR',
            description: 'Добавить логотип',
            setting: '36px, 1МБ .svg',
            tooltipImg: logo_on_screen_with_qr_code,
            access_type: '.svg',
            type: 'logo',
            // rules: [{ required: true, message: 'Заполните поле' }],
        },
    },
    {
        excursionConditions: {
            title: 'Условия',
            type: 'text',
            placeholder: 'Текст условий',
            // rules: [{ required: true, message: 'Заполните поле' }],
        },
        excursionTitleQR: {
            title: 'Заголовок на экране с QR',
            placeholder: 'Текст заголовка',
            maxLength: 48,
            rules: [{ required: true, message: 'Заполните поле' }],
            type: 'text',
        },
    },
];

export const GIFT_TYPE_ROWS = [
    {
        presents_main_banner: {
            title: 'Карточка на главной',
            description: 'Добавить изображение',
            setting: '370px x 220px, 1МБ .jpg',
            tooltipImg: presents_main_banner,
            access_type: '.jpg,.jpeg,.png',
            type: 'banner',
            rules: [{ required: true, message: 'Заполните поле' }],
        },
        presents_main_logo_1: {
            title: 'Логотип на главной',
            description: 'Добавить логотип',
            setting: '24px, 1МБ .svg',
            tooltipImg: presents_main_logo_1,
            access_type: '.svg',
            type: 'logo',
            rules: [{ required: true, message: 'Заполните поле' }],
        },
    },
    {
        presents_scan_icon: {
            title: 'Иконка приложения',
            description: 'Добавить иконку',
            setting: '64px x 64px, 1МБ .jpg',
            tooltipImg: presents_scan_icon,
            access_type: '.jpg,.jpeg,.png',
            type: 'logo',
            rules: [{ required: true, message: 'Заполните поле' }],
        },
        landing: {
            title: 'Лендинг',
            description: 'Добавить изображение',
            setting: '375px, 1МБ .jpg',
            tooltipImg: landing_gift,
            access_type: '.jpg,.jpeg,.png',
            type: 'banner',
            rules: [{ required: true, message: 'Заполните поле' }],
        },
    },
    {
        giftText: {
            title: 'Текст заголовка',
            type: 'text',
            placeholder: 'Заголовок',
            maxLength: 48,
            rules: [{ required: true, message: 'Заполните поле' }],
        },
        giftTextOption: {
            title: 'Текст описания',
            type: 'text',
            placeholder: 'Описание',
            maxLength: 48,
            rules: [{ required: true, message: 'Заполните поле' }],
        },
    },
    {
        excursionConditions: {
            title: 'Условия',
            type: 'text',
            placeholder: 'Текст условий',
            // rules: [{ required: true, message: 'Заполните поле' }],
        },
    }
];

export const INFO_ROWS = {
    excursion: EXCURSION_TYPE_ROWS,
    gift: GIFT_TYPE_ROWS,
};