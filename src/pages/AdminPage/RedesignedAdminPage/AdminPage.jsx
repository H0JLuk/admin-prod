import React from 'react';
import { Redirect, Route, Switch } from 'react-router-dom';
import { ROUTE, ROUTE_ADMIN } from '../../../constants/route';

import UserPageRouter from '../../../containers/UsersPage/RedesignedUsersPage/UserPageRouter';
import Sidebar from '../../../components/Sidebar/Sidebar';

import styles from './AdminPage.module.css';

const AdminPage = () => (
    <div className={ styles.pageWrapper }>
        <Sidebar />
        <div className={ styles.wrapper }>
            <Switch>
                <Route exact path={ `${ROUTE.REDESIGNED}${ROUTE.ADMIN}` } render={ () => <Redirect to={ ROUTE_ADMIN.REDESIGNED_USERS } /> } />

                <Route path={ ROUTE_ADMIN.REDESIGNED_USERS } component={ UserPageRouter } />

                <Route render={ () => <Redirect to={ ROUTE_ADMIN.REDESIGNED_USERS } /> } />
            </Switch>
        </div>
    </div>
);

export default AdminPage;
