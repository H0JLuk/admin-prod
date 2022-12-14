import {
    APP_MECHANIC,
    GAME_MECHANIC_OPTIONS,
    APP_MECHANIC_OPTIONS,
    MECHANICS_ERROR,
    NOTIFICATION_TYPES_OPTIONS,
} from '@constants/clientAppsConstants';
import { LOGIN_TYPE_OPTIONS } from '@constants/loginTypes';
import { showCount } from '@constants/common';
import { FORM_RULES, getPatternAndMessage } from '@utils/validators';
import { ValidatorRule } from 'rc-field-form/lib/interface';
import { FormItemProps, InputProps, SelectProps } from 'antd';
import { CheckboxGroupProps, CheckboxProps } from 'antd/lib/checkbox';
import { TextAreaProps } from 'antd/lib/input';
import { BannerProps } from './MainPageDesign/Banner';
import { trimValue } from '@utils/helper';
import Themes from '@constants/themes';

export const CREATE_APP_TITLE = 'Новое приложение';
export const PROPERTIES_TITLE = 'Свойства';
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
export const CONSENT_FOR_APPLICATION = 'Согласие';
export const CONSENT_FOR_APP_PLACEHOLDER = 'Выберите согласие';
export const BUNDLE = 'Бандл';
export const BUNDLE_NAME = 'Имя переключателя';

export const EDIT_MODE = {
    DESIGN: 'Оформление',
    PROPERTIES: 'Свойства',
};

export const keysToString = [
    'mechanics',
    'login_types',
    'notification_types',
    'game_mechanics',
];

const mechanicsValidator: ValidatorRule['validator'] = (_, value) => {
    const requiredMechanics = [APP_MECHANIC.PRESENTS, APP_MECHANIC.ECOSYSTEM, APP_MECHANIC.BUNDLE, APP_MECHANIC.EXPRESS, APP_MECHANIC.MIX];
    const hasRequiredMechanic = requiredMechanics.some(mechanic => value.includes(mechanic));
    return hasRequiredMechanic ? Promise.resolve() : Promise.reject(MECHANICS_ERROR);
};

export const banners = Object.values(Themes);

export enum FORM_TYPES {
    INPUT = 'INPUT',
    CHECKBOX_GROUP = 'CHECKBOX_GROUP',
    CHECKBOX = 'CHECKBOX',
    TEXT_AREA = 'TEXT_AREA',
    BANNER = 'BANNER',
    SELECT = 'SELECT',
    FORM_GROUP = 'FORM_GROUP',
}

export enum SETTINGS_TYPES {
    CREATE = 'create',
    EDIT = 'edit',
}

export enum FORM_MODES {
    NEW = 'new',
    EDIT = 'edit',
}

export type CommonFormConstructorItem = Pick<FormItemProps, 'rules' | 'normalize' | 'valuePropName'> & {
    label?: string;
    span: number | string;
    name: string;
    canEdit?: boolean;
    hideWhenCreate?: boolean;
    isFormGroup?: boolean;
    items?: FormConstructorItem[][];
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

export type FormConstructorCheckbox = CheckboxProps & {
    type: FORM_TYPES.CHECKBOX;
    title?: string;
};

export type FormConstructorFormGroup = {
    type: FORM_TYPES.FORM_GROUP;
};

export type FormConstructorFormItem =
    FormConstructorInput |
    FormConstructorCheckboxGroup |
    FormConstructorTextArea |
    FormConstructorBanner |
    FormConstructorCheckbox |
    FormConstructorFormGroup |
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
                FORM_RULES.REQUIRED,
                {
                    ...getPatternAndMessage('clientApp', 'name'),
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
                FORM_RULES.REQUIRED,
                {
                    ...getPatternAndMessage('clientApp', 'code'),
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
                FORM_RULES.REQUIRED,
                {
                    ...getPatternAndMessage('clientApp', 'name'),
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
                FORM_RULES.NUMBER,
            ],
            normalize: trimValue,
            name: 'token_lifetime',
            placeholder: '1800 секунд по умолчанию',
            maxLength: 12,
        },
        {
            label: 'Сессия клиента (в секундах)',
            type: FORM_TYPES.INPUT,
            span: 8,
            rules: [
                FORM_RULES.NUMBER,
            ],
            normalize: trimValue,
            name: 'inactivity_time',
            placeholder: '15 секунд по умолчанию',
            maxLength: 12,
        },
        {
            label: 'Временная блокировка пользователя (в секундах)',
            type: FORM_TYPES.INPUT,
            span: 8,
            rules: [
                FORM_RULES.NUMBER,
            ],
            normalize: trimValue,
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
                FORM_RULES.NUMBER,
            ],
            normalize: trimValue,
            name: 'referralTokenLifetime',
            placeholder: '30 секунд по умолчанию',
            maxLength: 12,
            hideWhenCreate: true,
        },
        {
            label: 'Максимальное число попыток входа',
            type: FORM_TYPES.INPUT,
            span: 8,
            rules: [
                FORM_RULES.NUMBER,
            ],
            normalize: trimValue,
            name: 'max_password_attempts',
            placeholder: '3 по умолчанию',
            maxLength: 2,
        },
        {
            label: 'Максимальное число подарков',
            type: FORM_TYPES.INPUT,
            span: 8,
            rules: [
                FORM_RULES.NUMBER,
            ],
            normalize: trimValue,
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
                FORM_RULES.REQUIRED_ARRAY,
                {
                    validator: mechanicsValidator,
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
        },
    ],
    [
        {
            label: 'Способ авторизации в витрине',
            type: FORM_TYPES.CHECKBOX_GROUP,
            options: LOGIN_TYPE_OPTIONS,
            rules: [
                FORM_RULES.REQUIRED_ARRAY,
            ],
            columnMode: true,
            span: 12,
            name: 'login_types',
        },
        {
            type: FORM_TYPES.FORM_GROUP,
            span: 12,
            name: '',
            isFormGroup: true,
            items: [
                [{
                    label: 'Способ отправки сообщений клиенту',
                    type: FORM_TYPES.CHECKBOX_GROUP,
                    span: 24,
                    options: NOTIFICATION_TYPES_OPTIONS,
                    name: 'notification_types',
                }], [{
                    title: 'Самому себе',
                    type: FORM_TYPES.CHECKBOX,
                    span: 24,
                    valuePropName: 'checked',
                    name: 'client_notification_enabled',
                }], [{
                    title: 'Подарок другу',
                    type: FORM_TYPES.CHECKBOX,
                    span: 24,
                    valuePropName: 'checked',
                    name: 'friend_notification_enabled',
                }], [{
                    label: 'Кол-во подарков',
                    type: FORM_TYPES.INPUT,
                    span: 12,
                    placeholder: 'По умолчанию',
                    name: 'offer_limit',
                }]],
        },
    ],
];

export const designElements: FormConstructorItem[][] = [
    [
        {
            label: 'Заголовок для главной "Продукты"',
            type: FORM_TYPES.TEXT_AREA,
            span: 12,
            rows: 3,
            maxLength: 60,
            showCount,
            name: 'home_page_header',
            placeholder: 'Заголовок для главной "Продукты"',
        },
        {
            label: 'Заголовок для главной "Подарки"',
            type: FORM_TYPES.TEXT_AREA,
            span: 12,
            rows: 3,
            maxLength: 60,
            showCount,
            name: 'home_page_header_present',
            placeholder: 'Заголовок для главной "Подарки"',
        },
    ],
    [
        {
            label: 'Заголовок для главной "ВАУ"',
            type: FORM_TYPES.TEXT_AREA,
            span: 12,
            rows: 3,
            maxLength: 60,
            showCount,
            name: 'home_page_header_bundle',
            placeholder: 'Заголовок для главной "ВАУ"',
        },
        {
            label: 'Заголовок для главной "Микс"',
            type: FORM_TYPES.TEXT_AREA,
            span: 12,
            rows: 3,
            maxLength: 60,
            name: 'home_page_header_mix',
            rules: [
                {
                    ...getPatternAndMessage('clientApp', 'headerMix'),
                    validateTrigger: 'onSubmit',
                },
            ],
            placeholder: 'Заголовок для главной "Микс"',
        },
    ],
];

export const designTheme = [
    {
        label: 'Тема для витрины',
        type: FORM_TYPES.BANNER,
        span: 12,
        name: 'vitrina_theme',
    },
];
