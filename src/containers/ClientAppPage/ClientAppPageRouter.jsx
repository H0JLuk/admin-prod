import React from 'react';
import { Redirect, Route, Switch, useRouteMatch } from 'react-router-dom';
import { CLIENT_APPS_PAGES } from '../../constants/route';

import ClientAppPage from './ClientAppPage';
import ClientAppContainer from './ClientAppForm/ClientAppContainer';

import { getRole } from '../../api/services/sessionService';
import ROLES from '../../constants/roles';

const ClientAppPageRouter = () => {
    const match = useRouteMatch();

    return (
        <Switch>
            <Route
                exact
                path={ `${ match.path }` }
                render={ routeProps => <ClientAppPage { ...routeProps } matchPath={ match.path } /> }
            />
            <RouteWithCheckRoles
                urlToRedirect={ match.path }
                accessRoles={ [ROLES.ADMIN] }
                path={ `${ match.path }${ CLIENT_APPS_PAGES.ADD_APP }` }
                render={ routeProps => <ClientAppContainer { ...routeProps } matchPath={ match.path } type="new" /> }
            />
            <RouteWithCheckRoles
                urlToRedirect={ match.path }
                accessRoles={ [ROLES.ADMIN] }
                path={ `${ match.path }${ CLIENT_APPS_PAGES.EDIT_APP }` }
                render={ routeProps => <ClientAppContainer { ...routeProps } matchPath={ match.path } type="edit" /> }
            />

            <Redirect to={ `${ match.path }` } />
        </Switch>
    );
};

export default ClientAppPageRouter;


function RouteWithCheckRoles({ accessRoles, urlToRedirect, ...restProps }) {
    const role = getRole();
    if (!(accessRoles || []).includes(role)) {
        return <Redirect to={ urlToRedirect } />;
    }

    return <Route { ...restProps } />;
}
