import React from 'react';
import { act } from 'react-dom/test-utils';
import { mount } from 'enzyme';
import { RESET_LABEL } from '../../containers/GroupsPage/GroupList/groupListConstants';
import DropdownWithAction from './DropdownWithAction';

const TEST_DROPDOWN_LABEL = 'Сортировать';

const TEST_MENU_ITEMS = [
    {
        name: 'TEST_NAME_ONE',
        label: 'TEST_LABEL_ONE',
        active: false
    },
    {
        name: 'TEST_NAME_TWO',
        label: 'TEST_LABEL_TWO',
        active: false
    }
];

const TEST_PROPS = {
    dropdownLabel: TEST_DROPDOWN_LABEL,
    onMenuItemClick: jest.fn(),
    menuItems: TEST_MENU_ITEMS,
    withReset: false,
    resetLabel: RESET_LABEL,
};

describe('test to open dropdown and select element', () => {
    const Dropdown = mount(<DropdownWithAction { ...TEST_PROPS } />);

    it('open dropdown', () => {
        const DropdownButton = Dropdown.find('button');
        DropdownButton.simulate('click');
        const OpenDropdown = Dropdown.find('button.ant-dropdown-open');
        expect(OpenDropdown.debug()).not.toBe('');
    });

    it('click menu item element', () => {
        const DropdownMenuItems = document.querySelectorAll('div .ant-dropdown .dropdownMenuItem');
        const DropdownMenuItem = document.querySelector('div .ant-dropdown .dropdownMenuItem');
        expect(DropdownMenuItem).toMatchSnapshot();
        expect(DropdownMenuItems).toHaveLength(2);

        act(() => {
            const overlay = Dropdown.childAt(0).prop('overlay');
            overlay.props.children[0][0].props.onClick();
            expect(TEST_PROPS.onMenuItemClick).toHaveBeenCalledWith(TEST_MENU_ITEMS[0].name);
            expect(TEST_PROPS.onMenuItemClick).toHaveBeenCalledTimes(1);
        });

    });
});
