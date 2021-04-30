import React from 'react';
import AutocompleteLocationAndSalePoint from './AutocompleteLocationAndSalePoint';
import { fireEvent, render } from '@testing-library/react';
import { act } from 'react-dom/test-utils';
import { sleep } from '../../../setupTests';
import {
    searchLocation,
    searchSalePointTestData,
} from '../../../../__tests__/constants';

import * as autoHelpers from './AutocompleteHelper';

const props = {
    colClassName: 'colClassName',
    locationPlaceholder: 'locationPlaceholder',
    locationLabel: 'locationLabel',
    locationLabelClassNames: 'locationLabelClassNames',
    salePointPlaceholder: 'salePointPlaceholder',
    salePointLabel: 'salePointLabel',
    salePointLabelClassNames: 'salePointLabelClassNames',
    locationDisabled: false,
    salePointDisabled: false,
    highlightClassName: 'highlightClassName',
    onLocationChange: jest.fn(),
    onSalePointChange: jest.fn(),
    initialLocationValue: '',
    initialSalePointValue: '',
    autoFocusLocation: true,
    locationId: 1,
    error: {},
    columnMode: false,
};

jest.mock('../../../api/services/promoCampaignService', () => ({
    getLocationsByText: jest.fn(),
    getSalePointsByText: jest.fn(),
}));

describe('<AutocompleteLocationAndSalePoint /> test', () => {
    beforeEach(() => {
        autoHelpers.getResultsByTextAndType = jest.fn((_, typeSearch) => {
            if (typeSearch === 'searchLocation') {
                return searchLocation;
            }
            if (typeSearch === 'searchSalePoint') {
                return searchSalePointTestData;
            }
            return searchLocation;
        });
        autoHelpers.createSearchDataAndPassLocation = jest.fn(() => ({
            location: searchLocation,
            searchLocation: {
                value: 'Ханты-Мансийский автономный округ — Югра',
                results: searchLocation,
            },
        }));
    });

    it('should match snapshot', () => {
        const Component = render(
            <AutocompleteLocationAndSalePoint { ...props } />
        );

        expect(Component).toMatchSnapshot();
    });

    it('should load salePoints when location has been selected', async () => {
        const { getByPlaceholderText } = render(
            <AutocompleteLocationAndSalePoint { ...props } />
        );

        const locationInput = getByPlaceholderText(
            props.locationPlaceholder
        );

        await act(async () => {
            fireEvent.change(locationInput, {
                target: { value: 'Москва' },
            });
            await sleep(500);

            expect(
                document.querySelectorAll('.ant-select-item-option')
            ).toHaveLength(2);

            const hint = document.querySelector('.ant-select-item');

            fireEvent.click(hint);
            await sleep();
        });

        expect(autoHelpers.getResultsByTextAndType).toBeCalledTimes(2);
        expect(autoHelpers.getResultsByTextAndType.mock.calls).toEqual([
            ['Москва', 'searchLocation', 1],
            ['', 'searchSalePoint', 163],
        ]);
        expect(props.onLocationChange).toBeCalled();

        const salePointInput = getByPlaceholderText(
            props.salePointPlaceholder
        );

        await act(async () => {
            fireEvent.mouseDown(salePointInput);
            await sleep();
            expect(
                document.querySelector('.ant-select-item-option').textContent
            ).toEqual('Ханты-Мансийский автономный округ — ЮграМосква');
        });
    });

    it('should paste location when salePoint has been selected', async () => {
        const { getByPlaceholderText } = render(
            <AutocompleteLocationAndSalePoint { ...props } />
        );

        const salePointInput = getByPlaceholderText(
            props.salePointPlaceholder
        );

        const locationInput = getByPlaceholderText(
            props.locationPlaceholder
        );

        await act(async () => {
            fireEvent.change(salePointInput, {
                target: { value: '055_8626_1232' },
            });
            await sleep(500);

            expect(
                document.querySelectorAll('.ant-select-item-option')
            ).toHaveLength(1);
        });

        await act(async () => {
            const hint = document.querySelector('.ant-select-item');

            fireEvent.click(hint);
            await sleep(500);
        });

        expect(locationInput.value).toEqual(searchLocation[0].parentName);
    });

    it('should change location and salePoint when existing salePoint has been entered ', async () => {
        const { getByPlaceholderText } = render(
            <AutocompleteLocationAndSalePoint { ...props } />
        );

        const salePointInput = getByPlaceholderText(
            props.salePointPlaceholder
        );

        const locationInput = getByPlaceholderText(
            props.locationPlaceholder
        );

        await act(async () => {
            fireEvent.change(salePointInput, {
                target: { value: '055_8626_1232' },
            });
            await sleep(500);

            fireEvent.blur(salePointInput);
            await sleep();
        });

        expect(locationInput.value).toEqual(searchLocation[0].parentName);
    });

    it('should call console.error on request error', async () => {
        const errorMessage = 'error';

        autoHelpers.getResultsByTextAndType = jest
            .fn()
            .mockRejectedValue(errorMessage);

        const spyOnConsole = jest
            .spyOn(console, 'error')
            .mockImplementation(() => '');

        const { getByPlaceholderText } = render(
            <AutocompleteLocationAndSalePoint { ...props } />
        );

        const salePointInput = getByPlaceholderText(
            props.salePointPlaceholder
        );

        await act(async () => {
            fireEvent.change(salePointInput, {
                target: { value: '055_8626_1232' },
            });
            await sleep(500);
        });

        expect(spyOnConsole).toBeCalled();
        expect(spyOnConsole).toBeCalledWith(errorMessage);
    });

    it('should not show hint when only one letter in location input ', async () => {
        const { getByPlaceholderText } = render(
            <AutocompleteLocationAndSalePoint { ...props } />
        );

        const locationInput = getByPlaceholderText(
            props.locationPlaceholder
        );

        await act(async () => {
            fireEvent.change(locationInput, {
                target: { value: 'М' },
            });
            await sleep(500);
        });

        expect(
            document.querySelector('.ant-select-item-option')
        ).not.toBeInTheDocument();
    });
});
