import React from 'react';
import { createMemoryHistory } from 'history';
import { Router, Route, generatePath } from 'react-router-dom';
import { render } from '@testing-library/react';
import ReferenceBooksRouter from './ReferenceBooksRouter';
import { LOCATIONS_PAGES, SALE_POINT_PAGES } from '@constants/route';

const LocationsRouter = 'LocationsRouter';
const SalePointsRouter = 'SalePointsRouter';

jest.mock(
    './SalePoints/SalePointsRouter',
    () => () => <div>SalePointsRouter</div>,
);

jest.mock(
    './Locations/LocationsRouter',
    () => () => <div>LocationsRouter</div>,
);

describe('<ReferenceBooksRouter tests />', () => {
    let history;
    let getByText: any;

    beforeEach(() => {
        history = createMemoryHistory();
        ({ getByText } = render(
            <Router history={history}>
                <Route path="/test">
                    <ReferenceBooksRouter />
                </Route>
            </Router>,
        ));
    });

    it('should render SalePointsRouter', () => {
        const url = generatePath(`/test${SALE_POINT_PAGES.LIST}`);
        history.push(url);
        expect(getByText(SalePointsRouter)).toBeInTheDocument();
    });

    it('should render LocationsRouter', () => {
        const url = generatePath(`/test${LOCATIONS_PAGES.LIST}`);
        history.push(url);
        expect(getByText(LocationsRouter)).toBeInTheDocument();
    });
});
