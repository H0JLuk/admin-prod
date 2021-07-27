import React from 'react';
import { createMemoryHistory, MemoryHistory } from 'history';
import { Router, Route, generatePath } from 'react-router-dom';
import { render, screen } from '@testing-library/react';

import LocationsTypesRouter from './LocationsTypesRouter';
import { LOCATIONS_TYPES_PAGES } from '@constants/route';

const mockListRouter = 'ListRouter';
const mockFormRouter = 'FormRouter';

jest.mock(
    './LocationsTypesPage',
    () => () => <div>{mockListRouter}</div>,
);

jest.mock(
    './LocationTypeForm',
    () => () => <div>{mockFormRouter}</div>,
);

const rootPath = '/location-type';
const locationTypeId = 5;

describe('<LocationsTypesRouter tests />', () => {
    let history: MemoryHistory<any>;

    beforeEach(() => {
        history = createMemoryHistory();
        render(
            <Router history={history}>
                <Route path={rootPath}>
                    <LocationsTypesRouter />
                </Route>
            </Router>,
        );
    });

    it('should render ListRouter', () => {
        const url = generatePath(`${rootPath}${LOCATIONS_TYPES_PAGES.LIST}`);
        history.push(url);
        expect(screen.getByText(mockListRouter)).toBeInTheDocument();
    });

    it('should render FormRouter with add mode', () => {
        const url = generatePath(`${rootPath}${LOCATIONS_TYPES_PAGES.ADD_LOCATION_TYPE}`);
        history.push(url);
        expect(screen.getByText(mockFormRouter)).toBeInTheDocument();
    });

    it('should render FormRouter with edit mode', () => {
        const url = generatePath(`${rootPath}${LOCATIONS_TYPES_PAGES.EDIT_LOCATION_TYPE}`, { locationTypeId });
        history.push(url);
        expect(screen.getByText(mockFormRouter)).toBeInTheDocument();
    });
});
