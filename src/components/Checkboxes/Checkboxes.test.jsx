import React from 'react';
import { shallow } from 'enzyme';
import Checkboxes, { CheckBoxCustom } from './Checkboxes';

const TEST_PROPS_CHECKBOX_CUSTOM = [
    {
        label: 'TEST_LABEL_ONE',
        disabled: false,
        checked: false,
        name: 'TEST_KEY_ONE',
        onChange: jest.fn(),
    },
    {
        label: 'TEST_LABEL_TWO',
        disabled: false,
        checked: false,
        name: 'TEST_KEY_TWO',
        onChange: jest.fn(),
    },
];

const TEST_PROPS = {
    checkboxesData: {
        TEST_KEY_ONE: TEST_PROPS_CHECKBOX_CUSTOM[0],
        TEST_KEY_TWO: TEST_PROPS_CHECKBOX_CUSTOM[1],
    },
    onChange: jest.fn(),
    onChangeAll: jest.fn(),
    disabledAll: false,
};

describe('<Checkboxes /> test', () => {
    const Component = shallow(<Checkboxes { ...TEST_PROPS } />);

    it('should be mount snap', () => {
        expect(Component.html()).toMatchSnapshot();
    });

    it('should call onChangeAll function', () => {
        const CheckboxCheckAll = Component.find('[name="all"]');
        CheckboxCheckAll.simulate('change');
        expect(TEST_PROPS.onChangeAll).toBeCalledTimes(1);
    });

    it('should checked one checkbox', () => {
        const custom = shallow(<CheckBoxCustom { ...TEST_PROPS_CHECKBOX_CUSTOM[0] } />);
        custom.simulate('change', { target: { checked: true } });
        expect(TEST_PROPS_CHECKBOX_CUSTOM[0].onChange).toHaveBeenCalledWith(true, 'TEST_KEY_ONE');
        expect(TEST_PROPS_CHECKBOX_CUSTOM[0].onChange).toBeCalledTimes(1);
    });
});
