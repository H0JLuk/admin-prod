export const isRequired = (value) => {
    const regexp = /^[^ ]/;
    return !!value.match(regexp) && value.length > 0
};

export const digitValidator = (value) => {
    const regexp = /^\d*$/;
    return !!value.match(regexp);
};