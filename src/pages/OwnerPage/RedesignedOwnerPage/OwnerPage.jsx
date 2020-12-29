import React from 'react';
import { Redirect, Route, Switch } from 'react-router-dom';
import { ROUTE, ROUTE_OWNER } from '../../../constants/route';
import CategoryPage from '../../../containers/CategoryPage/CategoryPage';

import Dashboard from '../../../containers/Dashboard/Dashboard';
import DzoPage from '../../../containers/DzoPage/DzoPage';
import Sidebar from '../../../components/Sidebar/Sidebar';

import styles from './OwnerPage.module.css';

const OwnerPage = () => (
    <div className={ styles.pageWrapper }>
        <Sidebar />
        <div className={ styles.wrapper }>
            <Switch>
                <Route exact path={ `${ROUTE.REDESIGNED}${ROUTE.OWNER}` } render={ () => <Redirect to={ ROUTE_OWNER.DASHBOARD } /> } />

                <Route path={ ROUTE_OWNER.DASHBOARD } component={ Dashboard } />
                <Route path={ ROUTE_OWNER.DZO } component={ DzoPage } />
                <Route path={ ROUTE_OWNER.CATEGORY } component={ CategoryPage } />

                <Route render={ () => <Redirect to={ ROUTE_OWNER.DASHBOARD } /> } />
            </Switch>
        </div>
    </div>
);

export default OwnerPage;
