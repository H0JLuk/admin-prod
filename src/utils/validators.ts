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

export type ValidateRule = typeof commonRule;

type VALIDATE_FIELDS_TYPE = {
    promoCampaign: Record<'name' | 'textContent' | 'detailsButtonLabel' | 'productOfferingId', ValidateRule>;
    clientApp: Record<'name' | 'code', ValidateRule>;
    dzo: Record<'name' | 'code' | 'description', ValidateRule>;
    category: Record<'name', ValidateRule>;
    presentation: Record<'common', ValidateRule>;
    salePoint: Record<'name' | 'description', ValidateRule>;
    businessRole: Record<'name' | 'description', ValidateRule>;
    location: Record<'name' | 'description', ValidateRule>;
    locationType: Record<'name' | 'description', ValidateRule>;
    consent: Record<'consentEditorText', ValidateRule>;
    users: Record<'login', ValidateRule>;
};

export const VALIDATE_FIELDS: VALIDATE_FIELDS_TYPE = {
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
        productOfferingId: {
            pattern: /^[0-9a-z-]{1,36}$/i,
            message: 'латинские буквы, цифры, "-"',
        },
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

type PageType = keyof VALIDATE_FIELDS_TYPE;
type FieldType<P extends PageType> = keyof (VALIDATE_FIELDS_TYPE[P]);

export function getPatternAndMessage<P extends PageType, F extends FieldType<P>>(page: P, fieldName: F) {
    const { message, pattern } = VALIDATE_FIELDS[page][fieldName] as unknown as ValidateRule;
    return {
        pattern,
        message: `Допустимы ${message}`,
    };
}

export const getMaxLengthRule = (max: number) => ({
    message: `Максимальное количество символов - ${max}`,
    max,
});

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
