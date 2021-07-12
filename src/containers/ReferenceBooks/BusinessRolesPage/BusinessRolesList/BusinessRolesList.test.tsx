import React from 'react';
import { fireEvent, render, act, screen } from '@testing-library/react';
import BusinessRolesList from './BusinessRolesList';
import { deleteBusinessRole, getBusinessRoles } from '@apiServices/businessRoleService';
import { BUTTON_TEXT } from '@constants/common';
import { sleep } from '../../../../setupTests';
import { businessRolesTestResponse, testBusinessRole } from '../../../../../__tests__/constants';

type mockTableDeleteModalType = {
    listIdForRemove: number[];
    refreshTable: () => void;
    deleteFunction: () => void;
};

jest.mock('@components/TableDeleteModal',
    () =>
        ({ listIdForRemove, refreshTable, deleteFunction }: mockTableDeleteModalType) => (
            <div data-testid="checkboxes">
                <span data-testid="listIdForRemove">{JSON.stringify(listIdForRemove)}</span>
                <button data-testid="refreshTable" onClick={refreshTable}>Хорошо</button>
                <button data-testid="deleteFunction" onClick={deleteFunction}>Удалить</button>
            </div>
        ));

const mockHistoryPush = jest.fn();

jest.mock('react-router-dom', () => ({
    generatePath: jest.fn(),
    useHistory: () => ({
        push: jest.fn(),
        location: 'TEST_LOCATION',
        replace: jest.fn(),
    }),
}));

jest.mock('@apiServices/businessRoleService', () => ({
    deleteBusinessRole: jest.fn(),
    getBusinessRoles: jest.fn(),
}));

const BusinessRolesListTestProps: any = {
    matchPath: 'test',
    history: {
        push: mockHistoryPush,
    },
};

describe('BusinessRoleList test', () => {
    const Component = () => render(<BusinessRolesList {...BusinessRolesListTestProps} />);

    beforeEach(() => {
        (getBusinessRoles as jest.Mock).mockResolvedValue(businessRolesTestResponse);
        (deleteBusinessRole as jest.Mock).mockResolvedValue({ message: 'Successful', status: 'Ok' });
    });

    it('should match snapshot', async () => {
        const RenderComponent = Component();
        await sleep();
        expect(RenderComponent).toMatchSnapshot();
    });

    it('should call getBusinessRoles function', async () => {
        await act(async () => {
            Component();
        });
        expect(screen.getByText(/Заместитель руководителя ВИП ВСП/)).toBeTruthy();
        expect(getBusinessRoles).toBeCalledTimes(1);
    });

    it('should call getBusinessRoles function with error', async () => {
        (getBusinessRoles as jest.Mock).mockRejectedValue('Error');

        const consoleSpy = jest.spyOn(console, 'warn').mockImplementationOnce(() => undefined);

        await act(async () => {
            Component();
        });

        expect(getBusinessRoles).toBeCalledTimes(1);
        expect(consoleSpy).toBeCalledTimes(1);
    });

    it('should call redirect to add business role', async () => {
        await act(async () => {
            Component();
        });

        expect(screen.getByText(BUTTON_TEXT.ADD)).toBeTruthy();

        await act(async () => {
            fireEvent.click(screen.getByText(BUTTON_TEXT.ADD));
        });

        expect(mockHistoryPush).toBeCalledTimes(1);
    });

    it('should call redirect to info business role', async () => {
        await act(async () => {
            Component();
        });

        await act(async () => {
            fireEvent.click(screen.getByText(testBusinessRole.name));
        });

        expect(mockHistoryPush).toBeCalledTimes(1);
    });

    it('should select one item', async () => {
        await act(async () => {
            Component();
        });

        await act(async () => {
            fireEvent.click(screen.getByText(BUTTON_TEXT.SELECT));
        });

        await act(async () => {
            fireEvent.click(screen.getByText(/Заместитель руководителя ВИП ВСП/));
        });

        expect(screen.getByText(/Выбрано 1/)).toBeTruthy();

        await act(async () => {
            fireEvent.click(screen.getByText(/Заместитель руководителя ВИП ВСП/));
        });
    });

    it('should select item by click on checkbox', async () => {
        await act(async () => {
            Component();
        });

        await act(async () => {
            fireEvent.click(screen.getByText(BUTTON_TEXT.SELECT));
        });

        await act(async () => {
            fireEvent.click(document.querySelector('.ant-checkbox')!);
        });

        expect(screen.getByText(/Выбрано 1/)).toBeTruthy();
    });

    it('should select all items', async () => {
        await act(async () => {
            Component();
        });

        await act(async () => {
            fireEvent.click(screen.getByText(BUTTON_TEXT.SELECT));
        });

        await act(async () => {
            fireEvent.click(screen.getByText(BUTTON_TEXT.SELECT_ALL));
        });

        expect(screen.getByText(/Выбрано 3/)).toBeTruthy();

        await act(async () => {
            fireEvent.click(screen.getByText(BUTTON_TEXT.CANCEL_ALL));
        });
    });

    it('should show delete modal and delete item', async () => {
        await act(async () => {
            Component();
        });

        await act(async () => {
            fireEvent.click(screen.getByText(BUTTON_TEXT.SELECT));
        });

        await act(async () => {
            fireEvent.click(screen.getByText(BUTTON_TEXT.SELECT_ALL));
        });

        expect(screen.getByText(/Выбрано 3/)).toBeTruthy();

        await act(async () => {
            fireEvent.click(screen.getByText(BUTTON_TEXT.DELETE));
        });

        await act(async () => {
            fireEvent.click(screen.getByTestId('deleteFunction'));
        });

        expect(deleteBusinessRole).toBeCalledTimes(2);

        await act(async () => {
            fireEvent.click(screen.getByTestId('refreshTable'));
        });

        expect(getBusinessRoles).toBeCalledTimes(2);
    });
});
