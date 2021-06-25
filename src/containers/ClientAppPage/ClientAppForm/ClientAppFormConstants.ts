import {
    APP_MECHANIC,
    GAME_MECHANIC_OPTIONS,
    APP_MECHANIC_OPTIONS,
    MECHANICS_ERROR,
    NOTIFICATION_TYPES_OPTIONS,
} from '@constants/clientAppsConstants';
import { LOGIN_TYPE_OPTIONS } from '@constants/loginTypes';
import { showCount } from '@constants/common';
import { getPatternAndMessage } from '@utils/validators';
import { ValidatorRule, Rule } from 'rc-field-form/lib/interface';
import { FormItemProps, InputProps, SelectProps } from 'antd';
import { CheckboxGroupProps } from 'antd/lib/checkbox';
import { TextAreaProps } from 'antd/lib/input';
import { BannerProps, IBanner } from './MainPageDesign/Banner';

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
export const BUSINESS_ROLE_FOR_APPLICATION = 'Бизнес-роль, для которой доступно приложение';
export const BUSINESS_ROLE_FOR_APP_PLACEHOLDER = 'Выберите роль/роли';

export const EDIT_MODE = {
    DESIGN: 'Оформление',
    PROPERTIES: 'Свойства',
};

export const keysToString = [
    'mechanics',
    'login_types',
    'where_to_use',
    'design_elements',
    'notification_types',
    'game_mechanics',
];

const numberTransform = (value: string) => value ? Number(value) : '';

export const TextKeysWithDefaultValues = ['home_page_header_present', 'home_page_header_wow'];

const checkBoxValidator: ValidatorRule['validator'] = (_, value) => {
    if (
        value.includes(APP_MECHANIC.PRESENTS) ||
        value.includes(APP_MECHANIC.ECOSYSTEM) ||
        value.includes(APP_MECHANIC.BUNDLE)
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

export const BANNER_KEYS = Object.keys(DEFAULT_BANNER) as (keyof IBanner)[];

export const banners: IBanner[] = [
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

type IDefaultDesignSettings = Record<string, string | string[]>;

export const DEFAULT_DESIGN_SETTINGS: IDefaultDesignSettings = {
    ...DEFAULT_BANNER,
    home_page_header: 'Сбер изменился, чтобы стать еще ближе к вам',
};

export const designKeysForCheck = [...Object.keys(DEFAULT_DESIGN_SETTINGS), ...TextKeysWithDefaultValues];

const REQUIRED_VALIDATE_MESSAGE = 'Это обязательное поле';
const NUMBER_VALIDATE_MESSAGE = 'Значение может быть только числовым';

export const RULES = {
    REQUIRED: {
        required: true,
        message: REQUIRED_VALIDATE_MESSAGE,
        validateTrigger: 'onSubmit',
    } as Rule,
    NUMBER: {
        type: 'number',
        message: NUMBER_VALIDATE_MESSAGE,
        transform: numberTransform,
        validateTrigger: 'onSubmit',
    } as Rule,
    get CHECKBOX_GROUP() {
        return {
            ...this.REQUIRED,
            type: 'array',
        } as Rule;
    },
};

export enum FORM_TYPES {
    INPUT = 'INPUT',
    CHECKBOX_GROUP = 'CHECKBOX_GROUP',
    TEXT_AREA = 'TEXT_AREA',
    BANNER = 'BANNER',
    SELECT = 'SELECT',
}

export enum SETTINGS_TYPES {
    CREATE = 'create',
    EDIT = 'edit',
}

export enum FORM_MODES {
    NEW ='new',
    EDIT = 'edit',
}

export type CommonFormConstructorItem = {
    label: string;
    span: number | string;
    rules?: FormItemProps['rules'];
    name: string;
    canEdit?: boolean;
};

export type FormConstructorInput = Omit<InputProps, 'type'> & {
    type: FORM_TYPES.INPUT;
};

export type FormConstructorCheckboxGroup = CheckboxGroupProps & {
    type: FORM_TYPES.CHECKBOX_GROUP;
    columnMode?: boolean;
};

export type FormConstructorTextArea = TextAreaProps & {
    type: FORM_TYPES.TEXT_AREA;
};

export type FormConstructorBanner = BannerProps & {
    type: FORM_TYPES.BANNER;
};

export type FormConstructorSelect = SelectProps<any> & {
    type: FORM_TYPES.SELECT;
};

export type FormConstructorFormItem =
    FormConstructorInput |
    FormConstructorCheckboxGroup |
    FormConstructorTextArea |
    FormConstructorBanner |
    FormConstructorSelect;

export type FormConstructorItem = FormConstructorFormItem & CommonFormConstructorItem;

export const PRIVACY_POLICY = {
    TITLE: 'Согласие на обработку персональных данных',
    VERSION: 'Версия',
    START_DATE: 'Начало действия',
    DETAILS: 'Подробнее',
    EMPTY_CONSENTS: 'Согласия для витрины отсутствуют',
    TO_CONSENTS_LIST: 'Перейти к списку согласий',
};

export const mainInfoElements: FormConstructorItem[][] = [
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
    ],
];

export const formElements: FormConstructorItem[][] = [
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
            label: 'Сессия referalLink (в секундах)',
            type: FORM_TYPES.INPUT,
            span: 8,
            rules: [
                RULES.NUMBER,
            ],
            name: 'referal_lifetime',
            placeholder: '30 секунд по умолчанию',
            maxLength: 12,
        },
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
            label: 'Механика',
            type: FORM_TYPES.CHECKBOX_GROUP,
            span: 12,
            rules: [
                RULES.CHECKBOX_GROUP,
                {
                    validator: checkBoxValidator,
                    validateTrigger: 'onSubmit',
                },
            ],
            options: APP_MECHANIC_OPTIONS,
            name: 'mechanics',
        },
        {
            label: 'Игровая механика',
            type: FORM_TYPES.CHECKBOX_GROUP,
            span: 12,
            options: GAME_MECHANIC_OPTIONS,
            name: 'game_mechanics',
        }
    ],
    [
        {
            label: 'Способ авторизации в витрине',
            type: FORM_TYPES.CHECKBOX_GROUP,
            options: LOGIN_TYPE_OPTIONS,
            rules: [
                RULES.CHECKBOX_GROUP,
            ],
            columnMode: true,
            span: 12,
            name: 'login_types',
        },
        {
            label: 'Способ отправки сообщений клиенту',
            type: FORM_TYPES.CHECKBOX_GROUP,
            span: 12,
            options: NOTIFICATION_TYPES_OPTIONS,
            name: 'notification_types',
        },
    ],
];

export const designElements: FormConstructorItem[][] = [
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
