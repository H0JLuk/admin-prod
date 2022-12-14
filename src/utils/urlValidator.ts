import { Rule } from 'rc-field-form/lib/interface';

export const URL_VALIDATION_TEXT = 'Допустимые символы латинские буквы и цифры, "-", ".", "_", "~", ":", "/", "?", "#", "[", "]", "@", "!", "$", "&", "(", ")", "*", "+", ",", ";", "%", "=", "\'"';
export const URL_HTTPS_VALIDATION_TEXT = 'Ссылка должна начинаться с https';
const protocols = ['https'];
const customProtocols = ['sberbankonline', 'android-app'];
const hostNameRegExp = /^(https:\/\/)?[a-zA-Zа-яА-Я0-9]+([-.:/]{1}[a-zA-Zа-яА-Я0-9@&-]+)*\.[a-zA-Zа-яА-Я0-9]{2,5}($)?([0-9]{1,5})?(\/?.*)?([^=])?$/;
const queryRegExp = /^[а-яё\w/{}?#&[\]~=\-():.%;,+*'!@$]+$/i;
const customProtocolCheck = /^[а-я\w\d:/=?.-]+$/i;

function validatePartOfUrl(url: string, separateMark: string, regex = queryRegExp) {
    const separateMarkIndex = url.indexOf(separateMark);

    if (separateMarkIndex + 1) {
        const urlPart = url.slice(separateMarkIndex + 1);
        if (urlPart && !regex.test(urlPart)) {
            throw new Error(`Error in url after "${separateMark}"`);
        }
        return url.slice(0, separateMarkIndex);
    }

    return url;
}

export function validateURL(url: string) {
    try {
        if (!url || /[\s<>]/.test(url)) {
            throw new Error('URL cannot be empty or with `spaces` or symbols `<` and `>`');
        }

        let customProtocol = false;
        const split = url.split('://');
        if (split.length > 1) {
            const protocol = (split.shift() || '').toLowerCase();
            customProtocol = !protocols.includes(protocol);
            if (customProtocol && !customProtocols.includes(protocol)) {
                throw new Error('not supported custom protocol');
            }
        }
        url = split.join('://');

        url = validatePartOfUrl(url, '#');
        url = validatePartOfUrl(url, '?');
        url = validatePartOfUrl(url, '/');

        if (customProtocol) {
            if (!customProtocolCheck.test(url)) {
                throw new Error('URL contains wrong symbols');
            }
        } else if (url.includes('http')) {
            throw new Error('URL contains wrong symbols');
        } else if (!hostNameRegExp.test(url)) {
            throw new Error('URL contains wrong symbols');
        }
    } catch (e) {
        if (process.env.NODE_ENV !== 'test') {
            console.log(e.message);
        }
        return false;
    }

    return true;
}

export const urlCheckRule: Rule = {
    validator(_, value) {
        return !value || validateURL(value)
            ? Promise.resolve()
            : Promise.reject(new Error(URL_VALIDATION_TEXT));
    },
    validateTrigger: 'onSubmit',
};

export const urlHttpsRule: Rule = {
    validator(_, value) {
        return !value || value.startsWith('https')
            ? Promise.resolve()
            : Promise.reject(new Error(URL_HTTPS_VALIDATION_TEXT));
    },
    validateTrigger: 'onSubmit',
};
