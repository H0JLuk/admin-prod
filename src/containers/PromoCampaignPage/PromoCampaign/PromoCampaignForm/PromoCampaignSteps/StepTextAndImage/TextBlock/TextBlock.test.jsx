import { shallow } from 'enzyme';
import React from 'react';
import { showCount } from '../../../../../../../constants/common';
import TextBlock from './TextBlock';

describe('<TextBlock /> tests', () => {
    const props = {
        title: 'Условия',
        placeholder: 'Текст условий',
        rows: 3,
        maxLength: 60,
        rules: [
            {
                message: 'Заполните поле',
                required: true
            },
        ],
        name: ['texts', 'RULES'],
        initialValue: '',
    };
    const TextBlockItem = shallow(<TextBlock { ...props } />);

    it('TextBlock snapshot', () => {
        expect(TextBlockItem.debug()).toMatchSnapshot();
    });

    it('should show count', () => {
        expect(TextBlockItem.find('ForwardRef').prop('showCount')).toEqual(showCount);
    });
});
