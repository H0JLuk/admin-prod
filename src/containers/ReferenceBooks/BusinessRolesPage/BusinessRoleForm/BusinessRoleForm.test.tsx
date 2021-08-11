import React from 'react';
import { fireEvent, render, act, screen, waitFor } from '@testing-library/react';
import BusinessRoleForm, { PLACEHOLDER } from './BusinessRoleForm';
import {
    createBusinessRole,
    deleteBusinessRole,
    editBusinessRole,
    getBusinessRoleById,
} from '@apiServices/businessRoleService';
import { sleep } from '@setupTests';
import { BUTTON_TEXT } from '@constants/common';
import { testBusinessRole } from '@testConstants';

jest.mock('@apiServices/businessRoleService', () => ({
    createBusinessRole: jest.fn(),
    deleteBusinessRole: jest.fn(),
    editBusinessRole: jest.fn(),
    getBusinessRoleById: jest.fn(),
}));

const TEST = 'Тест';

const mockHistoryPush = jest.fn();
const mockHistoryReplace = jest.fn();

const match = (id: string | null = '1') => ({
    params: {
        businessRoleId: id,
    },
});

const BusinessRolesListTestProps: any = {
    matchPath: 'test',
    mode: 'add',
    location: {
        state: testBusinessRole,
        pathname: 'test',
    },
    history: {
        push: mockHistoryPush,
        replace: mockHistoryReplace,
    },
};

const errorMessage = 'error';

describe('BusinessRoleList test', () => {
    const Component = (mode = 'add', matchParams = match()) => render(<BusinessRoleForm {...BusinessRolesListTestProps} mode={mode} match={matchParams} />);

    beforeEach(() => {
        (createBusinessRole as jest.Mock).mockResolvedValue({ id: 1, message: 'Successful', status: 'Ok' });
        (deleteBusinessRole as jest.Mock).mockResolvedValue({ message: 'Successful', status: 'Ok' });
        (editBusinessRole as jest.Mock).mockResolvedValue({ message: 'Successful', status: 'Ok' });
        (getBusinessRoleById as jest.Mock).mockResolvedValue(testBusinessRole);
    });

    it('should match snapshot', async () => {
        const RenderComponent = Component();
        await sleep();
        expect(RenderComponent.container).toMatchSnapshot();
    });

    it('should add business role', async () => {
        await waitFor(() => {
            Component();
        });

        await act(async () => {
            fireEvent.change(screen.getByPlaceholderText(PLACEHOLDER.NAME), { target: { value: TEST } });
        });

        await act(async () => {
            fireEvent.change(screen.getByPlaceholderText(PLACEHOLDER.DESCRIPTION), { target: { value: TEST } });
        });

        await act(async () => {
            fireEvent.submit(document.querySelector('#businessRole') as Element);
        });

        expect(createBusinessRole).toBeCalledTimes(1);
    });

    it('should add business role with error', async () => {
        (createBusinessRole as jest.Mock).mockRejectedValue({ message: errorMessage });

        await waitFor(() => {
            Component();
        });

        await act(async () => {
            fireEvent.change(screen.getByPlaceholderText(PLACEHOLDER.NAME), { target: { value: TEST } });
        });

        await act(async () => {
            fireEvent.change(screen.getByPlaceholderText(PLACEHOLDER.DESCRIPTION), { target: { value: TEST } });
        });

        await act(async () => {
            fireEvent.submit(document.querySelector('#businessRole') as Element);
        });

        expect(createBusinessRole).toBeCalledTimes(1);
        expect(screen.getByText(errorMessage)).toBeTruthy();
    });

    it('should edit business role', async () => {
        await waitFor(() => {
            Component('edit');
        });

        await act(async () => {
            fireEvent.change(screen.getByPlaceholderText(PLACEHOLDER.NAME), { target: { value: 'Тестовое имя.' } });
        });

        await act(async () => {
            fireEvent.change(screen.getByPlaceholderText(PLACEHOLDER.DESCRIPTION), { target: { value: TEST } });
        });

        await act(async () => {
            fireEvent.submit(document.querySelector('#businessRole') as Element);
        });

        expect(editBusinessRole).toBeCalledTimes(1);
    });

    it('should delete business role', async () => {
        await waitFor(() => {
            Component('edit');
        });

        await act(async () => {
            fireEvent.click(screen.getByText(BUTTON_TEXT.DELETE));
        });

        await sleep();

        await act(async () => {
            fireEvent.click(screen.getByText(/Да/));
        });

        expect(deleteBusinessRole).toBeCalledTimes(1);
    });

    it('should call error delete business role', async () => {
        (deleteBusinessRole as jest.Mock).mockRejectedValue({ message: errorMessage });

        await waitFor(() => {
            Component('edit');
        });

        await act(async () => {
            fireEvent.click(screen.getByText(BUTTON_TEXT.DELETE));
        });

        await sleep();

        await act(async () => {
            fireEvent.click(screen.getByText(/Да/));
        });

        expect(screen.getByText(errorMessage)).toBeTruthy();
    });

    it('should redirect to business role list', async () => {
        await waitFor(() => {
            Component('edit');
        });

        await act(async () => {
            fireEvent.click(screen.getByText(BUTTON_TEXT.CANCEL));
        });

        expect(mockHistoryPush).toBeCalledTimes(1);
    });

    it('should not find business role id', async () => {
        await waitFor(() => {
            Component('edit', match(null));
        });

        expect(mockHistoryReplace).toBeCalledTimes(1);
    });

    it('should return error for business role id', async () => {
        (getBusinessRoleById as jest.Mock).mockResolvedValue('');

        await waitFor(() => {
            Component('edit', match());
        });

        expect(mockHistoryReplace).toBeCalledTimes(1);
    });

});
