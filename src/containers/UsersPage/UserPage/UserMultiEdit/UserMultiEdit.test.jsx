import React from 'react';
import { mount, shallow } from 'enzyme';
import UserMultiEdit, { CHOSE_USERS_COUNT } from './UserMultiEdit';
import { editLocationAndSalePointUsers, removeUser } from '../../../../api/services/usersService';
import { sleep } from '../../../../setupTests';
import { act } from 'react-dom/test-utils';

jest.mock('../../../../api/services/usersService', () => ({
    editLocationAndSalePointUsers: jest.fn(),
    removeUser: jest.fn(),
}));

const mockHistoryPush = jest.fn();
let mockA = true;

jest.mock('react-router-dom', () => ({
    useParams: () => ({ userId: 1 }),
    useHistory: () => ({
        push: mockHistoryPush,
    }),
    useLocation: () => ({
        state: {
            users: mockA ? [
                {
                    blocked: false,
                    clientAppIds: null,
                    id: 287,
                    locationId: 233,
                    locationName: 'Тамбов',
                    loginType: 'PASSWORD',
                    personalNumber: '12222222',
                    role: 'User',
                    salePointId: 1513,
                    salePointName: '013_8594_3926',
                    tempPassword: true,
                    tmpBlocked: false,
                },
                {
                    blocked: false,
                    clientAppIds: null,
                    id: 136,
                    locationId: 137,
                    locationName: 'Калининград',
                    loginType: 'PASSWORD',
                    personalNumber: '111111',
                    role: 'User',
                    salePointId: 887,
                    salePointName: '055_8626_1236',
                    tempPassword: true,
                    tmpBlocked: false,
                }
            ] : undefined,
        }
    }),
}));

const TEST_PROPS = {
    matchPath: 'TEST_PATH'
};

const TEST_USER_DATA = {
    LOCATION: 'TEST_LOCATION',
    SALE_POINT: '38',
};

describe('<UserMultiEdit /> test', () => {
    const ComponentMount = () => mount(<UserMultiEdit { ...TEST_PROPS } />);
    const ComponentShallow = () => shallow(<UserMultiEdit { ...TEST_PROPS } />);

    it('should be mount snap', () => {
        const Component = ComponentMount();
        expect(Component.html()).toMatchSnapshot();
    });

    it('should find two users', () => {
        const Component = ComponentMount();
        expect(Component.find('.pageTitle').text()).toBe(`${CHOSE_USERS_COUNT} 2`);
    });

    it('should input edit users data and call submit function', async () => {
        const Component = ComponentShallow();
        const Autocomplete = Component.find('AutocompleteLocationAndSalePoint');
        Autocomplete.props().onLocationChange(TEST_USER_DATA.LOCATION);
        Autocomplete.props().onSalePointChange(TEST_USER_DATA.SALE_POINT);

        const ButtonGroup = Component.find('UserFormButtonGroup');
        ButtonGroup.props().onSubmit();
        await sleep();
        expect(editLocationAndSalePointUsers).toBeCalledTimes(1);
        expect(mockHistoryPush).toBeCalledTimes(1);
    });

    it('should input edit users data and call submit function with catch', async () => {
        editLocationAndSalePointUsers.mockRejectedValue(new Error('Error'));
        const Component = ComponentShallow();
        const Autocomplete = Component.find('AutocompleteLocationAndSalePoint');
        Autocomplete.props().onLocationChange(TEST_USER_DATA.LOCATION);
        Autocomplete.props().onSalePointChange(TEST_USER_DATA.SALE_POINT);
        const ButtonGroup = Component.find('UserFormButtonGroup');
        ButtonGroup.props().onSubmit();
        await sleep();
        expect(editLocationAndSalePointUsers).toBeCalledTimes(1);
        expect(ButtonGroup.find('.formError')).toBeTruthy();
    });

    it('should input edit users data and call submit function with error sale point', async () => {
        const Component = ComponentMount();
        const Autocomplete = Component.find('AutocompleteLocationAndSalePoint');

        act(() => {
            Autocomplete.props().onLocationChange(TEST_USER_DATA.LOCATION);
        });

        const ButtonGroup = Component.find('UserFormButtonGroup');

        act(() => {
            ButtonGroup.props().onSubmit();
        });

        expect(Component.find('.formError')).toBeTruthy();
    });

    it('should call delete users function', async () => {
        const Component = ComponentMount();
        const ButtonGroup = Component.find('UserFormButtonGroup');

        await act(async () => {
            ButtonGroup.props().onDelete();
        });

        expect(removeUser).toBeCalledTimes(2);
    });

    it('should call delete users function with catch', async () => {
        removeUser.mockRejectedValue(new Error('Error'));
        const Component = ComponentMount();
        const ButtonGroup = Component.find('UserFormButtonGroup');

        await act(async () => {
            ButtonGroup.props().onDelete();
        });

        expect(ButtonGroup.find('.formError')).toBeTruthy();
    });

    it('should call cancel function', () => {
        const Component = ComponentShallow();
        const ButtonGroup = Component.find('UserFormButtonGroup');
        ButtonGroup.props().onCancel();
        expect(mockHistoryPush).toBeCalledTimes(1);
    });

    it('should redirect to user page with users length equal 0', () => {
        mockA = false;

        act(() => {
            ComponentMount();
        });

        expect(mockHistoryPush).toBeCalledTimes(1);
        expect(mockHistoryPush).toBeCalledWith(TEST_PROPS.matchPath);
        mockA = true;
    });

});