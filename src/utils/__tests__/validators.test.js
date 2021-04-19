import {
    categoryDescriptionValidator,
    categoryNameValidator,
    digitValidator,
    getPatternAndMessage,
    isRequired,
    presentationValidator,
} from '../validators';

const validateField = (regex, value) => regex.test(value);

it('test `isRequired` function', () => {
    expect(isRequired('')).toBeFalsy();
    expect(isRequired('some text')).toBeTruthy();
});

it('test `digitValidator` function', () => {
    expect(digitValidator('awdawd24124')).toBeFalsy();
    expect(digitValidator('123 23')).toBeFalsy();
    expect(digitValidator('12521421')).toBeTruthy();
});

it('test `categoryNameValidator` function', () => {
    expect(categoryNameValidator('Тест ИмЕни категории')).toBeTruthy();
    expect(categoryNameValidator('Тест name Of Category')).toBeTruthy();
    expect(categoryNameValidator('Тест name Of Category 2')).toBeTruthy();
    expect(categoryNameValidator('Тест ИмЕни категории, с запятой')).toBeTruthy();
    expect(categoryNameValidator('Тест ИмЕни категории - через тире')).toBeTruthy();
    expect(categoryNameValidator('Тест ИмЕни категории _ с нижним подчеркиванием')).toBeTruthy();
    expect(categoryNameValidator('abcdefghijklmnopqrstuvwxyz ABCDEFGHIJKLMNOPQRSTUVWXYZ абвгдеёжзийклмнопрстуфхцчшщъыьэюя АБВГДЕЁЖЗИЙКЛМНОПРСТУФХЦЧШЩЪЫЬЭЮЯ 0123456789 .-,_')).toBeTruthy();
    // недопустимый символ %
    expect(
        categoryNameValidator(
            'abcdefghijklmnopqrstuvwxyz ABCDEFGHIJKLMNOPQRSTUVWXYZ абвгдеёжзийклмнопрстуфхцчшщъыьэюя % АБВГДЕЁЖЗИЙКЛМНОПРСТУФХЦЧШЩЪЫЬЭЮЯ 0123456789 .-,_'
        )
    ).toBeFalsy();
});

it('test `categoryDescriptionValidator` function', () => {
    expect(categoryDescriptionValidator('Тест Описания категории')).toBeTruthy();
    expect(categoryDescriptionValidator('Тест description Of Category')).toBeTruthy();
    expect(categoryDescriptionValidator('Тест description Of Category 2')).toBeTruthy();
    expect(categoryDescriptionValidator('Тест Описания категории, с запятой')).toBeTruthy();
    expect(categoryDescriptionValidator('Тест Описания категории - через тире')).toBeTruthy();
    expect(categoryDescriptionValidator('Тест Описания категории _ с нижним подчеркиванием')).toBeTruthy();
    expect(categoryDescriptionValidator('abcdefghijklmnopqrstuvwxyz ABCDEFGHIJKLMNOPQRSTUVWXYZ абвгдеёжзийклмнопрстуфхцчшщъыьэюя АБВГДЕЁЖЗИЙКЛМНОПРСТУФХЦЧШЩЪЫЬЭЮЯ 0123456789 .-,_')).toBeTruthy();
    // недопустимый символ #
    expect(
        categoryDescriptionValidator(
            'abcdefghijklmnopqrstuvwxyz ABCDEFGHIJKLMNOPQRSTUVWXYZ абвгдеёжзийклмнопрстуфхцчшщъыьэюя № АБВГДЕЁЖЗИЙКЛМНОПРСТУФХЦЧШЩЪЫЬЭЮЯ 0123456789 .-,_'
        )
    ).toBeFalsy();
});

it('test `presentationValidator` function', () => {
    expect(presentationValidator('Тест значения поля В презентации')).toBeTruthy();
    expect(presentationValidator('Тест presentation field')).toBeTruthy();
    expect(presentationValidator('Тест presentation field 2')).toBeTruthy();
    expect(presentationValidator('Тест значения поля В презентации, с запятой')).toBeTruthy();
    expect(presentationValidator('Тест значения поля В презентации - через тире')).toBeTruthy();
    expect(presentationValidator('Тест значения поля В презентации _ с нижним подчеркиванием')).toBeTruthy();
    expect(presentationValidator('abcdefghijklmnopqrstuvwxyz ABCDEFGHIJKLMNOPQRSTUVWXYZ абвгдеёжзийклмнопрстуфхцчшщъыьэюя АБВГДЕЁЖЗИЙКЛМНОПРСТУФХЦЧШЩЪЫЬЭЮЯ 0123456789 .-,_/:%(?)!"№')).toBeTruthy();
    // недопустимый символ @
    expect(
        presentationValidator(
            'abcdefghijklmnopqrstuvwxyz ABCDEFGHIJKLMNOPQRSTUVWXYZ абвгдеёжзийклмнопрстуфхцчшщъыьэюя @ АБВГДЕЁЖЗИЙКЛМНОПРСТУФХЦЧШЩЪЫЬЭЮЯ 0123456789 .-,_'
        )
    ).toBeFalsy();
});

describe('validate promoCampaign fields.', () => {

    it('test regex for `name`', () => {
        const { pattern } = getPatternAndMessage('promoCampaign', 'name');
        expect(validateField(pattern, 'Test Имени промо-кампании.')).toBeTruthy();
        expect(validateField(pattern, 'abcdefghijklmnopqrstuvwxyz ABCDEFGHIJKLMNOPQRSTUVWXYZ абвгдеёжзийклмнопрстуфхцчшщъыьэюя АБВГДЕЁЖЗИЙКЛМНОПРСТУФХЦЧШЩЪЫЬЭЮЯ 0123456789 .-,_/:%(?)!"№')).toBeTruthy();
        // недопустимый символ @
        expect(
            validateField(
                pattern,
                'abcdefghijklmnopqrstuvwxyz ABCDEFGHIJKLMNOPQRSTUVWXYZ абвгдеёжзийклмнопрстуфхцчшщъыьэюя @ АБВГДЕЁЖЗИЙКЛМНОПРСТУФХЦЧШЩЪЫЬЭЮЯ 0123456789 .-,_'
            )
        ).toBeFalsy();
    });

    it('test regex for `textContent` on second step', () => {
        const { pattern } = getPatternAndMessage('promoCampaign', 'textContent');
        expect(validateField(pattern, 'Test Имени промо-кампании.')).toBeTruthy();
        expect(validateField(pattern, 'abcdefghijklmnopqrstuvwxyz ABCDEFGHIJKLMNOPQRSTUVWXYZ абвгдеёжзийклмнопрстуфхцчшщъыьэюя АБВГДЕЁЖЗИЙКЛМНОПРСТУФХЦЧШЩЪЫЬЭЮЯ 0123456789 .-,_/:%(?)!"№')).toBeTruthy();
        // недопустимый символ @
        expect(
            validateField(
                pattern,
                'abcdefghijklmnopqrstuvwxyz ABCDEFGHIJKLMNOPQRSTUVWXYZ абвгдеёжзийклмнопрстуфхцчшщъыьэюя @ АБВГДЕЁЖЗИЙКЛМНОПРСТУФХЦЧШЩЪЫЬЭЮЯ 0123456789 .-,_'
            )
        ).toBeFalsy();
    });
});

describe('validate clientApp fields', () => {

    it('test regex for `name`', () => {
        const { pattern } = getPatternAndMessage('clientApp', 'name');
        expect(validateField(pattern, 'Test Имени клиентского приложения.')).toBeTruthy();
        expect(validateField(pattern, 'abcdefghijklmnopqrstuvwxyz ABCDEFGHIJKLMNOPQRSTUVWXYZ абвгдеёжзийклмнопрстуфхцчшщъыьэюя АБВГДЕЁЖЗИЙКЛМНОПРСТУФХЦЧШЩЪЫЬЭЮЯ 0123456789 .-,_')).toBeTruthy();
        // недопустимый символ /
        expect(
            validateField(
                pattern,
                'abcdefghijklmnopqrstuvwxyz ABCDEFGHIJKLMNOPQRSTUVWXYZ абвгдеёжзийклмнопрстуфхцчшщъыьэюя / АБВГДЕЁЖЗИЙКЛМНОПРСТУФХЦЧШЩЪЫЬЭЮЯ 0123456789 .-,_'
            )
        ).toBeFalsy();
    });

    it('test regex for `code`', () => {
        const { pattern } = getPatternAndMessage('clientApp', 'code');
        expect(validateField(pattern, 'Test_for_Code_clientApp')).toBeTruthy();
        expect(validateField(pattern, 'Test for Code clientApp')).toBeFalsy();
        expect(validateField(pattern, 'тест_кода')).toBeFalsy();
        expect(validateField(pattern, 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789-')).toBeTruthy();
        expect(
            validateField(
                pattern,
                'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789.'
            )
        ).toBeFalsy();
    });

    it('test regex for `privacyPolicy`', () => {
        const { pattern } = getPatternAndMessage('clientApp', 'privacyPolicy');
        expect(validateField(pattern, 'Test политики конфиденциальности клиентского приложения.')).toBeTruthy();
        expect(validateField(pattern, 'abcdefghijklmnopqrstuvwxyz ABCDEFGHIJKLMNOPQRSTUVWXYZ абвгдеёжзийклмнопрстуфхцчшщъыьэюя АБВГДЕЁЖЗИЙКЛМНОПРСТУФХЦЧШЩЪЫЬЭЮЯ 0123456789 .-,_/:%()№{}"')).toBeTruthy();
        // недопустимый символ @
        expect(
            validateField(
                pattern,
                'abcdefghijklmnopqrstuvwxyz ABCDEFGHIJKLMNOPQRSTUVWXYZ абвгдеёжзийклмнопрстуфхцчшщъыьэюя @ АБВГДЕЁЖЗИЙКЛМНОПРСТУФХЦЧШЩЪЫЬЭЮЯ 0123456789 .-,_/:%()№{}"'
            )
        ).toBeFalsy();
    });
});

describe('validate DZO fields', () => {

    it('test regex for `name`', () => {
        const { pattern } = getPatternAndMessage('dzo', 'name');
        expect(validateField(pattern, 'Тест ИмЕни ДЗО')).toBeTruthy();
        expect(validateField(pattern, 'Тест name')).toBeTruthy();
        expect(validateField(pattern, 'Тест name 2')).toBeTruthy();
        expect(validateField(pattern, 'Тест ИмЕни ДЗО, с запятой')).toBeTruthy();
        expect(validateField(pattern, 'Тест ИмЕни ДЗО - через тире')).toBeTruthy();
        expect(validateField(pattern, 'Тест ИмЕни ДЗО _ с нижним подчеркиванием')).toBeTruthy();
        expect(validateField(pattern, 'abcdefghijklmnopqrstuvwxyz ABCDEFGHIJKLMNOPQRSTUVWXYZ абвгдеёжзийклмнопрстуфхцчшщъыьэюя АБВГДЕЁЖЗИЙКЛМНОПРСТУФХЦЧШЩЪЫЬЭЮЯ 0123456789 .-,_')).toBeTruthy();
        // недопустимый символ %
        expect(
            validateField(
                pattern,
                'abcdefghijklmnopqrstuvwxyz ABCDEFGHIJKLMNOPQRSTUVWXYZ абвгдеёжзийклмнопрстуфхцчшщъыьэюя % АБВГДЕЁЖЗИЙКЛМНОПРСТУФХЦЧШЩЪЫЬЭЮЯ 0123456789 .-,_'
            )
        ).toBeFalsy();
    });

    it('test regex for `code`', () => {
        const { pattern } = getPatternAndMessage('dzo', 'code');
        expect(validateField(pattern, 'Test_for_Code_dzo')).toBeTruthy();
        expect(validateField(pattern, 'Test for Code dzo')).toBeFalsy();
        expect(validateField(pattern, 'тест_кода')).toBeFalsy();
        expect(validateField(pattern, 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789-')).toBeTruthy();
        expect(
            validateField(
                pattern,
                'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789.'
            )
        ).toBeFalsy();
    });

    it('test regex for `description`', () => {
        const { pattern } = getPatternAndMessage('dzo', 'description');
        expect(validateField(pattern, 'Тест описания ДЗО')).toBeTruthy();
        expect(validateField(pattern, 'Тест description')).toBeTruthy();
        expect(validateField(pattern, 'Тест description 2')).toBeTruthy();
        expect(validateField(pattern, 'Тест описания ДЗО, с запятой')).toBeTruthy();
        expect(validateField(pattern, 'Тест описания ДЗО - через тире')).toBeTruthy();
        expect(validateField(pattern, 'Тест описания ДЗО _ с нижним подчеркиванием')).toBeTruthy();
        expect(validateField(pattern, 'abcdefghijklmnopqrstuvwxyz ABCDEFGHIJKLMNOPQRSTUVWXYZ абвгдеёжзийклмнопрстуфхцчшщъыьэюя АБВГДЕЁЖЗИЙКЛМНОПРСТУФХЦЧШЩЪЫЬЭЮЯ 0123456789 .-,_')).toBeTruthy();
        // недопустимый символ %
        expect(
            validateField(
                pattern,
                'abcdefghijklmnopqrstuvwxyz ABCDEFGHIJKLMNOPQRSTUVWXYZ абвгдеёжзийклмнопрстуфхцчшщъыьэюя % АБВГДЕЁЖЗИЙКЛМНОПРСТУФХЦЧШЩЪЫЬЭЮЯ 0123456789 .-,_'
            )
        ).toBeFalsy();
    });

});
