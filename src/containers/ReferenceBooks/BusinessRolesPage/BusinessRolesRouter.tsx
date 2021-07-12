import React from 'react';
import { Redirect, Route, Switch, useRouteMatch } from 'react-router-dom';
import BusinessRolesList from './BusinessRolesList';
import BusinessRoleForm from './BusinessRoleForm';
import BusinessRoleInfo from './BusinessRoleInfo';
import { BUSINESS_ROLE_PAGES } from '@constants/route';

const LocationsRouter = () => {
    const match = useRouteMatch();

    return (
        <Switch>
            <Route
                exact
                path={match.path}
                render={routeProps => <BusinessRolesList {...routeProps} matchPath={match.path} />}
            />
            <Route
                path={`${match.path}${BUSINESS_ROLE_PAGES.ADD_BUSINESS_ROLE}`}
                render={(routeProps: any) => <BusinessRoleForm {...routeProps} matchPath={match.path} mode="add" />}
            />
            <Route
                path={`${match.path}${BUSINESS_ROLE_PAGES.EDIT_BUSINESS_ROLE}`}
                render={(routeProps: any) => <BusinessRoleForm {...routeProps} matchPath={match.path} mode="edit" />}
            />
            <Route
                path={`${match.path}${BUSINESS_ROLE_PAGES.INFO_BUSINESS_ROLE}`}
                render={(routeProps: any) => <BusinessRoleInfo {...routeProps} matchPath={match.path} />}
            />

            <Redirect to={match.path} />
        </Switch>
    );
};

export default LocationsRouter;
