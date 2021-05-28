import React from 'react';
import { Redirect, Route, Switch, useRouteMatch } from 'react-router-dom';
import { CONSENTS_PAGES } from '../../constants/route';

import ConsentsList from './ConsentsList';
import ConsentForm from './ConsentForm';
import ConsentInfo from './ConsentInfo';

import useBodyClassForSidebar from '../../hooks/useBodyClassForSidebar';
import { getRole } from '../../api/services/sessionService';
import { goToStartPage } from '../../utils/appNavigation';
import ROLES from '../../constants/roles';

const ConsentsPageRouter = ({ history }) => {
    const match = useRouteMatch();

    useBodyClassForSidebar();

    return (
        <Switch>
            <RouteWithCheckRoles
                exact
                accessRoles={ [ROLES.ADMIN] }
                history={ history }
                path={ `${ match.path }` }
                render={ routeProps => <ConsentsList { ...routeProps } matchPath={ match.path } /> }
            />
            <RouteWithCheckRoles
                accessRoles={ [ROLES.ADMIN] }
                history={ history }
                path={ `${ match.path }${ CONSENTS_PAGES.ADD_CONSENT }` }
                render={ routeProps => <ConsentForm { ...routeProps } matchPath={ match.path } mode="create" /> }
            />
            <RouteWithCheckRoles
                accessRoles={ [ROLES.ADMIN] }
                history={ history }
                path={ `${ match.path }${ CONSENTS_PAGES.EDIT_CONSENT }` }
                render={ routeProps => <ConsentForm { ...routeProps } matchPath={ match.path } mode="edit" /> }
            />
            <Route
                path={ `${ match.path }${ CONSENTS_PAGES.INFO_CONSENT }` }
                render={ routeProps => <ConsentInfo { ...routeProps } matchPath={ match.path } /> }
            />

            <Redirect to={ `${ match.path }` } />
        </Switch>
    );
};

export default ConsentsPageRouter;


function RouteWithCheckRoles({ accessRoles, history, ...restProps }) {
    const role = getRole();
    if (!(accessRoles || []).includes(role)) {
        goToStartPage(history, true, role);
        return null;
    }

    return <Route { ...restProps } />;
}
