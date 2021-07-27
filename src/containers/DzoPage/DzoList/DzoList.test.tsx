import React from 'react';
import { generatePath } from 'react-router-dom';
import { act } from 'react-dom/test-utils';
import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { deleteDzo, getAllDzoList, getDzoList } from '@apiServices/dzoService';
import { BUTTON_TEXT } from '@constants/common';
import { requestsWithMinWait } from '../../../utils/utils';
import DzoList from './DzoList';
import { dzoListTestData } from '../../../../__tests__/constants';
import { sleep } from '../../../setupTests';

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

const props = {
    matchPath: 'matchPath',
};
const mockHistoryPush = jest.fn();
const mockHistoryReplace = jest.fn();

jest.mock('../../../api/services/dzoService', () => ({
    deleteDzo: jest.fn(),
    getDzoList: jest.fn(),
    getAllDzoList: jest.fn(),
}));
jest.mock('../../../utils/utils', () => ({
    requestsWithMinWait: jest.fn(),
}));

jest.mock('react-router-dom', () => ({
    useHistory: () => ({
        push: mockHistoryPush,
        replace: mockHistoryReplace,
        location: { search: '?sortBy=&direction=ASC&filterText=' },
    }),
    generatePath: jest.fn(),
}));

describe('<DzoFrom /> test', () => {
    beforeEach(() => {
        (requestsWithMinWait as jest.Mock).mockResolvedValue([
            { dzoDtoList: dzoListTestData },
            { dzoDtoList: dzoListTestData },
        ]);
        (generatePath as jest.Mock).mockReturnValue(props.matchPath);
    });

    it('should match snapshot', async () => {
        const { asFragment } = render(<DzoList {...props} />);

        await screen.findByText(dzoListTestData[0].dzoName);

        expect(asFragment()).toMatchSnapshot('after loading data');
        expect(getAllDzoList).toBeCalledTimes(1);
        expect(getDzoList).toBeCalledTimes(1);
    });

    it('should handle fetch dzo error', async () => {
        const warnMessage = 'test warn';
        (requestsWithMinWait as jest.Mock).mockRejectedValue(warnMessage);
        const spyOnConsole = jest
            .spyOn(global.console, 'warn')
            .mockImplementation(() => '');

        render(<DzoList {...props} />);
        await sleep();

        expect(spyOnConsole).toBeCalledTimes(1);
        expect(spyOnConsole).toBeCalledWith(warnMessage);
    });

    it('should call history push on add button', async () => {
        render(<DzoList {...props} />);

        await userEvent.click(await screen.findByText(BUTTON_TEXT.ADD));

        const dzoCodes = dzoListTestData.map(({ dzoCode }) => dzoCode);
        expect(mockHistoryPush).toBeCalledWith(props.matchPath, { dzoCodes });
    });

    it('should call history push on dzo row click', async () => {
        render(<DzoList {...props} />);

        userEvent.click(await screen.findByText(dzoListTestData[0].dzoName)),

        expect(mockHistoryPush).toBeCalledTimes(1);
        expect(mockHistoryPush).toBeCalledWith(props.matchPath, { dzoData: dzoListTestData[0] });
    });

    it('should select and unselect items at rows click', async () => {
        render(<DzoList {...props} />);

        userEvent.click(await screen.findByRole('button', { name: BUTTON_TEXT.SELECT }));
        expect(screen.getByText('Выбрано 0')).toBeInTheDocument();

        const firstItem = screen.getByText(dzoListTestData[0].dzoName);
        userEvent.click(firstItem);
        expect(screen.getByText('Выбрано 1')).toBeInTheDocument();

        userEvent.click(firstItem);
        expect(screen.getByText('Выбрано 0')).toBeInTheDocument();
    });

    it('should select all items then clear it', async () => {
        render(<DzoList {...props} />);

        userEvent.click(await screen.findByRole('button', { name: BUTTON_TEXT.SELECT }));

        expect(screen.getByText('Выбрано 0')).toBeInTheDocument();

        userEvent.click(screen.getByText(BUTTON_TEXT.SELECT_ALL));

        expect(screen.getByText('Выбрано 3')).toBeInTheDocument();

        userEvent.click(screen.getByText(BUTTON_TEXT.CANCEL_ALL));

        expect(screen.getByText('Выбрано 0')).toBeInTheDocument();

        userEvent.click(screen.getByRole('button', { name: BUTTON_TEXT.CANCEL }));

        expect(screen.getByRole('button', { name: BUTTON_TEXT.SELECT })).toBeInTheDocument();
    });

    it('should select item at checkbox click', async () => {
        render(<DzoList {...props} />);

        await act(async () =>
            userEvent.click(await screen.findByRole('button', { name: BUTTON_TEXT.SELECT })),
        );

        const rowName = new RegExp(dzoListTestData[0].dzoName);
        const row = screen.getByRole('row', { name: rowName });
        const checkbox = within(row).getByRole('checkbox');
        userEvent.click(checkbox);

        expect(screen.getByText('Выбрано 1')).toBeInTheDocument();
    });

    it('should delete any dzo rows on submit modal window', async () => {
        render(<DzoList {...props} />);

        await act(async () =>
            userEvent.click(await screen.findByRole('button', { name: BUTTON_TEXT.SELECT })),
        );

        userEvent.click(screen.getByText(dzoListTestData[0].dzoName));
        userEvent.click(screen.getByText(dzoListTestData[1].dzoName));

        expect(screen.getByText('Выбрано 2')).toBeInTheDocument();

        expect(deleteDzo).toBeCalledTimes(0);
        act(() =>
            userEvent.click(screen.getByRole('button', { name: BUTTON_TEXT.DELETE })),
        );
        expect(deleteDzo).toBeCalledTimes(1);
        act(() =>
            userEvent.click(screen.getByTestId('deleteFunction')),
        );
        expect(deleteDzo).toBeCalledTimes(2);

        expect(getAllDzoList).toBeCalledTimes(1);
        expect(getDzoList).toBeCalledTimes(1);
        await act(async () =>
            userEvent.click(await screen.findByTestId('refreshTable')),
        );
        expect(getAllDzoList).toBeCalledTimes(2);
        expect(getDzoList).toBeCalledTimes(2);
    });
});
