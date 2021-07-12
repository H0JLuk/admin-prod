import React from 'react';
import { createMemoryHistory } from 'history';
import { Router, Route, generatePath } from 'react-router-dom';
import { render } from '@testing-library/react';
import SalePointsRouter from './SalePointsRouter';
import { SALE_POINT_PAGES } from '@constants/route';

const SalePointsPage = 'SalePointsPage';
const SalePointForm = 'SalePointForm';

jest.mock(
    './SalePointsPage',
    () => () => <div>SalePointsPage</div>,
);

jest.mock(
    './SalePointForm',
    () => ({ mode = 'add' }: { mode: string; }) => (
        <div>
            SalePointForm
            <span>{mode}</span>
        </div>
    ),
);

describe('<SalePointsRouter tests />', () => {
    let history;
    let getByText: any;

    beforeEach(() => {
        history = createMemoryHistory();
        ({ getByText } = render(
            <Router history={history}>
                <Route path="/test">
                    <SalePointsRouter />
                </Route>
            </Router>,
        ));
    });

    it('should render SalePointsPage', () => {
        history.push('/test');
        expect(getByText(SalePointsPage)).toBeInTheDocument();

        history.push('/test/random_string');
        expect(getByText(SalePointsPage)).toBeInTheDocument();
    });

    it('should render SalePointForm', () => {
        const addSalePointUrl = generatePath(`/test${SALE_POINT_PAGES.ADD_SALE_POINT}`);
        const editSalePointUrl = generatePath(`/test${SALE_POINT_PAGES.EDIT_SALE_POINT}`, { salePointId: 1 });

        history.push(addSalePointUrl);
        expect(getByText(SalePointForm)).toBeInTheDocument();
        expect(getByText('add')).toBeInTheDocument();

        history.push(editSalePointUrl);
        expect(getByText(SalePointForm)).toBeInTheDocument();
        expect(getByText('edit')).toBeInTheDocument();
    });
});
