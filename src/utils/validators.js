const commonMessage = 'кириллица и латинские буквы, цифры, и символы ".", "-"';

export const VALIDATE_FIELDS = {
    promoCampaign: {
        name: {
            pattern: /^[а-яё.\-,/:%\s\d\w]+$/gi,
            message: `${commonMessage}, ",", "/", "_", ":", "%"`,
        },
    },
    clientApp: {
        name: {
            pattern: /^[а-яёa-z.\-,/:\s\d]+$/gi,
            message: `${commonMessage}, ",", "/", ":"`,
        },
        code: {
            pattern: /^[a-z-_]+$/g,
            message: 'латинские буквы и символы "_" и "-"',
        },
        privacyPolicy: {
            pattern: /^[а-яё.,/:+()\-"\s\w]+$/gi,
            message: `${commonMessage}, ",", "/", "_", ":", "+", "(", ")", """`,
        },
    },
    dzo: {
        name: {
            pattern: /^[a-zа-яё\-.\s\d]+$/gi,
            message: commonMessage,
        },
        code: {
            pattern: /^[a-z_\d]+$/g,
            message: 'латинские буквы, цифры и "_"',
        },
        description: {
            pattern: /^[а-яёa-z.\-,/\s\d]+$/gi,
            message: `${commonMessage} ","`,
        },
    },
    category: {
        name: {
            pattern: /^[a-zа-яё\-./\s\d]+$/gi,
            message: `${commonMessage}, "/"`,
        },
        description: {
            pattern: /^[а-яёa-z.\-,/:%\d\s]+$/gi,
            message: `${commonMessage}, ",", "/", ":", "%"`,
        },
    },
    presentation: {
        common: {
            pattern: /^[a-zа-яё.\-,?№!"():\s\d]+$/gi,
            message: `${commonMessage}, ",", "?", "№", "!", """, "(", ")", ":"`,
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

export const categoryDescriptionValidator = (value) => {
    const { pattern } = getPatternAndMessage('category', 'description');
    pattern.lastIndex = 0;
    return pattern.test(value);
};

export const presentationValidator = (value) => {
    const { pattern } = getPatternAndMessage('presentation', 'common');
    pattern.lastIndex = 0;
    return pattern.test(value);
};
