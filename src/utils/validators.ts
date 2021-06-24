const commonMessage = 'кириллица, латинские буквы, цифры, и символы ".", "-", ",", "_"';
const commonPattern = /^[а-яё\s\w.,-]+$/i;
const commonRule = {
    pattern: commonPattern,
    message: commonMessage,
};
const codeRule = {
    pattern: /^[a-z_-]+$/,
    message: 'латинские буквы в нижнем регистре, "_", "-"',
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
        description: commonRule,
    },
    presentation: {
        common: {
            pattern: /^[а-яё\s\w.,/:%()?!№"-]+$/i,
            message: `${commonMessage}, "/", ":", "%", "(", ")", "?", "!", """, "№"`,
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

export const isRequired = (value: string) => {
    const regexp = /^[^ ]/;
    return !!value.match(regexp) && value.length > 0;
};

export const digitValidator = (value: string) => {
    const regexp = /^\d*$/;
    return !!value.match(regexp);
};

export const categoryNameValidator = (value: string) => {
    const { pattern } = getPatternAndMessage('category', 'name');
    pattern.lastIndex = 0;
    return pattern.test(value);
};

export const presentationValidator = (value: string) => {
    const { pattern } = getPatternAndMessage('presentation', 'common');
    pattern.lastIndex = 0;
    return pattern.test(value);
};
