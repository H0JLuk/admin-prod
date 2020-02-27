import { isRequired, digitValidator } from '../../utils/validators';

export const LOGIN_FORM = {
    personalNumber: {
        label: 'Табельный номер',
        value: '',
        type: 'text',
        isRequired: true,
        maxLength: 30,
        validators: [isRequired, digitValidator],
        mask: null
    },
    password: {
        label: 'Пароль',
        value: '',
        type: 'password',
        isRequired: true,
        maxLength: 30,
        validators: [isRequired],
        mask: null
    }
};

export const NEW_USER_FORM = {
    personalNumber: {
        label: 'Табельный номер',
        value: '',
        type: 'text',
        isRequired: true,
        maxLength: 30,
        validators: [isRequired, digitValidator],
        mask: null
    }
};

export const LANDING_EDIT_FORM = {
    header: {
        label: 'Header',
        value: '',
        type: 'text',
        isRequired: true,
        maxLength: 128,
        validators: [isRequired],
        mask: null
    },
    description: {
        label: 'Description',
        value: '',
        type: 'text',
        isRequired: true,
        maxLength: 4096,
        validators: [isRequired],
        mask: null
    }
};

export const CATEGORY_ADD_FROM = {
    categoryName: {
        label: 'Имя категории',
        value: '',
        type: 'text',
        isRequired: true,
        maxLength: 2048,
        validators: [isRequired],
        mask: null
    },
    categoryDescription: {
        label: 'Описание категории',
        value: '',
        type: 'text',
        isRequired: true,
        maxLength: 2048,
        validators: [isRequired],
        mask: null
    }
};
export const CATEGORY_EDIT_FROM = {
    categoryName: {
        label: 'Имя категории',
        value: '',
        type: 'text',
        isRequired: true,
        maxLength: 2048,
        validators: [isRequired],
        mask: null
    },
    categoryDescription: {
        label: 'Описание категории',
        value: '',
        type: 'text',
        isRequired: true,
        maxLength: 2048,
        validators: [isRequired],
        mask: null
    }
};
export const DZO_ADD_FROM = {
    dzoName: {
        label: 'Имя ДЗО',
        value: '',
        type: 'text',
        isRequired: true,
        maxLength: 2048,
        validators: [isRequired],
        mask: null
    },
    header: {
        label: 'Хэдер ДЗО',
        value: '',
        type: 'text',
        isRequired: false,
        maxLength: 2048,
        validators: [],
        mask: null
    },
    description: {
        label: 'Описание ДЗО',
        value: '',
        type: 'text',
        isRequired: false,
        maxLength: 2048,
        validators: [],
        mask: null
    },
    dzoCode: {
        label: 'Код ДЗО',
        value: '',
        type: 'text',
        isRequired: true,
        maxLength: 2048,
        validators: [isRequired],
        mask: null
    },
    webUrl: {
        label: 'Web адрес ДЗО',
        value: '',
        type: 'text',
        isRequired: false,
        maxLength: 2048,
        validators: [],
        mask: null
    },

};
export const DZO_EDIT_FROM = {
    dzoName: {
        label: 'Имя ДЗО (read only)',
        value: '',
        type: 'text',
        disabled: true,
        isRequired: true,
        maxLength: 2048,
        validators: [isRequired],
        mask: null
    },
    header: {
        label: 'Header',
        value: '',
        type: 'text',
        isRequired: false,
        maxLength: 2048,
        validators: [],
        mask: null
    },
    description: {
        label: 'Описание ДЗО',
        value: '',
        type: 'text',
        isRequired: false,
        maxLength: 2048,
        validators: [],
        mask: null
    },
    dzoCode: {
        label: 'Код ДЗО (read only)',
        value: '',
        type: 'text',
        disabled: true,
        isRequired: true,
        maxLength: 2048,
        validators: [isRequired],
        mask: null
    },
    webUrl: {
        label: 'Web URL',
        value: '',
        type: 'text',
        isRequired: false,
        maxLength: 2048,
        validators: [],
        mask: null
    }
};
export const APP_EDIT_FROM = {
    dzoName: {
        label: 'Имя ДЗО (read only)',
        value: '',
        type: 'text',
        disabled: true,
        isRequired: true,
        maxLength: 2048,
        validators: [isRequired],
        mask: null
    },
};
