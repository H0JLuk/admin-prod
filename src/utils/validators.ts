import { Rule } from 'antd/lib/form';
import { numberTransform } from './helper';

const commonMessage = 'кириллица, латинские буквы, цифры, и символы ".", "-", ",", "_"';
const commonPattern = /^[а-яё\s\w.,-]+$/i;
const commonRule = {
    pattern: commonPattern,
    message: commonMessage,
};
const codeRule = {
    pattern: /^[a-zA-Z_-]+$/,
    message: 'латинские буквы, "_", "-"',
};

export type PageFieldsValidate = Record<string, typeof commonRule>;

export const VALIDATE_FIELDS: Record<string, PageFieldsValidate> = {
    promoCampaign: {
        name: {
            pattern: /^[а-яё\s\w\-.,/:%()?!№"]+$/i,
            message: `${commonMessage}, "/", ":", "%", "(", ")", "?", "!", "№", """`,
        },
        textContent: {
            pattern: /^[а-яё\s\w\-.,/:%()?!№"₽]+$/i,
            message: `${commonMessage}, "/", ":", "%", "(", ")", "?", "!", "№", """, "₽"`,
        },
        detailsButtonLabel: commonRule,
    },
    clientApp: {
        name: commonRule,
        code: codeRule,
    },
    dzo: {
        name: commonRule,
        code: codeRule,
        description: commonRule,
    },
    category: {
        name: commonRule,
    },
    presentation: {
        common: {
            pattern: /^[а-яё\s\w.,/:%()?!№"-]+$/i,
            message: `${commonMessage}, "/", ":", "%", "(", ")", "?", "!", """, "№"`,
        },
    },
    salePoint: {
        name: {
            pattern: /^[а-яё0-9\s.,_-]+$/i,
            message: 'кириллица, цифры, ".", ",", "_", "-"',
        },
        description: {
            pattern: /^[а-яё\d\s.,\-_  /:%()?!№"]+$/i,
            message: 'кириллица, цифры, ".", ",", "_", "-", "/", ":", "%", "(", ")", "?", "!", "№", """',
        },
    },
    businessRole: {
        name: {
            pattern: /^[а-яё\s.,_-]+$/i,
            message: 'кириллица, ".", ",", "_", "-"',
        },
        description: {
            pattern: /^[а-яё\d\s.,\-_  /:%()?!№"]+$/i,
            message: 'кириллица, цифры, ".", ",", "_", "-", "/", ":", "%", "(", ")", "?", "!", "№", """',
        },
    },
    location: {
        name: {
            pattern: /^[а-яё\s.,_-]+$/i,
            message: 'кириллица, ".", ",", "_", "-"',
        },
        description: {
            pattern: /^[а-яё\d\s.,\-_  /:%()?!№"]+$/i,
            message: 'кириллица, цифры, ".", ",", "_", "-", "/", ":", "%", "(", ")", "?", "!", "№", """',
        },
    },
    locationType: {
        name: {
            pattern: /^[а-яё\s.,_-]+$/i,
            message: 'кириллица, ".", ",", "_", "-"',
        },
        description: {
            pattern: /^[а-яё\d\s.,\-_  /:%()?!№"]+$/i,
            message: 'кириллица, цифры, ".", ",", "_", "-", "/", ":", "%", "(", ")", "?", "!", "№", """',
        },
    },
    consent: {
        consentEditorText: {
            pattern: /^[а-яё\s\w.,/:;+%()?!$№«»“”"{}–-]+$/i,
            message: `${commonMessage}, "–", "/", ":", ";", "$", "+", "%", "(", ")", {", "}", "?", "!", "№", двойные кавычки.`,
        },
    },
    users: {
        login: {
            pattern: /^[a-z\d]+$/i,
            message: 'латинские буквы и цифры',
        },
    },
};

// TODO: подумать как можно с помощью дженериков сделать типы для аргументов,
// чтобы нельзя было передать в функцию строки, которых нет в константе
export function getPatternAndMessage(page: string, fieldName: string) {
    const { pattern, message } = (VALIDATE_FIELDS[page] || {})[fieldName] || {};
    return {
        pattern,
        message: `Допустимы ${message}`,
    };
}

/**
 * При работе с объектами правил для форм antd нужно обращать внимание на объект при создании правила с `required = true`
 * Если кроме свойств `required` и `message` есть любое другое поле, а значение поля отличается от `string`,
 * то необходимо ОБЯЗАТЕЛЬНО добавить свойство `type` в объект правила, иначе валидация будет работать некорректно
 */
export const FORM_RULES = {
    REQUIRED: {
        required: true,
        message: 'Заполните обязательное поле',
    } as Rule,
    NUMBER: {
        type: 'number',
        message: 'Значение может быть только числовым',
        transform: numberTransform,
    } as Rule,
    get REQUIRED_ARRAY() {
        return { ...this.REQUIRED, type: 'array' } as Rule;
    },
    get REQUIRED_OBJECT() {
        return { ...this.REQUIRED, type: 'object' } as Rule;
    },
};
