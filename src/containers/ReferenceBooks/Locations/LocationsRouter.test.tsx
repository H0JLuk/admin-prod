import React from 'react';
import { createMemoryHistory } from 'history';
import { Router, Route, generatePath } from 'react-router-dom';
import { render } from '@testing-library/react';
import LocationsRouter from './LocationsRouter';
const LocationsPage = 'LocationsPage';
const LocationForm = 'LocationForm';
jest.mock(
    './LocationsPage',
    () => () => <div>LocationsPage</div>,
);
jest.mock(
    './LocationForm',
    () => ({ mode = 'add' }: { mode: string; }) => (
        <div>
            LocationForm
            <span>{mode}</span>
        </div>
    ),
);
describe('<LocationsRouter tests />', () => {
    let history;
    let getByText: any;
    beforeEach(() => {
        history = createMemoryHistory();
        ({ getByText } = render(
            <Router history={history}>
                <Route path="/test">
                    <LocationsRouter />
                </Route>
            </Router>,
        ));
    });

    it('should render LocationForm', () => {
        history.push('/test');
        expect(getByText(LocationsPage)).toBeInTheDocument();
        history.push('/test/random_string');
        expect(getByText(LocationsPage)).toBeInTheDocument();
    });

    it('should render SalePointForm', () => {
        const addSalePointUrl = generatePath('/test/add');
        const editSalePointUrl = generatePath('/test/0/edit');
        history.push(addSalePointUrl);
        expect(getByText(LocationForm)).toBeInTheDocument();
        expect(getByText('add')).toBeInTheDocument();
        history.push(editSalePointUrl);
        expect(getByText(LocationForm)).toBeInTheDocument();
        expect(getByText('edit')).toBeInTheDocument();
    });
});
