import React from 'react';
import { mount } from 'enzyme';
import MenuLinks from './MenuLinks';
import { getAppCode, getRole } from '../../api/services/sessionService';
import { resolveMenuItemsByRoleAndAppCode } from '../../constants/menuByRole';
import { MemoryRouter } from 'react-router';

jest.mock('../../api/services/sessionService', () => ({
    getAppCode: jest.fn(),
    getRole: jest.fn()
}));

jest.mock('../../constants/menuByRole', () => ({
    resolveMenuItemsByRoleAndAppCode: jest.fn()
}));

const TEST_ITEM = {
    label: 'TEST_ITEM',
    path: 'TEST_PATH'
};

const TEST_RESOLVE_MENU_ITEMS = [
    TEST_ITEM.label,
    [
        { label: TEST_ITEM.label, path: TEST_ITEM.path },
    ]
];

describe('<MenuLinks /> test', () => {

    beforeEach(() => {
        resolveMenuItemsByRoleAndAppCode.mockReturnValue(TEST_RESOLVE_MENU_ITEMS);
    });

    it('should be mount snap', () => {
        expect(mount(
            <MemoryRouter>
                <MenuLinks />
            </MemoryRouter>
        ).html()).toMatchSnapshot();
    });

    it('should show MenuLinks', async () => {
        const Component = mount(
            <MemoryRouter>
                <MenuLinks />
            </MemoryRouter>
        );
        expect(getAppCode).toBeCalledTimes(1);
        expect(getRole).toBeCalledTimes(1);
        expect(Component.find('NavLink')).toHaveLength(1);
    });
});
