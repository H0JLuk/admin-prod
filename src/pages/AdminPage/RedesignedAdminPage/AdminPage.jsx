import React from 'react';
import { Redirect, Route, Switch } from 'react-router-dom';
import { ROUTE, ROUTE_ADMIN, ROUTE_ADMIN_APPS } from '../../../constants/route';

import Dashboard from '../../../containers/Dashboard/Dashboard';
import UserPageRouter from '../../../containers/UsersPage/RedesignedUsersPage/UserPageRouter';
import CreateClientAppPage from '../../../containers/ClientAppPage/RedesignedClientAppPage/CreateClientAppPage';
import Sidebar from '../../../components/Sidebar/Sidebar';

import styles from './AdminPage.module.css';

const AdminPage = () => (
    <div className={ styles.pageWrapper }>
        <Sidebar />
        <div className={ styles.wrapper }>
            <Switch>
                <Route exact path={ `${ROUTE.REDESIGNED}${ROUTE.ADMIN}` } render={ () => <Redirect to={ ROUTE_ADMIN.DASHBOARD } /> } />

                <Route path={ ROUTE_ADMIN.DASHBOARD } component={ Dashboard } />
                <Route path={ ROUTE_ADMIN_APPS.ADD_APP } component={ CreateClientAppPage } />
                <Route path={ ROUTE_ADMIN.REDESIGNED_USERS } component={ UserPageRouter } />

                <Route render={ () => <Redirect to={ ROUTE_ADMIN.DASHBOARD } /> } />
            </Switch>
        </div>
    </div>
);

export default AdminPage;
