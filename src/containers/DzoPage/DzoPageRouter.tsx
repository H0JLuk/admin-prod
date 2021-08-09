import React from 'react';
import { Redirect, Route, Switch, useRouteMatch } from 'react-router-dom';

import DzoList from './DzoList';
import DzoForm from './DzoForm/';
import DzoInfo from './DzoInfo/';

import useBodyClassForSidebar from '@hooks/useBodyClassForSidebar';
import { DZO_PAGES } from '@constants/route';

const DzoPageRouter = () => {
    const match = useRouteMatch();

    useBodyClassForSidebar();

    return (
        <Switch>
            <Route
                exact
                path={match.path}
                render={routeProps => (
                    <DzoList
                        {...routeProps}
                        matchPath={match.path}
                    />
                )}
            />
            <Route
                path={`${ match.path }${ DZO_PAGES.ADD_DZO }`}
                render={routeProps => (
                    <DzoForm
                        {...routeProps}
                        matchPath={match.path}
                        type="create"
                    />
                )}
            />
            <Route
                path={`${ match.path }${ DZO_PAGES.DZO_EDIT }`}
                render={routeProps => (
                    <DzoForm
                        {...routeProps}
                        matchPath={match.path}
                        type="edit"
                    />
                )}
            />
            <Route
                path={`${ match.path }${ DZO_PAGES.DZO_INFO }`}
                render={(routeProps: any) => (
                    <DzoInfo
                        {...routeProps}
                        matchPath={match.path}
                    />
                )}
            />
            <Redirect to={`${ match.path }`} />
        </Switch>
    );
};

export default DzoPageRouter;
