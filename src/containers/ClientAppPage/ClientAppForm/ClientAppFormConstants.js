import { APP_MECHANICS, MECHANICS_ERROR, MECHANICS_CHECKBOXES, APP_LOGIN_TYPES } from '../../../constants/clientAppsConstants';

export const CREATE_APP_TITLE = 'Новое приложение';
export const CANCEL_BUTTON_TITLE = 'Отменить';
export const ADD_BUTTON_TITLE = 'Добавить';
export const PROPERTIES_TITLE = 'Свойства';
export const EDIT_BUTTON_LABEL = 'Сохранить';

const appCodeRegex = /^[a-z0-9-_]+$/gmi;

const numberTransform = value => value ? Number(value) : '';

const checkBoxValidator = (_, value) => {
    if (value.includes(APP_MECHANICS.PRESENTS.value) || value.includes(APP_MECHANICS.ECOSYSTEM.value)){
        return Promise.resolve();
    }
    return Promise.reject(MECHANICS_ERROR);
};

export const RULES = {
    STANDARD: [],
    STANDARD_NUMBER: [
        {
            type: 'number',
            transform: numberTransform,
            validateTrigger: 'onSubmit',
            message: 'Значение может быть только числовым',
        },
    ],
    TWO_DIGITS_NUMBER: [
        {
            type: 'number',
            transform: numberTransform,
            validateTrigger: 'onSubmit',
            message: 'Значение может быть только числовым',
        },
    ],
    CHECKBOX_REQUIRED : [
        { type: 'array', required: true, message: 'Это обязательное поле', validateTrigger: 'onSubmit' },
    ],
    CHECKBOX: [
        { type: 'array', required: true, message: 'Это обязательное поле', validateTrigger: 'onSubmit' },
        { type: 'array', validator: checkBoxValidator, validateTrigger: 'onSubmit' },
    ],
    REQUIRED: [{ required: true, message: 'Это обязательное поле', validateTrigger: 'onSubmit' }],
    REQUIRED_ENGLISH_AND_NUMBER: [
        { required: true, message: 'Это обязательное поле' },
        { pattern: appCodeRegex, message: 'Можно использовать только латиницу', validateTrigger: 'onSubmit' },
    ],
};

export const FORM_TYPES = {
    INPUT: 'INPUT',
    CHECKBOX_GROUP: 'CHECKBOX_GROUP',
    TEXT_BLOCK: 'TEXT_BLOCK',
    MAIN_INFO_INPUT: 'MAIN_INFO_INPUT',
};

export const SETTINGS_TYPES = {
    CREATE: 'create',
    EDIT: 'edit',
};

export const FORM_MODES = {
    NEW: 'new',
    EDIT: 'edit',
};

export const mainInfoElements = [
    [
        {
            label: 'Название',
            type: FORM_TYPES.MAIN_INFO_INPUT,
            span: 16,
            rules: RULES.REQUIRED,
            name: 'name',
            placeholder: 'Имя',
        },
        {
            label: 'Код',
            type: FORM_TYPES.MAIN_INFO_INPUT,
            span: 8,
            rules: RULES.REQUIRED_ENGLISH_AND_NUMBER,
            name: 'code',
            placeholder: 'Код',
        },
    ],
    [
        {
            label: 'Отображаемое имя',
            type: FORM_TYPES.MAIN_INFO_INPUT,
            span: 16,
            rules: RULES.REQUIRED,
            name: 'displayName',
            placeholder: 'Отображаемое имя',
        },
    ]
];

export const formElements = [
    [
        {
            label: 'Токен Яндекс Метрики',
            type: FORM_TYPES.INPUT,
            span: 8,
            rules: RULES.STANDARD_NUMBER,
            name: 'ym_token',
            placeholder: 'Токен',
            maxLength: 12,
        },
        {
            label: 'Сессия сотрудника (в секундах)',
            type: FORM_TYPES.INPUT,
            span: 8,
            rules: RULES.STANDARD_NUMBER,
            name: 'token_lifetime',
            placeholder: '1800 секунд по умолчанию',
            maxLength: 12,
        },
        {
            label: 'Сессия клиента (в секундах)',
            type: FORM_TYPES.INPUT,
            span: 8,
            rules: RULES.STANDARD_NUMBER,
            name: 'inactivity_time',
            placeholder: '15 секунд по умолчанию',
            maxLength: 12,
        },
    ],

    [
        {
            label: 'Показ предложения в "карусели" (в секундах)',
            type: FORM_TYPES.INPUT,
            span: 8,
            rules: RULES.STANDARD_NUMBER,
            name: 'promo_show_time',
            placeholder: '20 секунд по умолчанию',
            maxLength: 12,
        },
        {
            label: 'Максимальное число попыток входа',
            type: FORM_TYPES.INPUT,
            span: 8,
            rules: RULES.TWO_DIGITS_NUMBER,
            name: 'max_password_attempts',
            placeholder: '3 по умолчанию',
            maxLength: 2,
        },
        {
            label: 'Временная блокировка пользователя (в секундах)',
            type: FORM_TYPES.INPUT,
            span: 8,
            rules: RULES.STANDARD_NUMBER,
            name: 'tmp_block_time',
            placeholder: '1800 секунд по умолчанию',
            maxLength: 12,
        },
    ],

    [
        {
            label: 'Максимальное число подарков',
            type: FORM_TYPES.INPUT,
            span: 8,
            rules: RULES.TWO_DIGITS_NUMBER,
            name: 'max_presents_number',
            placeholder: '3 по умолчанию',
            maxLength: 2,
        },
        {
            label: 'Путь к инструкции по установке',
            type: FORM_TYPES.INPUT,
            span: 8,
            rules: RULES.STANDARD,
            name: 'installation_url',
            placeholder: 'url',
        },
        {
            label: 'Путь к инструкции по использованию',
            type: FORM_TYPES.INPUT,
            span: 8,
            rules: RULES.STANDARD,
            name: 'usage_url',
            placeholder: 'url',
        },
    ],

    [
        {
            label: 'Политика конфиденциальности',
            type: FORM_TYPES.TEXT_BLOCK,
            span: 13,
            rows: 3,
            rules: RULES.STANDARD,
            name: 'privacyPolicy',
            placeholder: 'Описание ДЗО',
        },
        {
            label: 'Способ авторизации в витрине',
            type: FORM_TYPES.CHECKBOX_GROUP,
            options: APP_LOGIN_TYPES,
            rules: RULES.CHECKBOX_REQUIRED,
            columnMode: true,
            span: 11,
            name: 'login_types',
        },
    ],
    [
        {
            label: 'Механика',
            type: FORM_TYPES.CHECKBOX_GROUP,
            span: 24,
            rules: RULES.CHECKBOX,
            options: MECHANICS_CHECKBOXES,
            name: 'mechanics',
        },
    ]
];