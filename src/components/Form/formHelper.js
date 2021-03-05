import cloneDeep from 'lodash/cloneDeep';

export const generateFormState = (obj) => {
    const state = {};
    let errorCount = 0;

    Object.keys(obj).forEach(key => {
        const { value, isRequired } = obj[key];
        state[key] = {
            value,
            valid: ((isRequired && value !== '') || !isRequired) ? true : null
        };
        if (!state[key].valid) {
            ++errorCount;
        }
    });
    state.errorCount = errorCount;
    state.active = null;

    return state;
};

export const getValues = (obj) => {
    const fields = {};
    for (const key in obj) {
        if (typeof obj[key] === 'object' && obj[key] !== null) {
            fields[key] = obj[key].value;
        }
    }

    return fields;
};

export const getValid = (value, validators) => {
    let newValid = true;
    validators.some(validator => {
        newValid = newValid && validator(value);
        return newValid === false;
    });

    return newValid;
};

export const getErrorCounts = (valid, errorCount, type, controlValid) => {
    switch (type) {
        case 'isRequired': {
            if (valid && controlValid) {
                return ++errorCount;
            }
            if (!valid && !controlValid) {
                return --errorCount;
            }
            return errorCount;
        }
        case 'newValid': {
            if (valid && !controlValid) {
                return ++errorCount;
            }
            if (!valid && controlValid) {
                return --errorCount;
            }
            return errorCount;
        }
        default:
            return errorCount;
    }
};

export const populateFormWithData = (template, data) => {
    const dataKeys = Object.keys(data);
    const templateKeys = Object.keys(template);
    const filtered = dataKeys.filter((dKey) => templateKeys.some((tKey) => tKey === dKey));
    const result = cloneDeep(template);
    filtered.forEach(filteredKey => result[filteredKey].value = data[filteredKey]);
    return result;
};
