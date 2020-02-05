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

export const SLIDER_EDIT_FROM = {
    dzoId: {
        label: 'ДЗО ID',
        value: '',
        type: 'text',
        isRequired: true,
        maxLength: 20,
        validators: [isRequired],
        mask: null
    }
};