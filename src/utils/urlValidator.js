export const URL_VALIDATION_TEXT = 'Введите корректную ссылку';
const protocols = ['ftp', 'http', 'https'];
const customProtocols = ['sberbankonline', 'android-app'];
const hostNameRegExp = /^((http|https):\/\/)?[a-zA-Zа-яА-Я0-9]+([-./]{1}[a-zA-Zа-яА-Я0-9-]+)*\.[a-zA-Zа-яА-Я0-9]{2,5}($)?([0-9]{1,5})?(\/?.*)?([^=])?$/;
const queryRegExp = /^[а-яА-Я\w/{}?#&[\]~=\-():_.%]+$/;
const customProtocolCheck = /^[а-яА-Я\w:/=0-9?.=-]+$/;

function validatePartOfUrl(url, separateMark, regex = queryRegExp) {
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

export function validateURL(url) {
    try {
        if (!url || /[\s<>]/.test(url)) {
            throw new Error('URL cannot be empty or with `spaces` or symbols `<` and `>`');
        }

        let split;
        let customProtocol = false;
        split = url.split('://');
        if (split.length > 1) {
            const protocol = split.shift().toLowerCase();
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
        } else if (!hostNameRegExp.test(url)) {
            throw new Error('URL contains wrong symbols');
        }
    } catch (e) {
        console.log(e.message);
        return false;
    }

    return true;
}

export const urlCheckRule = {
    validator(_, value) {
        if (!value) {
            return Promise.resolve();
        }

        return validateURL(value) ? Promise.resolve() : Promise.reject(URL_VALIDATION_TEXT);
    },
    validateTrigger: 'onSubmit',
};
