import React from 'react';
import { shallow } from 'enzyme';
import UserSkeletonLoading from './UserSkeletonLoading';

describe('<UserSkeletonLoading /> test', () => {
    const Component = shallow(<UserSkeletonLoading />);

    it('should be mount snap', () => {
        expect(Component.html()).toMatchSnapshot();
    });
});
