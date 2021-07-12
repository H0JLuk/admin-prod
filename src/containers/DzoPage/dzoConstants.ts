import { UploadPictureProps } from '@components/UploadPicture';
import { FORM_RULES, getPatternAndMessage } from '@utils/validators';
import { DzoApplication, DzoDto } from '@types';
import { BANNER_TYPE } from '@constants/common';

export interface IDzoInfoRow {
    label: string;
    type?: string;
    key: keyof Omit<DzoApplication, 'dzoId' | 'deleted' | 'applicationId'>;
}

export interface IDzoBannersRow {
    type: BANNER_TYPE;
    label: string;
}

export interface IMainDataRow {
    label: string;
    key: keyof Omit<DzoDto, 'applicationList' | 'dzoBannerList' | 'dzoId' | 'deleted'>;
}

type BannersUploadTemplate = Pick<UploadPictureProps, 'accept' | 'type' | 'description' | 'maxFileSize' | 'setting'> & {
    label: string;
    name: string[];
};

export const NEW_DZO_TITLE = 'Новое ДЗО';
export const VALIDATION_TEXT = 'Заполните обязательное поле';
export const URL_VALIDATION_TEXT = 'Введите url в формате http://site.ru';
export const DELETE_CONFIRMATION_MODAL_TITLE = 'Вы действительно хотите удалить ДЗО';
export const LINK_VIDEO_LABEL = 'Ссылка на видеоэкскурсию';
export const LINK_INPUT_PLACEHOLDER = 'Укажите ссылку';
export const QR_LINK_LABEL = 'Ссылка для QR-кода';
export const APP_TYPE_LABEL = 'Тип приложения';
export const APP_TYPE_PLACEHOLDER = 'Выберите приложение';
export const APP_TYPE_ALREADY_SELECTED = 'Нельзя выбрать два одинаковых приложения';
export const DZO_CODE_NOT_UNIQUE = 'ДЗО с таким кодом уже есть!';
export const DZO_NAME = 'Название';
export const DZO_CODE = 'Код';
export const DZO_DESCRIPTION = 'Описание';
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
                FORM_RULES.REQUIRED,
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
                FORM_RULES.REQUIRED,
                {
                    ...getPatternAndMessage('dzo', 'code'),
                    validateTrigger: 'onSubmit',
                },
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
                },
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
        name: ['dzoBannerList', BANNER_TYPE.LOGO_MAIN],
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
        name: ['dzoBannerList', BANNER_TYPE.LOGO_SECONDARY],
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
        name: ['dzoBannerList', BANNER_TYPE.LOGO_ICON],
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
        type: BANNER_TYPE.LOGO_MAIN,
        label: 'Логотип (цветной)',
    },
    {
        type: BANNER_TYPE.LOGO_SECONDARY,
        label: 'Логотип (белый)',
    },
    {
        type: BANNER_TYPE.LOGO_ICON,
        label: 'Иконка',
    },
];
