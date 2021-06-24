import React from 'react';
import { shallow } from 'enzyme';
import UsersListTable from './UsersListTable';

describe('UserListTable test', () => {
    it('should match snapshot', () => {
        const wrapper = shallow(<UsersListTable />);
        expect(wrapper.debug()).toMatchSnapshot();
    });
});
