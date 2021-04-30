import React from 'react';
import { shallow } from 'enzyme';
import DashboardFilterTag from './DashboardFilterTag';

const props = {
    handleClick: jest.fn(),
    id: 1,
    displayName: 'test',
    selected: false,
};

describe('<DashboardFilterTag /> test', () => {
    const container = shallow(<DashboardFilterTag { ...props } />);

    it('should be mount snap', () => {
        expect(container.html()).toMatchSnapshot();
    });

    it('handleClick should be called', () => {
        container.find('.tag').simulate('click');
        expect(props.handleClick).toHaveBeenCalledWith(1, true);
    });
});
