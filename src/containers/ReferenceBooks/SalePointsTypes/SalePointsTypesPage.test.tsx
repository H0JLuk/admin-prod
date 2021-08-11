import React from 'react';
import { fireEvent, render, act, screen } from '@testing-library/react';
import { BUTTON_TEXT } from '@constants/common';
import { deleteSalePointType, getActiveSalePointTypesList } from '@apiServices/salePointService';
import SalePointsTypesPage from './SalePointsTypesPage';
import { salePointTypeTestResponse, testSalePointType } from '@testConstants';
import { sleep } from '@setupTests';

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

jest.mock('@apiServices/salePointService', () => ({
    deleteSalePointType: jest.fn(),
    getActiveSalePointTypesList: jest.fn(),
}));

const SalePointTypesPageTestProps: any = {
    matchPath: 'test',
    history: {
        push: mockHistoryPush,
    },
};

describe('SalePointsTypesPage test', () => {
    const Component = () => render(<SalePointsTypesPage {...SalePointTypesPageTestProps} />);


    beforeEach(() => {
        (getActiveSalePointTypesList as jest.Mock).mockResolvedValue(salePointTypeTestResponse.list);
        (deleteSalePointType as jest.Mock).mockResolvedValue({ message: 'Successful', status: 'Ok' });
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
        expect(screen.getByText(/ТБ/)).toBeTruthy();
        expect(getActiveSalePointTypesList).toBeCalledTimes(1);
    });

    it('should call getSalePointTypesList function with error', async () => {
        (getActiveSalePointTypesList as jest.Mock).mockRejectedValue(new Error('Error'));

        const consoleSpy = jest.spyOn(console, 'warn').mockImplementationOnce(() => undefined);

        await act(async () => {
            Component();
        });

        expect(getActiveSalePointTypesList).toBeCalledTimes(1);
        expect(consoleSpy).toBeCalledTimes(1);
    });

    it('should call redirect to add sale point type', async () => {
        await act(async () => {
            Component();
        });

        expect(screen.getByText(BUTTON_TEXT.ADD)).toBeTruthy();

        await act(async () => {
            fireEvent.click(screen.getByText(BUTTON_TEXT.ADD));
        });

        expect(mockHistoryPush).toBeCalledTimes(1);
    });

    it('should call redirect to edit sale point type', async () => {
        await act(async () => {
            Component();
        });

        await act(async () => {
            fireEvent.click(screen.getByText(testSalePointType.name));
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
            fireEvent.click(screen.getByText(/ТБ/));
        });

        expect(screen.getByText(/Выбрано 1/)).toBeTruthy();

        await act(async () => {
            fireEvent.click(screen.getByText(/ТБ/));
        });
    });

    it('should cancel item selection', async () => {
        await act(async () => {
            Component();
        });
        await act(async () => {
            fireEvent.click(screen.getByText(BUTTON_TEXT.SELECT));
        });

        await act(async () => {
            fireEvent.click(screen.getByText(/ТБ/));
        });
        await act(async () => {
            fireEvent.click(screen.getByText(BUTTON_TEXT.CANCEL));
        });
        expect(screen.getByText(BUTTON_TEXT.SELECT)).toBeTruthy();
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

        expect(screen.getByText(/Выбрано 2/)).toBeTruthy();

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

        expect(screen.getByText(/Выбрано 2/)).toBeTruthy();

        await act(async () => {
            fireEvent.click(screen.getByText(BUTTON_TEXT.DELETE));
        });

        await act(async () => {
            fireEvent.click(screen.getByTestId('deleteFunction'));
        });

        expect(getActiveSalePointTypesList).toBeCalledTimes(1);

        await act(async () => {
            fireEvent.click(screen.getByTestId('refreshTable'));
        });

        expect(getActiveSalePointTypesList).toBeCalledTimes(2);
    });
});
