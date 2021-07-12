import React from 'react';
import { Redirect, Route, Switch, useRouteMatch } from 'react-router-dom';
import SalePointsPage from './SalePointsPage';
import SalePointForm from './SalePointForm';
import { SALE_POINT_PAGES } from '../../../constants/route';

const SalePointsRouter = () => {
    const match = useRouteMatch();

    return (
        <Switch>
            <Route
                exact
                path={`${match.path}`}
                render={(routeProps) => (
                    <SalePointsPage {...routeProps} matchPath={match.path} />
                )}
            />
            <Route
                path={`${match.path}${SALE_POINT_PAGES.ADD_SALE_POINT}`}
                render={(routeProps) => (
                    <SalePointForm
                        {...routeProps}
                        matchPath={match.path}
                        mode="add"
                    />
                )}
            />
            <Route
                path={`${match.path}${SALE_POINT_PAGES.EDIT_SALE_POINT}`}
                render={(routeProps) => (
                    <SalePointForm
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

export default SalePointsRouter;
