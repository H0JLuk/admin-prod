const commonMessage = 'кириллица, латинские буквы, цифры, и символы ".", "-", ",", "_"';
const commonPattern = /^[а-яё\s\w.,-]+$/i;
const commonRule = {
    pattern: commonPattern,
    message: commonMessage,
};

export const VALIDATE_FIELDS = {
    promoCampaign: {
        name: {
            pattern: /^[а-яё\s\w.,-/:%()?!№"]+$/i,
            message: `${commonMessage}, "/", ":", "%", "(", ")", "?", "!", "№", """`,
        },
        textContent: {
            pattern: /^[а-яё\s\w.,/:%()?!№"-₽]+$/i,
            message: `${commonMessage}, "/", ":", "%", "(", ")", "?", "!", "№", """`,
        },
        detailsButtonLabel: commonRule,
    },
    clientApp: {
        name: commonRule,
        code: {
            pattern: /^[\w-]+$/,
            message: 'латинские буквы, цифры, "_", "-"',
        },
        privacyPolicy: {
            pattern: /^[а-яё\s\w.,-/:%()№"{}]+$/i,
            message: `${commonMessage}, "/", ":", "%", "(", ")", "№", "{", "}", """`,
        },
    },
    dzo: {
        name: commonRule,
        code: {
            pattern: /^[\w-]+$/,
            message: 'латинские буквы, цифры, "_", "-"',
        },
        description: commonRule,
    },
    category: {
        name: commonRule,
        description: commonRule,
    },
    presentation: {
        common: {
            pattern: /^[а-яё\s\w.,-/:%()?!№"]+$/i,
            message: `${commonMessage}, "/", ":", "%", "(", ")", "?", "!", """, "№"`,
        },
    },
};

export function getPatternAndMessage(page, fieldName) {
    const { pattern, message } = (VALIDATE_FIELDS[page] || {})[fieldName] || {};
    return {
        pattern,
        message: `Допустимы ${message}`,
    };
}

export const isRequired = (value) => {
    const regexp = /^[^ ]/;
    return !!value.match(regexp) && value.length > 0;
};

export const digitValidator = (value) => {
    const regexp = /^\d*$/;
    return !!value.match(regexp);
};

export const categoryNameValidator = (value) => {
    const { pattern } = getPatternAndMessage('category', 'name');
    pattern.lastIndex = 0;
    return pattern.test(value);
};

export const presentationValidator = (value) => {
    const { pattern } = getPatternAndMessage('presentation', 'common');
    pattern.lastIndex = 0;
    return pattern.test(value);
};
