
export const NEW_DZO_TITLE = 'Новое ДЗО';
export const CANCEL_BUTTON_TITLE = 'Отменить';
export const VALIDATION_TEXT = 'Заполните обязательное поле';
export const ADD_BUTTON_TITLE = 'Добавить';
export const SAVE_BUTTON_TITLE = 'Сохранить';
export const URL_VALIDATION_TEXT = 'Введите url в формате http://site.ru';
export const DELETE_BUTTON_LABEL = 'Удалить';
export const DELETE_CONFIRMATION_MODAL_TITLE = 'Вы действительно хотите удалить ДЗО';
export const QR_LINK_PLACEHOLDER = 'Введите ссылку';
export const QR_LINK_LABEL = 'Ссылка для QR-кода';
export const APP_TYPE_LABEL = 'Тип приложения';
export const APP_TYPE_PLACEHOLDER = 'Выберите приложение';
export const APP_TYPE_ALREADY_SELECTED = 'Нельзя выбрать два одинаковых приложения';
export const DZO_CODE_NOT_UNIQUE = 'ДЗО с таким кодом уже есть!';
export const DZO_NAME = 'Название';
export const DZO_CODE = 'Код';
export const DZO_DESCRIPTION = 'Описание';
export const EDIT = 'Редактировать';
export const DELETE = 'Удалить';
export const OK_TEXT = 'Хорошо';
export const ERROR_DELETE_DZO = 'Ошибка удаления ДЗО';
export const BANNER_IS_EMPTY = 'Логотип отсутствует';
export const DZO_APPLICATION_LIST_NAME = 'applicationList';
export const BANNERS = 'banners';
export const DZO_REQUEST = 'dzoRequest';
export const URL_VALIDATION_NO_APPLICATION_TYPE = 'Выберите тип приложения';

export const TYPES = {
    INPUT: 'input',
    INPUT_WEB: 'inputWeb',
    TEXT_BLOCK: 'textBlock',
    SELECT: 'select',
};

export const RULES = {
    STANDARD: [],
    STANDARD_REQUIRED: [{ required: true, message: VALIDATION_TEXT, validateTrigger: 'onSubmit' }],
};

export const APP_OPTIONS = [
    { label: 'OTHER', value: 'OTHER' },
    { label: 'IOS', value: 'IOS' },
    { label: 'ANDROID', value: 'ANDROID' },
];

export const FORM_ELEMENTS = [
    [
        {
            label: DZO_NAME,
            type: TYPES.INPUT,
            rules: RULES.STANDARD_REQUIRED,
            name: 'dzoName',
            placeholder: DZO_NAME,
        },
        {
            label: 'Код',
            type: TYPES.INPUT,
            name: 'dzoCode',
            placeholder: 'Код',
        },
    ],
    [
        {
            label: 'Описание ДЗО',
            type: TYPES.TEXT_BLOCK,
            rules: RULES.STANDARD,
            name: 'description',
            placeholder: 'Описание ДЗО',
        },
    ],
];

export const BANNERS_UPLOAD_TEMPLATE = [
    {
        label: 'Логотип (цветной)',
        accept: '.svg',
        name: ['dzoBannerList', 'LOGO_MAIN'],
        type: 'logo',
        description: 'Добавить логотип',
        maxSize: 1,
        get setting() {
            return `${this.maxSize}МБ .svg`;
        },
    },
    {
        label: 'Логотип (белый)',
        accept: '.svg',
        name: ['dzoBannerList', 'LOGO_SECONDARY'],
        type: 'logo',
        description: 'Добавить логотип',
        maxSize: 1,
        get setting() {
            return `${this.maxSize}МБ .svg`;
        },
    },
    {
        label: 'Иконка',
        accept: '.svg',
        name: ['dzoBannerList', 'LOGO_ICON'],
        type: 'logo',
        description: 'Добавить логотип',
        maxSize: 1,
        get setting() {
            return `${this.maxSize}МБ .svg`;
        },
    },
];

export const DEFAULT_DZO = {
    dzoCode: '',
    description: '',
    dzoName: '',
    applicationList: [{ applicationType: APP_OPTIONS[0].value, applicationUrl: '' }],
};

export const DEFAULT_APP = { applicationType: undefined, applicationUrl: '' };


export const DZO_INFO_TEMPLATE_DATA = [
    [
        { key: 'dzoName', label: DZO_NAME },
        { key: 'dzoCode', label: DZO_CODE },
    ],
    [
        { key: 'description', label: DZO_DESCRIPTION },
    ],
];

export const DZO_INFO_APPS_TEMPLATE = [
    { key: 'applicationType', label: APP_TYPE_LABEL },
    { key: 'applicationUrl', label: QR_LINK_LABEL, type: 'url' },
];

export const DZO_BANNERS_TEMPLATE = [
    {
        type: 'LOGO_MAIN',
        label: 'Логотип (цветной)',
    },
    {
        type: 'LOGO_SECONDARY',
        label: 'Логотип (белый)',
    },
    {
        type: 'LOGO_ICON',
        label: 'Иконка',
    },
];
