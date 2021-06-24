import {
    categoryNameValidator,
    digitValidator,
    getPatternAndMessage,
    isRequired,
    presentationValidator,
} from '../validators';

const validateField = (regex, value) => regex.test(value);

it('test `isRequired` function', () => {
    expect(isRequired('')).toBe(false);
    expect(isRequired('some text')).toBe(true);
});

it('test `digitValidator` function', () => {
    expect(digitValidator('awdawd24124')).toBe(false);
    expect(digitValidator('123 23')).toBe(false);
    expect(digitValidator('12521421')).toBe(true);
});

it('test `categoryNameValidator` function', () => {
    expect(categoryNameValidator('Тест ИмЕни категории')).toBe(true);
    expect(categoryNameValidator('Тест name Of Category')).toBe(true);
    expect(categoryNameValidator('Тест name Of Category 2')).toBe(true);
    expect(categoryNameValidator('Тест ИмЕни категории, с запятой')).toBe(true);
    expect(categoryNameValidator('Тест ИмЕни категории - через тире')).toBe(true);
    expect(categoryNameValidator('Тест ИмЕни категории _ с нижним подчеркиванием')).toBe(true);
    expect(categoryNameValidator('abcdefghijklmnopqrstuvwxyz ABCDEFGHIJKLMNOPQRSTUVWXYZ абвгдеёжзийклмнопрстуфхцчшщъыьэюя АБВГДЕЁЖЗИЙКЛМНОПРСТУФХЦЧШЩЪЫЬЭЮЯ 0123456789 .-,_')).toBe(true);
    // недопустимый символ %
    expect(
        categoryNameValidator(
            'abcdefghijklmnopqrstuvwxyz ABCDEFGHIJKLMNOPQRSTUVWXYZ абвгдеёжзийклмнопрстуфхцчшщъыьэюя % АБВГДЕЁЖЗИЙКЛМНОПРСТУФХЦЧШЩЪЫЬЭЮЯ 0123456789 .-,_'
        )
    ).toBe(false);
});

it('test `presentationValidator` function', () => {
    expect(presentationValidator('Тест значения поля В презентации')).toBe(true);
    expect(presentationValidator('Тест presentation field')).toBe(true);
    expect(presentationValidator('Тест presentation field 2')).toBe(true);
    expect(presentationValidator('Тест значения поля В презентации, с запятой')).toBe(true);
    expect(presentationValidator('Тест значения поля В презентации - через тире')).toBe(true);
    expect(presentationValidator('Тест значения поля В презентации _ с нижним подчеркиванием')).toBe(true);
    expect(presentationValidator('abcdefghijklmnopqrstuvwxyz ABCDEFGHIJKLMNOPQRSTUVWXYZ абвгдеёжзийклмнопрстуфхцчшщъыьэюя АБВГДЕЁЖЗИЙКЛМНОПРСТУФХЦЧШЩЪЫЬЭЮЯ 0123456789 .-,_/:%(?)!"№')).toBe(true);
    // недопустимый символ @
    expect(
        presentationValidator(
            'abcdefghijklmnopqrstuvwxyz ABCDEFGHIJKLMNOPQRSTUVWXYZ абвгдеёжзийклмнопрстуфхцчшщъыьэюя @ АБВГДЕЁЖЗИЙКЛМНОПРСТУФХЦЧШЩЪЫЬЭЮЯ 0123456789 .-,_'
        )
    ).toBe(false);
});

describe('validate promoCampaign fields.', () => {

    it('test regex for `name`', () => {
        const { pattern } = getPatternAndMessage('promoCampaign', 'name');
        expect(validateField(pattern, 'Test Имени промо-кампании.')).toBe(true);
        expect(validateField(pattern, 'abcdefghijklmnopqrstuvwxyz ABCDEFGHIJKLMNOPQRSTUVWXYZ абвгдеёжзийклмнопрстуфхцчшщъыьэюя АБВГДЕЁЖЗИЙКЛМНОПРСТУФХЦЧШЩЪЫЬЭЮЯ 0123456789 .-,_/:%(?)!"№')).toBe(true);
        // недопустимый символ @
        expect(
            validateField(
                pattern,
                'abcdefghijklmnopqrstuvwxyz ABCDEFGHIJKLMNOPQRSTUVWXYZ абвгдеёжзийклмнопрстуфхцчшщъыьэюя @ АБВГДЕЁЖЗИЙКЛМНОПРСТУФХЦЧШЩЪЫЬЭЮЯ 0123456789 .-,_'
            )
        ).toBe(false);
    });

    it('test regex for `textContent` on second step', () => {
        const { pattern } = getPatternAndMessage('promoCampaign', 'textContent');
        expect(validateField(pattern, 'Test Имени промо-кампании.')).toBe(true);
        expect(validateField(pattern, 'abcdefghijklmnopqrstuvwxyz ABCDEFGHIJKLMNOPQRSTUVWXYZ абвгдеёжзийклмнопрстуфхцчшщъыьэюя АБВГДЕЁЖЗИЙКЛМНОПРСТУФХЦЧШЩЪЫЬЭЮЯ 0123456789 .-,_/:%(?)!"№')).toBe(true);
        // недопустимый символ @
        expect(
            validateField(
                pattern,
                'abcdefghijklmnopqrstuvwxyz ABCDEFGHIJKLMNOPQRSTUVWXYZ абвгдеёжзийклмнопрстуфхцчшщъыьэюя @ АБВГДЕЁЖЗИЙКЛМНОПРСТУФХЦЧШЩЪЫЬЭЮЯ 0123456789 .-,_'
            )
        ).toBe(false);
    });
});

describe('validate clientApp fields', () => {

    it('test regex for `name`', () => {
        const { pattern } = getPatternAndMessage('clientApp', 'name');
        expect(validateField(pattern, 'Test Имени клиентского приложения.')).toBe(true);
        expect(validateField(pattern, 'abcdefghijklmnopqrstuvwxyz ABCDEFGHIJKLMNOPQRSTUVWXYZ абвгдеёжзийклмнопрстуфхцчшщъыьэюя АБВГДЕЁЖЗИЙКЛМНОПРСТУФХЦЧШЩЪЫЬЭЮЯ 0123456789 .-,_')).toBe(true);
        // недопустимый символ /
        expect(
            validateField(
                pattern,
                'abcdefghijklmnopqrstuvwxyz ABCDEFGHIJKLMNOPQRSTUVWXYZ абвгдеёжзийклмнопрстуфхцчшщъыьэюя / АБВГДЕЁЖЗИЙКЛМНОПРСТУФХЦЧШЩЪЫЬЭЮЯ 0123456789 .-,_'
            )
        ).toBe(false);
    });

    it('test regex for `code`', () => {
        const { pattern } = getPatternAndMessage('clientApp', 'code');
        expect(validateField(pattern, 'test_for_code_client-app')).toBe(true);
        expect(validateField(pattern, 'Test for Code clientApp')).toBe(false);
        expect(validateField(pattern, 'тест_кода')).toBe(false);
        expect(validateField(pattern, 'abcdefghijklmnopqrstuvwxyz-_')).toBe(true);
        expect(
            validateField(
                pattern,
                'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789.'
            )
        ).toBe(false);
    });
});

describe('validate DZO fields', () => {

    it('test regex for `name`', () => {
        const { pattern } = getPatternAndMessage('dzo', 'name');
        expect(validateField(pattern, 'Тест ИмЕни ДЗО')).toBe(true);
        expect(validateField(pattern, 'Тест name')).toBe(true);
        expect(validateField(pattern, 'Тест name 2')).toBe(true);
        expect(validateField(pattern, 'Тест ИмЕни ДЗО, с запятой')).toBe(true);
        expect(validateField(pattern, 'Тест ИмЕни ДЗО - через тире')).toBe(true);
        expect(validateField(pattern, 'Тест ИмЕни ДЗО _ с нижним подчеркиванием')).toBe(true);
        expect(validateField(pattern, 'abcdefghijklmnopqrstuvwxyz ABCDEFGHIJKLMNOPQRSTUVWXYZ абвгдеёжзийклмнопрстуфхцчшщъыьэюя АБВГДЕЁЖЗИЙКЛМНОПРСТУФХЦЧШЩЪЫЬЭЮЯ 0123456789 .-,_')).toBe(true);
        // недопустимый символ %
        expect(
            validateField(
                pattern,
                'abcdefghijklmnopqrstuvwxyz ABCDEFGHIJKLMNOPQRSTUVWXYZ абвгдеёжзийклмнопрстуфхцчшщъыьэюя % АБВГДЕЁЖЗИЙКЛМНОПРСТУФХЦЧШЩЪЫЬЭЮЯ 0123456789 .-,_'
            )
        ).toBe(false);
    });

    it('test regex for `code`', () => {
        const { pattern } = getPatternAndMessage('dzo', 'code');
        expect(validateField(pattern, 'test_for_code_dzo')).toBe(true);
        expect(validateField(pattern, 'Test for Code dzo')).toBe(false);
        expect(validateField(pattern, 'тест_кода')).toBe(false);
        expect(validateField(pattern, 'abcdefghijklmnopqrstuvwxyz-_')).toBe(true);
        expect(
            validateField(
                pattern,
                'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789.'
            )
        ).toBe(false);
    });

    it('test regex for `description`', () => {
        const { pattern } = getPatternAndMessage('dzo', 'description');
        expect(validateField(pattern, 'Тест описания ДЗО')).toBe(true);
        expect(validateField(pattern, 'Тест description')).toBe(true);
        expect(validateField(pattern, 'Тест description 2')).toBe(true);
        expect(validateField(pattern, 'Тест описания ДЗО, с запятой')).toBe(true);
        expect(validateField(pattern, 'Тест описания ДЗО - через тире')).toBe(true);
        expect(validateField(pattern, 'Тест описания ДЗО _ с нижним подчеркиванием')).toBe(true);
        expect(validateField(pattern, 'abcdefghijklmnopqrstuvwxyz ABCDEFGHIJKLMNOPQRSTUVWXYZ абвгдеёжзийклмнопрстуфхцчшщъыьэюя АБВГДЕЁЖЗИЙКЛМНОПРСТУФХЦЧШЩЪЫЬЭЮЯ 0123456789 .-,_')).toBe(true);
        // недопустимый символ %
        expect(
            validateField(
                pattern,
                'abcdefghijklmnopqrstuvwxyz ABCDEFGHIJKLMNOPQRSTUVWXYZ абвгдеёжзийклмнопрстуфхцчшщъыьэюя % АБВГДЕЁЖЗИЙКЛМНОПРСТУФХЦЧШЩЪЫЬЭЮЯ 0123456789 .-,_'
            )
        ).toBe(false);
    });

});

describe('validate users pages', () => {

    it('test regex for `login`', () => {
        const { pattern } = getPatternAndMessage('users', 'login');
        expect(validateField(pattern, '12312412412')).toBe(true);
        expect(validateField(pattern, 'TestValue')).toBe(true);
        expect(validateField(pattern, '1231Test13')).toBe(true);
        expect(validateField(pattern, '123 123')).toBe(false);
        expect(validateField(pattern, 'test value')).toBe(false);
        expect(validateField(pattern, 'test#Value')).toBe(false);
    });

});
