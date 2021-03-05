import React, { useEffect } from 'react';
import { Switch, Route, Redirect, useHistory } from 'react-router-dom';
import 'antd/dist/antd.css'; // Ant styles will be here, before another styles imports
import './static/fonts/fonts.css';
import moment from 'moment';
import { ROUTE } from './constants/route';
import ROLES from './constants/roles';
import { getRole } from './api/services/sessionService';
import { isLoggedIn } from './api/services/authService';
import LoginPage from './containers/LoginPage/LoginPage';
import OldDesignAdminPage from './pages/AdminPage/OldDesign/AdminPage';
import AdminPage from './pages/AdminPage';
import AuditorPage from './pages/AuditorPage/AuditorPage';
import OldDesignOwnerPage from './pages/OwnerPage/OldDesignOwnerPage/OwnerPage';
import OwnerPage from './pages/OwnerPage';
import ClientAppPage from './containers/ClientAppPage/OldClientAppPage/ClientAppPage';
import UserManagerPage from './pages/UserManagerPage';
import { goToStartPage } from './utils/appNavigation';
import { Api } from './api/apiClient';

moment.locale('ru');

const App = () => {
    const history = useHistory();

    useEffect(() => {
        Api.setHistory(history);
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return (
        <Switch>
            <Route exact path={ ROUTE.CORE } component={ CorePage } />

            <Route path={ ROUTE.LOGIN } component={ LoginPage } />
            <Route path={ ROUTE.CLIENT_APPS } component={ ClientAppPage } />
            <Route path={ `${ROUTE.OLD_DESIGN}${ROUTE.ADMIN}` } component={ withRedirect(OldDesignAdminPage, ROLES.ADMIN) } />
            <Route path={ `${ROUTE.OLD_DESIGN}${ROUTE.OWNER}` } component={ withRedirect(OldDesignOwnerPage, ROLES.PRODUCT_OWNER) } />
            <Route path={ ROUTE.AUDITOR } component={ withRedirect(AuditorPage, ROLES.AUDITOR) } />
            <Route path={ ROUTE.USER_MANAGER } component={ withRedirect(UserManagerPage, ROLES.USER_MANAGER) } />

            <Route path={ ROUTE.ADMIN } component={ withRedirect(AdminPage, ROLES.ADMIN) } />
            <Route path={ ROUTE.OWNER } component={ withRedirect(OwnerPage, ROLES.PRODUCT_OWNER) } />

            <Route component={ CorePage } />
        </Switch>
    );
};

export default App;

function withRedirect(Component, requiredRole) {
    Component.displayName = `withRedirect(${getDisplayName(Component)})`;
    return function withRedirectComponent(props) {
        const isLogged = isLoggedIn();
        if (!isLogged) {
            return <Redirect to={ ROUTE.LOGIN } />;
        }

        const role = getRole();
        if (role !== requiredRole) {
            goToStartPage(props.history, true, role);
            return null;
        }
        return <Component { ...props } />;
    };
}

function getDisplayName(WrappedComponent) {
    return WrappedComponent.displayName || WrappedComponent.name || 'Component';
}

const CorePage = ({ history }) => {
    goToStartPage(history, true);
    return null;
};
