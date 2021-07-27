import React from 'react';
import { Redirect, Route, Switch, useRouteMatch } from 'react-router-dom';
import SalePointsTypesPage from './SalePointsTypesPage';
import SalePointTypeForm from './SalePointTypeForm';
import { SALE_POINT_TYPES_PAGES } from '../../../constants/route';

const SalePointsTypesRouter = () => {
    const match = useRouteMatch();
    return (
        <Switch>
            <Route
                exact
                path={`${match.path}`}
                render={(routeProps) => (
                    <SalePointsTypesPage {...routeProps} matchPath={match.path} />
                )}
            />
            <Route
                path={`${match.path}${SALE_POINT_TYPES_PAGES.ADD_SALE_POINT_TYPE}`}
                render={(routeProps) => (
                    <SalePointTypeForm
                        {...routeProps}
                        matchPath={match.path}
                        mode="add"
                    />
                )}
            />
            <Route
                path={`${match.path}${SALE_POINT_TYPES_PAGES.EDIT_SALE_POINT_TYPE}`}
                render={(routeProps) => (
                    <SalePointTypeForm
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

export default SalePointsTypesRouter;
