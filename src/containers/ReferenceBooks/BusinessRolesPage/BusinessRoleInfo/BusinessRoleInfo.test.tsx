import React from 'react';
import { fireEvent, render, act, screen, waitFor } from '@testing-library/react';
import BusinessRoleInfo from './BusinessRoleInfo';
import {
    deleteBusinessRole,
    getBusinessRoleById,
} from '@apiServices/businessRoleService';
import { sleep } from '../../../../setupTests';
import { BUTTON_TEXT } from '@constants/common';
import { testBusinessRole } from '../../../../../__tests__/constants';

jest.mock('@apiServices/businessRoleService', () => ({
    deleteBusinessRole: jest.fn(),
    getBusinessRoleById: jest.fn(),
}));

const mockHistoryPush = jest.fn();
const mockHistoryReplace = jest.fn();

const match = (id: string | null = '1') => ({
    params: {
        businessRoleId: id,
    },
});

const BusinessRolesListTestProps: any = {
    matchPath: 'test',
    history: {
        push: mockHistoryPush,
        replace: mockHistoryReplace,
    },
};

const errorMessage = 'error';

describe('BusinessRoleList test', () => {
    const Component = (matchParams = match()) => render(<BusinessRoleInfo {...BusinessRolesListTestProps} match={matchParams} />);

    beforeEach(() => {
        (deleteBusinessRole as jest.Mock).mockResolvedValue({ message: 'Successful', status: 'Ok' });
        (getBusinessRoleById as jest.Mock).mockResolvedValue(testBusinessRole);
    });

    it('should match snapshot', async () => {
        const RenderComponent = Component();
        await sleep();
        expect(RenderComponent.container).toMatchSnapshot();
    });

    it('should delete business role', async () => {
        await waitFor(() => {
            Component();
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

    it('should delete business role with error', async () => {
        (deleteBusinessRole as jest.Mock).mockRejectedValue({ message: errorMessage });

        await waitFor(() => {
            Component();
        });

        await act(async () => {
            fireEvent.click(screen.getByText(BUTTON_TEXT.DELETE));
        });

        await sleep();

        await act(async () => {
            fireEvent.click(screen.getByText(/Да/));
        });

        expect(deleteBusinessRole).toBeCalledTimes(1);
        expect(screen.getByText(errorMessage)).toBeTruthy();
    });

    it('should redirect to edit business role', async () => {
        await waitFor(() => {
            Component();
        });

        await act(async () => {
            fireEvent.click(screen.getByText(BUTTON_TEXT.EDIT));
        });

        await sleep();

        expect(mockHistoryPush).toBeCalledTimes(1);
    });

    it('should call get role with mock api function', async () => {
        await waitFor(() => {
            Component();
        });

        expect(getBusinessRoleById).toBeCalledTimes(1);
    });

    it('should not find business role id and call error', async () => {
        (getBusinessRoleById as jest.Mock).mockRejectedValue({ message: errorMessage });

        await waitFor(() => {
            Component();
        });

        expect(screen.getByText(errorMessage)).toBeTruthy();
    });

    it('should not find business role id', async () => {
        await waitFor(() => {
            Component(match(null));
        });

        expect(mockHistoryReplace).toBeCalledTimes(1);
    });

    it('should return error for business role id', async () => {
        (getBusinessRoleById as jest.Mock).mockResolvedValue('');

        await waitFor(() => {
            Component();
        });

        expect(mockHistoryReplace).toBeCalledTimes(1);
    });

});
