import React from 'react';
import { Redirect, Route, Switch, useRouteMatch } from 'react-router-dom';
import LocationsTypesPage from './LocationsTypesPage';
import LocationTypeForm from './LocationTypeForm';
import { LOCATIONS_PAGES } from '@constants/route';

const LocationsTypesRouter = () => {
    const match = useRouteMatch();

    return (
        <Switch>
            <Route
                exact
                path={`${match.path}`}
                render={(routeProps) => (
                    <LocationsTypesPage {...routeProps} matchPath={match.path} />
                )}
            />
            <Route
                path={`${match.path}${LOCATIONS_PAGES.ADD_LOCATION}`}
                render={(routeProps) => (
                    <LocationTypeForm
                        {...routeProps}
                        matchPath={match.path}
                        mode="add"
                    />
                )}
            />
            <Route
                path={`${match.path}${LOCATIONS_PAGES.EDIT_LOCATION}`}
                render={(routeProps) => (
                    <LocationTypeForm
                        {...routeProps}
                        matchPath={match.path}
                        mode="edit"
                    />
                )}
            />

            <Redirect to={`${match.path}`} />
        </Switch>
    );
};

export default LocationsTypesRouter;
