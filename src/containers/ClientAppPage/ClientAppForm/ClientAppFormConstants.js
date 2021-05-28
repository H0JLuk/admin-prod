import { LOGIN_TYPE_OPTIONS } from '../../../constants/loginTypes';
import {
    APP_MECHANICS,
    MECHANICS_CHECKBOXES,
    MECHANICS_ERROR,
    NOTIFICATION_TYPES,
} from '../../../constants/clientAppsConstants';
import { showCount } from '../../../constants/common';
import { getPatternAndMessage } from '../../../utils/validators';

const defaultImg = 'default_main_illustration';
const february23 = 'February23_main_illustration';
const march8 = 'March8_main_illustration';

export const CREATE_APP_TITLE = 'Новое приложение';
export const CANCEL_BUTTON_TITLE = 'Отменить';
export const ADD_BUTTON_TITLE = 'Добавить';
export const PROPERTIES_TITLE = 'Свойства';
export const EDIT_BUTTON_LABEL = 'Сохранить';
export const DESIGN_RADIO_TITLE = 'Оформление';
export const PROPERTIES_RADIO_TITLE = 'Свойства';
export const SUCCESS_MESSAGE = 'Операция завершена';
export const ERROR_MESSAGE = 'Ошибка';
export const SUCCESS_DESIGN_UPDATE_DESCRIPTION = 'Оформление для клиентского приложения успешно обновлено';
export const SUCCESS_PROPERTIES_UPDATE_DESCRIPTION = 'Настройки клиентского приложения успешно обновлены';
export const SUCCESS_PROPERTIES_CREATE_DESCRIPTION = 'Клиентское приложение успешно создано';
export const BACKEND_ERROR_ALREADY_EXIST_ENDING = 'already exists';

export const EDIT_MODE = {
    DESIGN: 'Оформление',
    PROPERTIES: 'Свойства',
};

export const keysToString = ['mechanics', 'login_types', 'where_to_use', 'design_elements', 'notification_types'];

const numberTransform = value => value ? Number(value) : '';

export const TextKeysWithDefaultValues = ['home_page_header_present', 'home_page_header_wow'];

const checkBoxValidator = (_, value) => {
    if (
        value.includes(APP_MECHANICS.PRESENTS.value) ||
        value.includes(APP_MECHANICS.ECOSYSTEM.value) ||
        value.includes(APP_MECHANICS.BUNDLE.value)
    ) {
        return Promise.resolve();
    }
    return Promise.reject(MECHANICS_ERROR);
};

const DEFAULT_BANNER = {
    vitrina_theme: defaultImg,
    gradient: '228.35deg, #eaef00 7.94%, #cbea0a 15.79%, #9cdd16 21.25%, #5dca23 28.58%, #00b944 38.54%, #00a3a7 57.42%, #009bc5 64.31%, #0096d3 67.8%, #018fdb 72.33%, #0489d6 76.41%, #047fcf 82.5%, #0073c8 87.4%, #0051b7 99.87%',
    design_elements: [],
};

export const BANNER_KEYS = Object.keys(DEFAULT_BANNER);

export const banners = [
    { ...DEFAULT_BANNER },
    {
        vitrina_theme: february23,
        gradient: '262.6deg, #9cdd16 -9.99%, #84e73b 7.47%, #7dea44 13.24%, #18cd6d 32.14%, #06ac9a 43.29%, #00a3a7 51.61%, #00a0b2 57.73%, #0098b6 67.72%, #0073c8 90.72%',
        design_elements: [],
    },
    {
        vitrina_theme: march8,
        gradient: '269.17deg, #ffeb37 3.13%, #ff8c39 50.88%, #f01d71 99.82%',
        design_elements: [],
    },
];

export const DEFAULT_DESIGN_SETTINGS = {
    ...DEFAULT_BANNER,
    home_page_header: 'Сбер изменился, чтобы стать еще ближе к вам',
};

export const designKeysForCheck = [...Object.keys(DEFAULT_DESIGN_SETTINGS), ...TextKeysWithDefaultValues];

const REQUIRED_VALIDATE_MESSAGE = 'Это обязательное поле';
const NUMBER_VALIDATE_MESSAGE = 'Значение может быть только числовым';

export const RULES = {
    REQUIRED: { required: true, message: REQUIRED_VALIDATE_MESSAGE, validateTrigger: 'onSubmit' },
    NUMBER: { type: 'number', message: NUMBER_VALIDATE_MESSAGE, transform: numberTransform, validateTrigger: 'onSubmit' },
    get CHECKBOX_GROUP() {
        return { ...this.REQUIRED, type: 'array' };
    },
};

export const FORM_TYPES = {
    INPUT: 'INPUT',
    CHECKBOX_GROUP: 'CHECKBOX_GROUP',
    TEXT_AREA: 'TEXT_AREA',
    BANNER: 'BANNER',
    SELECT: 'SELECT',
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
            type: FORM_TYPES.INPUT,
            span: 16,
            rules: [
                RULES.REQUIRED,
                {
                    ...getPatternAndMessage('clientApp', 'name'),
                    validateTrigger: 'onSubmit',
                },
            ],
            name: 'name',
            placeholder: 'Имя',
        },
        {
            label: 'Код',
            type: FORM_TYPES.INPUT,
            span: 8,
            rules: [
                RULES.REQUIRED,
                {
                    ...getPatternAndMessage('clientApp', 'code'),
                    validateTrigger: 'onSubmit',
                },
            ],
            name: 'code',
            placeholder: 'Код',
        },
    ],
    [
        {
            label: 'Отображаемое имя',
            type: FORM_TYPES.INPUT,
            span: 16,
            canEdit: true,
            rules: [
                RULES.REQUIRED,
                {
                    ...getPatternAndMessage('clientApp', 'name'),
                    validateTrigger: 'onSubmit',
                },
            ],
            name: 'displayName',
            placeholder: 'Отображаемое имя',
        },
    ]
];

export const formElements = [
    [
        {
            label: 'Сессия сотрудника (в секундах)',
            type: FORM_TYPES.INPUT,
            span: 8,
            rules: [
                RULES.NUMBER,
            ],
            name: 'token_lifetime',
            placeholder: '1800 секунд по умолчанию',
            maxLength: 12,
        },
        {
            label: 'Сессия клиента (в секундах)',
            type: FORM_TYPES.INPUT,
            span: 8,
            rules: [
                RULES.NUMBER,
            ],
            name: 'inactivity_time',
            placeholder: '15 секунд по умолчанию',
            maxLength: 12,
        },
        {
            label: 'Временная блокировка пользователя (в секундах)',
            type: FORM_TYPES.INPUT,
            span: 8,
            rules: [
                RULES.NUMBER,
            ],
            name: 'tmp_block_time',
            placeholder: '1800 секунд по умолчанию',
            maxLength: 12,
        },
    ],

    [
        {
            label: 'Максимальное число попыток входа',
            type: FORM_TYPES.INPUT,
            span: 8,
            rules: [
                RULES.NUMBER,
            ],
            name: 'max_password_attempts',
            placeholder: '3 по умолчанию',
            maxLength: 2,
        },
        {
            label: 'Максимальное число подарков',
            type: FORM_TYPES.INPUT,
            span: 8,
            rules: [
                RULES.NUMBER,
            ],
            name: 'max_presents_number',
            placeholder: '3 по умолчанию',
            maxLength: 2,
        },
    ],

    [
        {
            label: 'Политика конфиденциальности',
            type: FORM_TYPES.TEXT_AREA,
            span: 13,
            rows: 3,
            rules: [
                {
                    ...getPatternAndMessage('clientApp', 'privacyPolicy'),
                    validateTrigger: 'onSubmit',
                }
            ],
            name: 'privacyPolicy',
            placeholder: 'Описание ДЗО',
        },
        {
            label: 'Способ авторизации в витрине',
            type: FORM_TYPES.CHECKBOX_GROUP,
            options: LOGIN_TYPE_OPTIONS,
            rules: [
                RULES.CHECKBOX_GROUP,
            ],
            columnMode: true,
            span: 11,
            name: 'login_types',
        },
    ],
    [
        {
            label: 'Механика',
            type: FORM_TYPES.CHECKBOX_GROUP,
            span: 13,
            rules: [
                RULES.CHECKBOX_GROUP,
                {
                    validator: checkBoxValidator,
                    validateTrigger: 'onSubmit',
                }
            ],
            options: MECHANICS_CHECKBOXES,
            name: 'mechanics',
        },
        {
            label: 'Способ отправки сообщений клиенту',
            type: FORM_TYPES.CHECKBOX_GROUP,
            span: 11,
            options: NOTIFICATION_TYPES,
            name: 'notification_types',
        },
    ]
];

export const designElements = [
    [
        {
            label: 'Текст для главной(Продукты)',
            type: FORM_TYPES.TEXT_AREA,
            span: 12,
            rows: 3,
            maxLength: 70,
            showCount,
            name: 'home_page_header',
            placeholder: 'Текст для главной(Продукты)',
        },
        {
            label: 'Текст для главной(Подарки)',
            type: FORM_TYPES.TEXT_AREA,
            span: 12,
            rows: 3,
            maxLength: 70,
            showCount,
            name: 'home_page_header_present',
            placeholder: 'Текст для главной(Подарки)',
        },
    ],
    [
        {
            label: 'Текст для главной(WOW)',
            type: FORM_TYPES.TEXT_AREA,
            span: 12,
            rows: 3,
            maxLength: 70,
            showCount,
            name: 'home_page_header_wow',
            placeholder: 'Текст для главной(WOW)',
        },
        {
            label: 'Тема',
            type: FORM_TYPES.BANNER,
            span: 12,
            name: 'home_page_theme',
        },
    ],
];
