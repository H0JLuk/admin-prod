import React from 'react';
import { Switch, Route, Redirect } from 'react-router-dom';
import './static/fonts/fonts.css';
import moment from 'moment';
import { ROUTE } from './constants/route';
import ROLES from './constants/roles';
import { getRole } from './api/services/sessionService';
import { isLoggedIn } from './api/services/authService';
import LoginPage from './containers/LoginPage/LoginPage';
import AdminPage from './pages/AdminPage/AdminPage';
import RedesignedAdminPage from './pages/AdminPage/RedesignedAdminPage/AdminPage';
import AuditorPage from './pages/AuditorPage/AuditorPage';
import OwnerPage from './pages/OwnerPage/OwnerPage';
import RedesignedOwnerPage from './pages/OwnerPage/RedesignedOwnerPage/OwnerPage';
import ClientAppPage from './containers/ClientAppPage/ClientAppPage';
import UserManagerPage from './pages/UserManagerPage';

moment.locale('ru');

class App extends React.PureComponent {

    render() {
        const withRedirect = (Component, requiredRole) => (props) => {
            const isLogged = isLoggedIn();
            const role = getRole();
            if (!isLogged || role !== requiredRole) {
                return <Redirect to={ ROUTE.LOGIN } />;
            }
            return <Component { ...props } />;
        };

        return (
            <>
                <Switch>
                    <Route exact path={ ROUTE.CORE } render={ () => <Redirect to={ ROUTE.CLIENT_APPS } /> } />

                    <Route path={ ROUTE.LOGIN } component={ LoginPage } />
                    <Route path={ ROUTE.CLIENT_APPS } component={ ClientAppPage } />
                    <Route path={ ROUTE.ADMIN } component={ withRedirect(AdminPage, ROLES.ADMIN) } />
                    <Route path={ ROUTE.OWNER } component={ withRedirect(OwnerPage, ROLES.PRODUCT_OWNER) } />
                    <Route path={ ROUTE.AUDITOR } component={ withRedirect(AuditorPage, ROLES.AUDITOR) } />
                    <Route path={ ROUTE.USER_MANAGER } component={ withRedirect(UserManagerPage, ROLES.USER_MANAGER) } />

                    <Route path={ `${ROUTE.REDESIGNED}${ROUTE.ADMIN}` } component={ withRedirect(RedesignedAdminPage, ROLES.ADMIN) } />
                    <Route path={ `${ROUTE.REDESIGNED}${ROUTE.OWNER}` } component={ withRedirect(RedesignedOwnerPage, ROLES.PRODUCT_OWNER) } />

                    <Route render={ () => <Redirect to={ ROUTE.CLIENT_APPS } /> } />
                </Switch>
            </>
        );
    }
}

export default App;
