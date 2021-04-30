import React from 'react';
import { shallow } from 'enzyme';
import Field from './Field';

describe('<Field /> with no props', () => {
    console.error = jest.fn();
    const container = shallow(<Field />);

    it('should match the snapshot', () => {
        expect(container.html()).toMatchSnapshot();
    });

    it('check empty values', () => {
        expect(container.find('span').text()).toEqual('');
        expect(container.html()).toEqual('<p class="text"><span class="bold"></span></p>');
    });
});

describe('<Field /> with props', () => {
    const initialProps = {
        label: 'test',
        value: 'test_value',
    };
    const container = shallow(<Field { ...initialProps } />);

    it('should match the snapshot', () => {
        expect(container.html()).toMatchSnapshot();
    });

    it('check empty values', () => {
        expect(container.find('span').text()).toEqual(initialProps.label);
        expect(container.html()).toEqual(`<p class="text"><span class="bold">${initialProps.label}</span>${initialProps.value}</p>`);
    });
});
