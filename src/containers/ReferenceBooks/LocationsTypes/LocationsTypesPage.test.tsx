import React from 'react';
import { generatePath } from 'react-router-dom';
import { act, render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { getActiveLocationTypeList } from '@apiServices/locationService';
import { BUTTON_TEXT } from '@constants/common';
import { LOCATIONS_TYPES_PAGES } from '@constants/route';
import { sleep } from '@setupTests';
import { testLocationsTypesArray, testLocationType } from '@testConstants';
import LocationsTypesPage from './LocationsTypesPage';

const mockHistoryPush = jest.fn();

jest.mock('react-router-dom', () => ({
    useLocation: jest.fn(),
    useHistory: () => ({
        push: mockHistoryPush,
        location: {
            search: '&search',
        },
        replace: jest.fn(),
    }),
    generatePath: jest.fn().mockReturnValue(''),
}));

jest.mock('@apiServices/locationService', () => ({
    getActiveLocationTypeList: jest.fn(),
    deleteLocationType: jest.fn(),
}));

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
    history: {
        match: 'location-type',
        push: mockHistoryPush,
        location: {
            pathname: '/admin/reference-books/location-type',
            search: '?sortBy=&direction=ASC&filterText=',
            hash: '',
            state: undefined,
            key: '',
        },
        replace: jest.fn(),
    } as any,
    location: {
        hash: '',
        key: '',
        pathname: '/admin/reference-books/location-type',
        search: '?sortBy=&direction=ASC&filterText=',
        state: undefined,
    },
    match: {
        isExact: true,
        params: {},
        path: '/admin/reference-books/location-type',
        url: '/admin/reference-books/location-type',
    },
};

describe('<LocationsTypesPage tests />', () => {
    beforeEach(() => {
        (getActiveLocationTypeList as jest.Mock).mockResolvedValue(testLocationsTypesArray);
    });

    it('should match the snapshot', async () => {
        const { asFragment } = render(<LocationsTypesPage {...props} />);

        expect(
            await screen.findAllByText(testLocationType.name),
        ).toHaveLength(3);
        expect(asFragment()).toMatchSnapshot();
    });

    it('should do history push on clicking add button', async () => {
        render(<LocationsTypesPage {...props} />);
        await screen.findAllByText(testLocationType.name);

        userEvent.click(
            screen.getByRole('button', { name: BUTTON_TEXT.ADD }),
        );

        expect(mockHistoryPush).toBeCalledTimes(1);
        expect(mockHistoryPush).toBeCalledWith(`${props.matchPath}${LOCATIONS_TYPES_PAGES.ADD_LOCATION_TYPE}`);
    });

    it('should redirect on row click', async () => {
        render(<LocationsTypesPage {...props} />);
        await act(async () => {
            await screen.findAllByText(testLocationType.name);
        });

        userEvent.click(
            (await screen.findAllByText(testLocationType.name))[0],
        );

        expect(generatePath).toBeCalledTimes(1);
        expect(generatePath).toBeCalledWith(
            `${props.matchPath}${LOCATIONS_TYPES_PAGES.EDIT_LOCATION_TYPE}`,
            { locationTypeId: testLocationsTypesArray[0].id },
        );
        expect(mockHistoryPush).toBeCalledTimes(1);
    });

    it('should select and cancel selecting item by click on the row', async () => {
        render(<LocationsTypesPage {...props} />);
        await act(async () => {
            await screen.findAllByText(testLocationType.name);
        });

        userEvent.click(
            screen.getByRole('button', { name: BUTTON_TEXT.SELECT }),
        );

        expect(screen.getByText('Выбрано 0')).toBeInTheDocument();

        const locationTypeItems = screen.getAllByText(testLocationType.name);
        userEvent.click(locationTypeItems[0]);

        expect(screen.getByText('Выбрано 1')).toBeInTheDocument();

        const rowName = new RegExp(testLocationType.name);
        const row = screen.getAllByRole('row', { name: rowName })[0];
        const checkbox = within(row).getByRole('checkbox');
        userEvent.click(checkbox);

        userEvent.click(screen.getByText(BUTTON_TEXT.SELECT_ALL));
        expect(screen.getByText('Выбрано 3')).toBeInTheDocument();

        userEvent.click(screen.getByText(BUTTON_TEXT.CANCEL_ALL));
        expect(screen.getByText('Выбрано 0')).toBeInTheDocument();

        userEvent.click(screen.getByText(BUTTON_TEXT.CANCEL));
        expect(screen.getByText(BUTTON_TEXT.ADD)).toBeInTheDocument();
    });

    it('should catch error at locations types list loading', async () => {
        const loadingWarn = new Error('loading error');
        const errorSpy = jest.spyOn(console, 'warn').mockImplementation(() => '');
        (getActiveLocationTypeList as jest.Mock).mockRejectedValue(loadingWarn);

        render(<LocationsTypesPage {...props} />);

        await act(async () => await sleep());

        expect(errorSpy).toBeCalledTimes(1);
        expect(errorSpy).toBeCalledWith(loadingWarn);
    });

    it('should correct call refreshTable function', async () => {
        render(<LocationsTypesPage {...props} />);
        await act(async () => {
            await screen.findAllByText(testLocationType.name);
        });

        userEvent.click(
            screen.getByRole('button', { name: BUTTON_TEXT.SELECT }),
        );

        const locationTypeItems = screen.getAllByText(testLocationType.name);
        userEvent.click(locationTypeItems[0]);

        userEvent.click(
            screen.getByRole('button', { name: BUTTON_TEXT.DELETE }),
        );

        expect(getActiveLocationTypeList).toBeCalledTimes(1);

        await act(async () =>
            userEvent.click(await screen.findByTestId('refreshTable')),
        );

        expect(getActiveLocationTypeList).toBeCalledTimes(2);
    });
});
