import { getUserAppsCheckboxes } from './UserFormHelper';

const TEST_APPS = [
    {
        code: 'mobile-sales-manager',
        displayName: 'Витрина мобильного менеджера продаж',
        id: 10,
        isDeleted: false,
        name: 'Витрина ММП',
        orderNumber: 0,
    }
];

const TEST_CHECKED_APPS = [10];

const TEST_RES = {
    'mobile-sales-manager': {
        label: 'Витрина мобильного менеджера продаж',
        id: 10,
        disabled: false,
        checked: true
    }
};

describe('UserFormHelper test', () => {
    it('should call getUserAppsCheckboxes function', () => {
        expect(getUserAppsCheckboxes(TEST_APPS, TEST_CHECKED_APPS)).toEqual(TEST_RES);
    });
});
