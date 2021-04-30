import React from 'react';
import { mount } from 'enzyme';

import ButtonsBlock from './ButtonsBlock';

const TEST_BUTTONS_PROPS = [
    {
        label: 'TEST_TEXT_ONE',
        type: 'TEST_PRIMARY_TYPE',
        onClick: jest.fn(),
        disabled: false,
    },
    {
        label: 'TEST_TEXT_TWO',
        type: 'TEST_DANGER_TYPE',
        onClick: jest.fn(),
        disabled: true,
    },
];

const TEST_PROPS = {
    buttons: TEST_BUTTONS_PROPS,
    params: false
};

describe('<ButtonsBlock /> tests.', () => {
    const buttonBlock = mount(<ButtonsBlock { ...TEST_PROPS } />);
    const buttons = buttonBlock.find('button');

    it('should mount buttons', () => {
        expect(buttonBlock.html()).toMatchSnapshot();
        expect(buttons).toHaveLength(TEST_BUTTONS_PROPS.length);
    });

    it('should click to button', () => {
        buttons.at(0).simulate('click');
        expect(TEST_BUTTONS_PROPS[0].onClick).toHaveBeenCalledTimes(1);
    });

    it('should not click to disabled button', () => {
        buttons.at(1).simulate('click');
        expect(TEST_BUTTONS_PROPS[1].onClick).toHaveBeenCalledTimes(0);
    });
});
