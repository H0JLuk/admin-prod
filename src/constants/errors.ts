export enum Errors {
    AUTHORITY = 'authority',
    FAIL = 'fail',
}

export const getErrorText = (type: Errors | null) => {
    switch (type) {
        case Errors.AUTHORITY: return 'Недостаточно полномочий';
        case Errors.FAIL: return 'Неверный логин/пароль';
        case null:
        default:
            return '';
    }
};
