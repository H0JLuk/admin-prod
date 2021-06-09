import React from 'react';
import { shallow } from 'enzyme';
import { fireEvent, render } from '@testing-library/react';
import { matchPath } from 'react-router-dom';
import { getActiveClientApps } from '../../api/services/clientAppService';
import { getAppCode, getRole, saveAppCode } from '../../api/services/sessionService';
import Sidebar from './Sidebar';
import { sleep } from '../../setupTests';
import { goApp } from '../../utils/appNavigation';
import { clientAppListTestResponse, resolveMenuItemsByRoleAndAppCodeValue } from '../../../__tests__/constants';
import * as menuRoleFuncs from '../../constants/menuByRole';

const mockPush = jest.fn();
jest.mock('react-router-dom', () => ({
    ...jest.requireActual('react-router-dom'),
    useHistory: () => ({
        push: mockPush,
    }),
    useLocation: () => ({ pathname: '/admin/users' }),
    matchPath: jest.fn(),
    NavLink() {
        return <a>NavLink</a>;
    },
}));

jest.mock('../../api/services/sessionService', () => ({
    getAppCode: jest.fn(),
    getRole: jest.fn(),
    saveAppCode: jest.fn(),
}));

jest.mock('../../api/services/clientAppService', () => ({
    getDefaultAppCode: jest.fn(),
    getActiveClientApps: jest.fn(),
    setDefaultAppCode: jest.fn(),
}));

jest.mock('../../utils/appNavigation', () => ({
    goApp: jest.fn(),
}));

describe('<Sidebar /> tests', () => {
    it('Sidebar snapshot', () => {
        const SidebarItem = shallow(<Sidebar />);
        expect(SidebarItem.html()).toMatchSnapshot();
    });

    it('should call useEffect and handleAdministrate func', async () => {
        matchPath.mockImplementation(() => undefined);
        getActiveClientApps.mockResolvedValue(clientAppListTestResponse.list);

        const SidebarItem = render(<Sidebar />);
        expect(getActiveClientApps).toBeCalled();

        await sleep();

        fireEvent.click(SidebarItem.getByText('Витрина ВСП'));
        expect(saveAppCode).toBeCalled();
        expect(goApp).toBeCalled();
    });

    it('should not render Sidebar', () => {
        matchPath.mockImplementation(() => '/admin/users');
        const SidebarItem = shallow(<Sidebar />);
        expect(SidebarItem.html()).toBeNull();
    });

    it('should render menu and return undefined in useEffect', () => {
        getRole.mockImplementation(() => 'UserManager');
        getAppCode.mockImplementation(() => 'mobile-sales-manager');
        menuRoleFuncs.resolveMenuItemsByRoleAndAppCode = jest.fn(
            () => resolveMenuItemsByRoleAndAppCodeValue
        );

        const { container } = render(<Sidebar />);
        expect(container.getElementsByClassName('menu')[0]).toBeInTheDocument();
        expect(getActiveClientApps).toBeCalledTimes(0);
    });

    it('should not render menuItems', () => {
        menuRoleFuncs.resolveMenuItemsByRoleAndAppCode.mockImplementation(() => [ [] ]);
        const SidebarItem = shallow(<Sidebar />);
        expect(SidebarItem.find('Menu.Item')).toHaveLength(0);
    });

    it('should not render appLink', () => {
        matchPath.mockImplementation(() => undefined);
        getActiveClientApps.mockRejectedValue([]);
        menuRoleFuncs.resolveMenuItemsByRoleAndAppCode = jest.fn(
            () => resolveMenuItemsByRoleAndAppCodeValue
        );

        const SidebarItem = shallow(<Sidebar />);
        expect(SidebarItem.find('.appLink')).toHaveLength(0);
    });
});
