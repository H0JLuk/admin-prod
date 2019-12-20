export const errors = {
    authority: 'authority',
    fail: 'fail'
};

export const getErrorText = (type) => {
    switch (type) {
        case errors.authority: return 'Нет полномочий';
        case errors.fail: return 'Неверный логин/пароль';
        case null:
        default:
            return '';
    }
};