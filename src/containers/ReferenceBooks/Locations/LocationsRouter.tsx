import React from 'react';
import { Redirect, Route, Switch, useRouteMatch } from 'react-router-dom';
import LocationsPage from './LocationsPage';
import LocationForm from './LocationForm';
import { LOCATIONS_PAGES } from '../../../constants/route';

const LocationsRouter = () => {
    const match = useRouteMatch();

    return (
        <Switch>
            <Route
                exact
                path={`${match.path}`}
                render={(routeProps) => (
                    <LocationsPage {...routeProps} matchPath={match.path} />
                )}
            />
            <Route
                path={`${match.path}${LOCATIONS_PAGES.ADD_LOCATION}`}
                render={(routeProps) => (
                    <LocationForm
                        {...routeProps}
                        matchPath={match.path}
                        mode="add"
                    />
                )}
            />
            <Route
                path={`${match.path}${LOCATIONS_PAGES.EDIT_LOCATION}`}
                render={(routeProps) => (
                    <LocationForm
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

export default LocationsRouter;
