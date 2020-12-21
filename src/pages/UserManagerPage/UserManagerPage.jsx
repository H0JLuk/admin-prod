import React from 'react';
import { Redirect, Route, Switch } from 'react-router-dom';
import { ROUTE, ROUTE_USER_MANAGER } from '../../constants/route';

import UserPageRouter from '../../containers/UsersPage/RedesignedUsersPage/UserPageRouter';
import Sidebar from '../../components/Sidebar/Sidebar';

import styles from './UserManagerPage.module.css';

const UserManagerPage = () => (
    <div className={ styles.pageWrapper }>
        <Sidebar />
        <div className={ styles.wrapper }>
            <Switch>
                <Route exact path={ `${ROUTE.USER_MANAGER}` } render={ () => <Redirect to={ ROUTE_USER_MANAGER.USERS } /> } />

                <Route path={ ROUTE_USER_MANAGER.USERS } component={ UserPageRouter } />

                <Route render={ () => <Redirect to={ ROUTE_USER_MANAGER.USERS } /> } />
            </Switch>
        </div>
    </div>
);

export default UserManagerPage;
