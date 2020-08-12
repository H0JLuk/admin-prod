import React from 'react';
import { Switch, Route, Redirect } from 'react-router-dom';
import moment from 'moment';
import { getStaticUrlFromBackend, saveStaticUrl } from './api/services/settingsService';
import { ROUTE } from './constants/route';
import ROLES from './constants/roles';
import { getRole } from './api/services/sessionService';
import { isLoggedIn } from './api/services/authService';
import LoginPage from './containers/LoginPage/LoginPage';
import AdminPage from './pages/AdminPage/AdminPage';
import AuditorPage from './pages/AuditorPage/AuditorPage';
import ProductPage from './pages/ProductPage/ProductPage';
import ClientAppPage from './containers/ClientAppPage/ClientAppPage';

moment.locale('ru');

class App extends React.PureComponent {

    componentDidMount() {
        getStaticUrlFromBackend().then( response => {
            saveStaticUrl(response);
        });
    }

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
                    <Route path={ ROUTE.ADMIN } component={ withRedirect( AdminPage, ROLES.ADMIN ) } />
                    <Route path={ ROUTE.OWNER } component={ withRedirect( ProductPage, ROLES.PRODUCT_OWNER ) } />
                    <Route path={ ROUTE.AUDITOR } component={ withRedirect( AuditorPage, ROLES.AUDITOR ) } />

                    <Route render={ () => <Redirect to={ ROUTE.CLIENT_APPS } /> } />
                </Switch>
            </>
        );
    }
}

export default App;
