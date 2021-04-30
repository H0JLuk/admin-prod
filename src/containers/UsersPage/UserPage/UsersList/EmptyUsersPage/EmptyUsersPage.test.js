import React from 'react';
import { shallow } from 'enzyme';

import EmptyUsersPage from './EmptyUsersPage';

import * as helper from '../../../../../utils/helper';
import { USERS_PAGES } from '../../../../../constants/route';

const mockHistoryPush = jest.fn();
jest.mock('react-router-dom', () => ({
    useHistory: () => ({
        push: mockHistoryPush,
    }),
    useRouteMatch: () => ({ path: 'test' }),
}));

describe('<EmptyUsersPage /> test', () => {

    helper.templateLink = jest.fn();

    it('templateLink should be called', () => {
        shallow(<EmptyUsersPage />);
        expect(helper.templateLink).toBeCalled();
    });

    it('should match the snapshot', () => {
        const container = shallow(<EmptyUsersPage />);
        expect(container.html()).toMatchSnapshot();
    });

    it('should go to addUser page', () => {
        const container = shallow(<EmptyUsersPage />);
        container.find('Button').simulate('click');
        expect(mockHistoryPush).toHaveBeenCalledWith(`test${USERS_PAGES.ADD_USER}`);
    });
});
