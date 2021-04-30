import React from 'react';
import { generatePath } from 'react-router-dom';
import UserList from './UsersList';
import { fireEvent, render, act, screen } from '@testing-library/react';
import { sleep } from '../../../../setupTests';
import { permissionsTestData, usersListTestData, usersTestArray } from '../../../../../__tests__/constants';
import * as usersService from '../../../../api/services/usersService';
import { shallow } from 'enzyme';
import { USERS_PAGES } from '../../../../constants/route';
import * as permissions from '../../../../constants/permissions';

const DEFAULT_URL_SEARCH_PARAMS = 'pageNo=0&pageSize=10&sortBy=&direction=ASC&filterText=';
const diffLoginTypeUsersListTestData = {
    ...usersListTestData,
    users: [
        ...usersListTestData['users'].slice(10),
        { ...usersListTestData['users'][11], loginType: 'SBER_REGISTRY', id: 22882 }
    ],
};

jest.mock('../../../../components/TableDeleteModal/TableDeleteModal', () => ({ modalClose, visible, refreshTable }) => (
    <div>
        { visible && (
            <div>
                <div>Modal</div>
                <button onClick={ modalClose }>close</button>
                <button onClick={ refreshTable }>refresh</button>
            </div>
        ) }
    </div>
));
jest.mock('./EmptyUsersPage/EmptyUsersPage', () => () => (<div>EmptyUsersPage</div>));
jest.mock('../UserForm', () => () => (<div>UserForm</div>));

const mockPush = jest.fn();

jest.mock('../../../../utils/notifications', () => ({
    customNotifications: {
        success: jest.fn(),
        error: jest.fn(),
    }
}));

jest.mock('react-router-dom', () => ({
    ...jest.requireActual('react-router-dom'),
    useHistory: () => ({
        push: mockPush,
        replace: jest.fn(),
        location: {
            search: '?pageNo=0&pageSize=10&sortBy=&direction=ASC&filterText=',
        },
    }),
    useLocation: () => ({
        search: '?pageNo=0&pageSize=10&sortBy=&direction=ASC&filterText=',
    }),
    generatePath: jest.fn(),
}));

beforeEach(() => {
    usersService.getUsersList = jest.fn().mockResolvedValue(usersListTestData);
    permissions.getCurrUserInteractions = jest.fn().mockReturnValue(permissionsTestData);
});

describe('<UsersList /> test', () => {
    const props = {
        matchPath: '/admin/users',
    };

    it('UserList snapshot', () => {
        const wrapper = shallow(<UserList { ...props } />);

        expect(wrapper.debug()).toMatchSnapshot();
    });

    it('should run getUsersList fn with default search params', async () => {
        await act(async () => {
            render(<UserList { ...props } />);
            await sleep();

            expect(usersService.getUsersList).toBeCalledWith(DEFAULT_URL_SEARCH_PARAMS);
        });
    });

    it('should show loading message while fetching', async () => {
        await act(async () => {
            const { getByText } = render(<UserList { ...props } />);

            expect(getByText(/Загрузка.../)).toBeInTheDocument();
        });
    });

    it('should load list of user after fetch', async () => {
        await act(async () => {
            const { getByText } = render(<UserList { ...props } />);
            await sleep();

            expect(getByText(/Краснозаводск/)).toBeInTheDocument();
        });
    });

    it('should show error message rejected from loadUsersData', async () => {
        const spy = jest.spyOn(console, 'error').mockImplementation(() => '');
        usersService.getUsersList = jest.fn().mockRejectedValue('error');
        await act(async () => {
            render(<UserList { ...props } />);
            await sleep();

            expect(spy).toBeCalled();
        });
    });

    it('should run history.push on add user btn click', async () => {
        await act(async () => {
            const { getAllByText } = render(<UserList { ...props } />);
            await sleep();
            const addBtn = getAllByText(/Добавить/)[0];

            fireEvent.click(addBtn);
            expect(mockPush).toBeCalledWith(`${props.matchPath}${USERS_PAGES.ADD_USER}`);
        });
    });

    it('should switch chooseBtn to cancelBtn on click & vice versa', async () => {
        await act(async () => {
            const { getByText } = render(<UserList { ...props } />);
            await sleep();

            fireEvent.click(getByText(/Выбрать/));
            expect(getByText(/Отменить/)).toBeInTheDocument();
            expect(getByText(/Выбрать все/)).toBeInTheDocument();

            fireEvent.click(getByText(/Отменить/));
            expect(getByText(/Выбрать/)).toBeInTheDocument();
        });
    });

    it('should switch chooseAllBtn to cancelSelectionBtn on click & vice versa', async () => {
        await act(async () => {
            const { getByText } = render(<UserList { ...props } />);
            await sleep();

            fireEvent.click(getByText(/Выбрать/));
            fireEvent.click(getByText(/Выбрать все/));
            fireEvent.click(getByText(/Отменить выбор/));

            expect(getByText(/Выбрать все/)).toBeInTheDocument();
        });
    });

    it('should fire onclick fn for table row', async () => {
        render(<UserList { ...props } />);
        await sleep();

        fireEvent.click(document.querySelector('.ant-table-row'));
        expect(generatePath).toBeCalledWith(`${props.matchPath}${USERS_PAGES.USER_INFO}`, { userId: 1 });
        expect(mockPush).toBeCalled();
    });

    it('should redirect on edit btn click when items selected', async () => {
        await act(async () => {
            const { getByText } = render(<UserList { ...props } />);
            await sleep();

            fireEvent.click(getByText(/Выбрать/));
            fireEvent.click(document.querySelectorAll('.ant-checkbox-input')[2]);
            fireEvent.click(getByText(/Редактировать/));
            expect(mockPush).toBeCalledWith(`${props.matchPath}${USERS_PAGES.EDIT_SOME_USERS}`, { users: [usersTestArray[2]] });
        });
    });

    it('should redirect on row click', async () => {
        generatePath.mockReturnValue(`${props.matchPath}/4`);
        await act(async () => {
            const { container } = render(<UserList { ...props } />);
            await sleep();

            fireEvent.click(container.querySelector('.ant-table-row'));
            expect(mockPush).toBeCalled();
            expect(mockPush).toBeCalledWith(`${props.matchPath}/4`);
        });
    });

    it('should select/unselect on row click', async () => {
        await act(async () => {
            const { container, getByText } = render(<UserList { ...props } />);
            await sleep();

            fireEvent.click(getByText(/Выбрать/));
            const tr = container.querySelectorAll('.ant-table-row')[2];

            fireEvent.click(tr);
            expect(getByText(/Выбрано 1/)).toBeInTheDocument();

            fireEvent.click(tr);
            expect(getByText(/Выбрано 0/)).toBeInTheDocument();
        });
    });

    it('should not select on row click', async () => {
        await act(async () => {
            const { container, getByText } = render(<UserList { ...props } />);
            await sleep();

            fireEvent.click(getByText(/Выбрать/));
            fireEvent.click(container.querySelector('.ant-table-row'));
            expect(getByText(/Выбрано 0/)).toBeInTheDocument();
        });
    });

    it('should reset pass', async () => {
        usersService.resetUser = jest.fn().mockResolvedValue({});
        await act(async () => {
            const { getByText } = render(<UserList { ...props } />);
            await sleep();

            fireEvent.click(getByText(/Выбрать/));
            fireEvent.click(getByText(/Выбрать все/));
            fireEvent.click(getByText(/Сбросить пароль/));
            await sleep();

            expect(usersService.resetUser).toBeCalled();
        });
    });

    it('should not reset pass according to diff login type test data', async () => {
        usersService.resetUser = jest.fn().mockResolvedValue({});
        usersService.getUsersList = jest.fn().mockResolvedValue(diffLoginTypeUsersListTestData);
        await act(async () => {
            const { getByText } = render(<UserList { ...props } />);
            await sleep();

            fireEvent.click(getByText(/Выбрать/));
            fireEvent.click(getByText(/Выбрать все/));
            fireEvent.click(getByText(/Сбросить пароль/));
            await sleep();

            expect(usersService.resetUser).not.toBeCalled();
        });
    });

    it('should successfully resets passwords with rejected one too', async () => {
        usersService.resetUser = jest.fn().mockRejectedValueOnce('error').mockResolvedValue({});
        await act(async () => {
            render(<UserList { ...props } />);
        });
        await sleep();

        await act(async () => {
            fireEvent.click(screen.getByText('Выбрать'));
        });

        await act(async () => {
            fireEvent.click(screen.getByText('Выбрать все'));
        });

        await act(async () => {
            fireEvent.click(screen.getByText('Сбросить пароль'));
        });

        expect(screen.getByText('Выбрано 0')).toBeInTheDocument();
    });

    it('should reject Promise.all while resetting passwords', async () => {
        Promise.allSettled = jest.fn().mockRejectedValueOnce([ { status: 'error' } ]);
        const spy = jest.spyOn(console, 'warn').mockImplementation(() => '');
        await act(async () => {
            render(<UserList { ...props } />);
        });
        await sleep();

        await act(async () => {
            fireEvent.click(screen.getByText('Выбрать'));
        });

        await act(async () => {
            fireEvent.click(screen.getByText('Выбрать все'));
        });

        await act(async () => {
            fireEvent.click(screen.getByText('Сбросить пароль'));
        });

        expect(spy).toBeCalled();
    });

    it('should call `getUsersList` when changed page', async () => {
        await act(async () => {
            const { container } = render(<UserList { ...props } />);
            await sleep();

            fireEvent.click(container.querySelector('.ant-pagination-item.ant-pagination-item-2'));
            await sleep();

            expect(usersService.getUsersList).toBeCalled();
        });
    });

    it('should toggle modal', async () => {
        await act(async () => {
            const { getByText, queryAllByText } = render(<UserList { ...props } />);
            await sleep();

            fireEvent.click(getByText(/Выбрать/));
            fireEvent.click(getByText(/Выбрать все/));
            fireEvent.click(getByText(/Удалить/));
            expect(getByText(/Modal/)).toBeInTheDocument();

            fireEvent.click(getByText(/close/));
            expect(queryAllByText(/Modal/)).toHaveLength(0);
        });
    });

    it('should run refreshTable ', async () => {
        await act(async () => {
            const { getByText } = render(<UserList { ...props } />);
            await sleep();

            fireEvent.click(getByText(/Выбрать/));
            fireEvent.click(getByText(/Выбрать все/));
            fireEvent.click(getByText(/Удалить/));
            fireEvent.click(getByText(/refresh/));

            expect(usersService.getUsersList).toBeCalledTimes(2);
        });
    });
});
