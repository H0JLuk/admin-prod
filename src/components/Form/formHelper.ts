import cloneDeep from 'lodash/cloneDeep';
import { FormFields, FormFieldValidator } from './forms';

export type FormState = {
    [key: string]: FieldState | string | boolean | number | null | undefined;
};

export type FieldState = {
    value: string;
    valid: boolean | null;
};

export const generateFormState = (obj: FormFields) => {
    const state = {} as FormState;
    let errorCount = 0;

    Object.keys(obj).forEach(key => {
        const { value, isRequired } = obj[key];
        state[key] = {
            value,
            valid: ((isRequired && value !== '') || !isRequired) ? true : null
        };
        if (!(state[key] as FieldState).valid) {
            ++errorCount;
        }
    });
    state.errorCount = errorCount;
    state.active = null;

    return state;
};

export const getValues = (obj: FormState) => {
    const fields = {} as Record<string, string>;
    for (const key in obj) {
        if (typeof obj[key] === 'object' && obj[key] !== null) {
            fields[key] = (obj[key] as FieldState).value;
        }
    }

    return fields;
};

export const getValid = (value: string, validators: FormFieldValidator[]) => {
    let newValid = true;
    validators.some(validator => {
        newValid = newValid && validator(value);
        return newValid === false;
    });

    return newValid;
};

export const getErrorCounts = (valid: boolean | null, errorCount: number, type: string, controlValid: boolean) => {
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

export const populateFormWithData = (template: FormFields, data: Record<string, string | null>) => {
    const dataKeys = Object.keys(data);
    const templateKeys = Object.keys(template);
    const filtered = dataKeys.filter((dKey) => templateKeys.some((tKey) => tKey === dKey));
    const result = cloneDeep(template);
    filtered.forEach(filteredKey => result[filteredKey].value = (data[filteredKey] as string));
    return result;
};
