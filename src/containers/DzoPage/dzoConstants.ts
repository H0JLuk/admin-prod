import { UploadPictureProps } from '@components/UploadPicture';
import { getPatternAndMessage } from '@utils/validators';
import { dzoBannerTypes, DzoApplication, IDzoItem } from '@types';
import { Rule } from 'rc-field-form/lib/interface';

export interface IDzoInfoRow {
    label: string;
    type?: string;
    key: keyof Omit<DzoApplication, 'dzoId' | 'deleted' | 'applicationId'>;
}

export interface IDzoBannersRow {
    type: keyof typeof dzoBannerTypes;
    label: string;
}

export interface IMainDataRow {
    label: string;
    key: keyof Omit<IDzoItem, 'applicationList' | 'dzoBannerList' | 'dzoId' | 'deleted'>;
}

type BannersUploadTemplate = Pick<UploadPictureProps, 'accept' | 'type' | 'description' | 'maxFileSize' | 'setting'> & {
    label: string;
    name: string[];
};

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

export const RULES: Record<string, Rule[]> = {
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
            rules: [
                ...RULES.STANDARD_REQUIRED,
                {
                    ...getPatternAndMessage('dzo', 'name'),
                    validateTrigger: 'onSubmit',
                },
            ],
            name: 'dzoName',
            placeholder: DZO_NAME,
        },
        {
            label: 'Код',
            type: TYPES.INPUT,
            rules: [
                ...RULES.STANDARD_REQUIRED,
                {
                    ...getPatternAndMessage('dzo', 'code'),
                    validateTrigger: 'onSubmit',
                }
            ],
            name: 'dzoCode',
            placeholder: 'Код',
        },
    ],
    [
        {
            label: 'Описание ДЗО',
            type: TYPES.TEXT_BLOCK,
            rules: [
                {
                    ...getPatternAndMessage('dzo', 'description'),
                    validateTrigger: 'onSubmit',
                }
            ],
            name: 'description',
            placeholder: 'Описание ДЗО',
        },
    ],
];

export const BANNERS_UPLOAD_TEMPLATE: BannersUploadTemplate[] = [
    {
        label: 'Логотип (цветной)',
        accept: '.svg',
        name: ['dzoBannerList', 'LOGO_MAIN'],
        type: 'logo',
        description: 'Добавить логотип',
        maxFileSize: 1,
        get setting() {
            return `${this.maxFileSize}МБ ${this.accept}`;
        },
    },
    {
        label: 'Логотип (белый)',
        accept: '.svg',
        name: ['dzoBannerList', 'LOGO_SECONDARY'],
        type: 'logo',
        description: 'Добавить логотип',
        maxFileSize: 1,
        get setting() {
            return `${this.maxFileSize}МБ ${this.accept}`;
        },
    },
    {
        label: 'Иконка',
        accept: '.svg',
        name: ['dzoBannerList', 'LOGO_ICON'],
        type: 'logo',
        description: 'Добавить логотип',
        maxFileSize: 1,
        get setting() {
            return `${this.maxFileSize}МБ ${this.accept}`;
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

export const DZO_INFO_TEMPLATE_DATA: IMainDataRow[][] = [
    [
        { key: 'dzoName', label: DZO_NAME },
        { key: 'dzoCode', label: DZO_CODE },
    ],
    [
        { key: 'description', label: DZO_DESCRIPTION },
    ],
];

export const DZO_INFO_APPS_TEMPLATE: IDzoInfoRow[] = [
    { key: 'applicationType', label: APP_TYPE_LABEL },
    { key: 'applicationUrl', label: QR_LINK_LABEL, type: 'url' },
];

export const DZO_BANNERS_TEMPLATE: IDzoBannersRow[] = [
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
