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

export const CHANGE_USER_FORM = {
    personalNumber: {
        label: 'Табельный номер',
        value: '',
        type: 'text',
        isRequired: true,
        maxLength: 8,
        validators: [isRequired, digitValidator],
        mask: null,
    },
    salePointName: {
        label: 'Точка продажи',
        value: '',
        type: 'text',
        isRequired: false,
        maxLength: 14,
        validators: [],
        mask: null,
    },

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

export const CATEGORY_FORM = {
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
        isRequired: false,
        maxLength: 2048,
        validators: [],
        mask: null
    }
};

export const CLIENT_APP_ADD_FORM = {
    name: {
        label : 'имя',
        value: '',
        type: 'text',
        isRequired: true,
        maxLength: 128,
        validators: [isRequired],
        mask: null
    },
    code: {
        label : 'код',
        value: '',
        type: 'text',
        isRequired: true,
        maxLength: 40,
        validators: [isRequired],
        mask: null
    },
    existingCode: {
        label : 'Код исходной витрины',
        value: '',
        type: 'text',
        maxLength: 40,
        validators: [],
        mask: null
    }
};

export const CLIENT_APP_EDIT_FORM = {
    name: {
        label : 'имя',
        value: '',
        type: 'text',
        isRequired: true,
        maxLength: 128,
        validators: [isRequired],
        mask: null
    },
    code: {
        label : 'код',
        value: '',
        type: 'text',
        isRequired: true,
        maxLength: 40,
        validators: [isRequired],
        mask: null
    }
};

export const CLIENT_APP_PROPERTIES_EDIT_FORM = {
    yamToken: {
        label : 'Токен яндекс метрики',
        value : '',
        type: 'text',
        isRequired: false,
        maxLength: 20,
        validators: [digitValidator],
        mask: null,
    },
    tokenLifetime: {
        label : 'Сессия сотрудника (в секундах)',
        value : '',
        type: 'text',
        isRequired: false,
        maxLength: 20,
        validators: [digitValidator],
        mask: null,
        placeholder: '1800 секунд по умолчанию',
    },
    inactivityTime: {
        label : 'Сессия клиента (в секундах)',
        value : '',
        type: 'text',
        isRequired: false,
        maxLength: 20,
        validators: [digitValidator],
        mask: null,
        placeholder: '15 секунд по умолчанию',
    },
    promoShowTime: {
        label : 'Показ предложения в "карусели" (в секундах)',
        value : '',
        type: 'text',
        isRequired: false,
        maxLength: 20,
        validators: [digitValidator],
        mask: null,
        placeholder: '20 секунд по умолчанию',
    },
    privacyPolicy: {
        label : 'Политика конфиденциальности',
        value : '',
        type: 'text',
        isRequired: true,
        maxLength: 4096,
        validators: [isRequired],
        mask: null,
    },
    tmpBlockTime: {
        label : 'Временная блокировка пользователя (в секундах)',
        value : '',
        type: 'text',
        isRequired: false,
        maxLength: 20,
        validators: [digitValidator],
        mask: null,
        placeholder: '1800 секунд по умолчанию',
    },
    maxPasswordAttempts: {
        label : 'Максимальное число попыток ввода пароля',
        value : '',
        type: 'text',
        isRequired: false,
        maxLength: 2,
        validators: [digitValidator],
        mask: null,
        placeholder: '3 по умолчанию',
    },
    maxPresentsNumber: {
        label : 'Максимальное число подарков',
        value : '',
        type: 'text',
        isRequired: false,
        maxLength: 2,
        validators: [digitValidator],
        mask: null,
        placeholder: '3 по умолчанию',
    },
    installationUrl: {
        label : 'Путь к инструкции по установке',
        value : '',
        type: 'text',
        isRequired: false,
        maxLength: 256,
        validators: [],
        mask: null,
    },
    usageUrl: {
        label : 'Путь к инструкции по использованию',
        value : '',
        type: 'text',
        isRequired: false,
        maxLength: 256,
        validators: [],
        mask: null,
    },
};

export const DZO_ADD_FROM = {
    dzoName: {
        label: 'Имя ДЗО',
        value: '',
        type: 'text',
        isRequired: true,
        maxLength: 128,
        validators: [isRequired],
        mask: null
    },
    header: {
        label: 'Хэдер ДЗО',
        value: '',
        type: 'text',
        isRequired: false,
        maxLength: 512,
        validators: [],
        mask: null
    },
    description: {
        label: 'Описание ДЗО',
        value: '',
        type: 'text',
        isRequired: false,
        maxLength: 4096,
        validators: [],
        mask: null
    },
    dzoCode: {
        label: 'Код ДЗО',
        value: '',
        type: 'text',
        isRequired: true,
        maxLength: 40,
        validators: [isRequired],
        mask: null
    },
    webUrl: {
        label: 'Ссылка на сайт ДЗО',
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
        maxLength: 128,
        validators: [isRequired],
        mask: null
    },
    header: {
        label: 'Header',
        value: '',
        type: 'text',
        isRequired: false,
        maxLength: 512,
        validators: [],
        mask: null
    },
    description: {
        label: 'Описание ДЗО',
        value: '',
        type: 'text',
        isRequired: false,
        maxLength: 4096,
        validators: [],
        mask: null
    },
    dzoCode: {
        label: 'Код ДЗО (read only)',
        value: '',
        type: 'text',
        disabled: true,
        isRequired: true,
        maxLength: 40,
        validators: [isRequired],
        mask: null
    },
    webUrl: {
        label: 'Ссылка на сайт ДЗО',
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

export const PDF_EDIT_FORM = {
    pdfName: {
        value: '',
        type: 'text',
        disabled: true,
        isRequired: true,
        maxLength: 2048,
        validators: [isRequired],
        mask: null
    },
};
