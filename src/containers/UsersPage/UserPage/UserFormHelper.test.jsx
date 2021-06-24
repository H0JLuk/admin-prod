import React from 'react';
import { salePointTest } from '../../../../__tests__/constants';
import { LOGIN_TYPES_ENUM } from '../../../constants/loginTypes';
import ROLES from '../../../constants/roles';
import { customNotifications } from '../../../utils/notifications';
import {
    errorEditPermissions,
    getLoginTypeByRole,
    getUserAppsCheckboxes,
    MODE,
    showNotify,
    validateLogin,
    validateMessages,
    validatePartner,
    validateSalePoint,
} from './UserFormHelper';

jest.mock('../../../utils/notifications', () => ({
    customNotifications: {
        success: jest.fn(),
        error: jest.fn(),
    },
}));

const TEST_APPS = [
    {
        code: 'mobile-sales-manager',
        displayName: 'Витрина мобильного менеджера продаж',
        id: 10,
        isDeleted: false,
        name: 'Витрина ММП',
        orderNumber: 0,
    },
];

const TEST_CHECKED_APPS = [10];

const TEST_RES = {
    'mobile-sales-manager': {
        label: 'Витрина мобильного менеджера продаж',
        id: 10,
        disabled: false,
        checked: true,
    },
};

describe('UserFormHelper test', () => {
    it('should call getUserAppsCheckboxes function', () => {
        expect(getUserAppsCheckboxes(TEST_APPS, TEST_CHECKED_APPS)).toEqual(TEST_RES);
    });

    it('test `getLoginTypeByRole` function', () => {
        expect(getLoginTypeByRole(ROLES.REFERAL_LINK)).toBe(LOGIN_TYPES_ENUM.DIRECT_LINK);
        expect(getLoginTypeByRole(ROLES.USER)).toBe(LOGIN_TYPES_ENUM.PASSWORD);
        expect(getLoginTypeByRole('adwad')).toBe(LOGIN_TYPES_ENUM.PASSWORD);
    });

    it('test `validateLogin` function', () => {
        expect(validateLogin('testLogin')).toBe(undefined);
        expect(() => validateLogin('test Login')).toThrow(validateMessages.login.validate);
        expect(() => validateLogin('')).toThrow(validateMessages.login.require);
    });

    it('test `validateSalePoint` function', () => {
        expect(validateSalePoint(salePointTest)).toBe(undefined);
        expect(() => validateSalePoint()).toThrow(validateMessages.salePoint.require);
    });

    it('test `validatePartner` function', () => {
        expect(validatePartner('', false)).toBe(undefined);
        expect(validatePartner('test', false)).toBe(undefined);
        expect(validatePartner('test', true)).toBe(undefined);
        expect(() => validatePartner('', true)).toThrow(validateMessages.partner.require);
    });

    it('test `errorEditPermissions` function', () => {
        expect(errorEditPermissions('testUser')).toEqual(
            <span>
                У вас недостаточно полномочий чтобы редактировать пользователя с табельным номером
                <b> { 'testUser' }</b>
            </span>
        );
    });

    it('test `showNotify` function', () => {
        showNotify({
            login: 'testLogin',
            pwd: 'testPass',
            mode: MODE.CREATE,
        });
        expect(customNotifications.success).toBeCalledTimes(1);
        expect(customNotifications.error).toBeCalledTimes(0);

        showNotify({
            login: 'testLogin',
            pwd: '',
            mode: MODE.EDIT,
        });
        expect(customNotifications.success).toBeCalledTimes(2);
        expect(customNotifications.error).toBeCalledTimes(0);

        showNotify({
            login: 'testLogin',
            pwd: '123123',
            mode: MODE.RESTORED,
        });
        expect(customNotifications.success).toBeCalledTimes(3);
        expect(customNotifications.error).toBeCalledTimes(0);

        showNotify({
            login: 'testLogin',
            mode: MODE.QR_DOWNLOAD,
        });
        expect(customNotifications.success).toBeCalledTimes(4);
        expect(customNotifications.error).toBeCalledTimes(0);

        showNotify({
            login: 'testLogin',
            mode: MODE.DELETE,
        });
        expect(customNotifications.success).toBeCalledTimes(5);
        expect(customNotifications.error).toBeCalledTimes(0);

        showNotify({
            login: 'testLogin',
            mode: MODE.ERROR,
            errorMessage: 'testError',
        });
        expect(customNotifications.success).toBeCalledTimes(5);
        expect(customNotifications.error).toBeCalledTimes(1);
        expect(customNotifications.error).toBeCalledWith({ message: 'testError' });
    });
});
