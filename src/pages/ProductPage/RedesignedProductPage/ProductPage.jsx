import React from 'react';
import { Redirect, Route, Switch } from 'react-router-dom';
import { ROUTE, ROUTE_OWNER } from '../../../constants/route';

import Dashboard from '../../../containers/Dashboard/Dashboard';
import UserPageRouter from '../../../containers/UsersPage/RedesignedUsersPage/UserPageRouter';
import Sidebar from '../../../components/Sidebar/Sidebar';

import styles from './ProductPage.module.css';

const ProductPage = () => (
    <div className={ styles.pageWrapper }>
        <Sidebar />
        <div className={ styles.wrapper }>
            <Switch>
                <Route exact path={ `${ROUTE.REDESIGNED}${ROUTE.OWNER}` } render={ () => <Redirect to={ ROUTE_OWNER.DASHBOARD } /> } />

                <Route path={ ROUTE_OWNER.DASHBOARD } component={ Dashboard } />
                <Route path={ ROUTE_OWNER.REDESIGNED_USERS } component={ UserPageRouter } />

                <Route render={ () => <Redirect to={ ROUTE_OWNER.DASHBOARD } /> } />
            </Switch>
        </div>
    </div>
);

export default ProductPage;
