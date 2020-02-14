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

export const SLIDER_EDIT_FORM = {
    // dzoId: {
    //     label: 'ДЗО ID',
    //     value: '',
    //     type: 'text',
    //     isRequired: true,
    //     maxLength: 20,
    //     validators: [isRequired],
    //     mask: null,
    // }
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
