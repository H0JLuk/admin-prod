import React from 'react';
import { mount } from 'enzyme';
import UserFormButtonGroup, { BUTTON, INFO_USER_BUTTONS } from './UserFormButtonGroup';
import { LOGIN_TYPES_ENUM } from '../../../../constants/loginTypes';

const CASE_TYPES = {
    NEW: 'new',
    EDIT: 'edit',
    INFO: 'info',
    NONE: '',
};

const LOGIN_TYPE = LOGIN_TYPES_ENUM.PASSWORD;

const TEST_ACTION_PROPS = {
    deleteUser: true,
    editUser: true,
    resetUserPassword: true,
    unlockUser: true,
};

const TEST_ACTION_PROPS_FALSE = {
    deleteUser: false,
    editUser: false,
    resetUserPassword: false,
    unlockUser: false,
};

const TEST_PROPS = {
    blocked: false,
    disableBtn: false,
    onDelete: jest.fn(),
    onCancel: jest.fn(),
    onSubmit: jest.fn(),
    onResetPassword: jest.fn(),
    onEditUser: jest.fn(),
    userLoginType: LOGIN_TYPE,
    actionPermissions: TEST_ACTION_PROPS,
};

describe('<UserFormButtonGroup /> test', () => {
    const Component = (type = CASE_TYPES.EDIT, blocked = false) => mount(
        <UserFormButtonGroup
            { ...TEST_PROPS }
            type={ type }
            userBlocked={ blocked }
        />
    );
    const ComponentEdit = Component();
    const ComponentButtons = ComponentEdit.find('button');

    it('should be mount snap', () => {
        expect(ComponentEdit.html()).toMatchSnapshot();
    });

    it('should be visible type edit buttons and call functions', () => {
        expect(ComponentButtons.at(0).text()).toBe(BUTTON.CANCEL_TEXT);
        ComponentButtons.at(0).simulate('click');
        expect(TEST_PROPS.onCancel).toBeCalledTimes(1);

        expect(ComponentButtons.at(1).text()).toBe(BUTTON.SAVE_EDIT_USER_TEXT);
        ComponentButtons.at(1).simulate('click');
        expect(TEST_PROPS.onSubmit).toBeCalledTimes(1);

        expect(ComponentButtons.at(2).text()).toBe(BUTTON.DELETE_TEXT);
        ComponentButtons.at(2).simulate('click');
        expect(TEST_PROPS.onDelete).toBeCalledTimes(1);
    });

    it('should be visible type new buttons and call functions', () => {
        const ComponentNew = Component(CASE_TYPES.NEW);
        const ComponentNewButtons = ComponentNew.find('button');

        expect(ComponentNewButtons.at(0).text()).toBe(BUTTON.CANCEL_TEXT);
        ComponentNewButtons.at(0).simulate('click');
        expect(TEST_PROPS.onCancel).toBeCalledTimes(1);

        expect(ComponentNewButtons.at(1).text()).toBe(BUTTON.ADD_USER_TEXT);
        ComponentNewButtons.at(1).simulate('click');
        expect(TEST_PROPS.onSubmit).toBeCalledTimes(1);
    });

    it('should be visible type info buttons and call functions with edit user', () => {
        const ComponentInfo = Component(CASE_TYPES.INFO);
        const ComponentInfoButtons = ComponentInfo.find('button');

        expect(ComponentInfoButtons.at(0).text()).toBe(INFO_USER_BUTTONS.RESET_PASSWORD);
        ComponentInfoButtons.at(0).simulate('click');
        expect(TEST_PROPS.onResetPassword).toBeCalledTimes(1);

        expect(ComponentInfoButtons.at(1).text()).toBe(INFO_USER_BUTTONS.EDIT);
        ComponentInfoButtons.at(1).simulate('click');
        expect(TEST_PROPS.onEditUser).toBeCalledTimes(1);

        expect(ComponentInfoButtons.at(2).text()).toBe(BUTTON.DELETE_TEXT);
        ComponentInfoButtons.at(2).simulate('click');
        expect(TEST_PROPS.onDelete).toBeCalledTimes(1);
    });

    it('should be visible button text unblock user', () => {
        const ComponentInfo = Component(CASE_TYPES.INFO, true);
        const ComponentInfoButtons = ComponentInfo.find('button');
        expect(ComponentInfoButtons.at(0).text()).toBe(INFO_USER_BUTTONS.UNBLOCK);
    });

    it('should be visible type info with action permissions false and 0 buttons', () => {
        const ComponentInfo = Component().setProps({ type: CASE_TYPES.INFO, actionPermissions: TEST_ACTION_PROPS_FALSE });
        const ComponentInfoButtons = ComponentInfo.find('button');

        expect(ComponentInfoButtons).toHaveLength(0);
    });

    it('should be null if no matching type', () => {
        jest.spyOn(console, 'error').mockImplementation(() => '');
        const ComponentNull = Component(CASE_TYPES.NONE);
        expect(ComponentNull.html()).toBeNull();
        expect(console.error).toBeCalled();
    });

});