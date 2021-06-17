import React from 'react';
import { Redirect, Route, Switch } from 'react-router-dom';
import { ROUTE, ROUTE_ADMIN } from '@constants/route';

import CategoryPage from '@containers/CategoryPage';
import Dashboard from '@containers/Dashboard';
import DzoPageRouter from '@containers/DzoPage/DzoPageRouter';
import UserPageRouter from '@containers/UsersPage/UserPageRouter';
import ReportsPage from '@containers/ReportsPage';
import PresentationPage from '@containers/PresentationPage/PresentationPage';
import PromoCampaignPageRouter from '@containers/PromoCampaignPage/PromoCampaignPageRouter';
import ClientAppPageRouter from '@containers/ClientAppPage/ClientAppPageRouter';
import GroupsPageRouter from '@containers/GroupsPage/GroupsPageRouter';
import ConsentsPageRouter from '@containers/ConsentsPage/ConsentsPageRouter';
import Sidebar from '@components/Sidebar';

import styles from './AdminPage.module.css';

const AdminPage = () => (
    <div className={styles.pageWrapper}>
        <Sidebar />
        <div className={styles.wrapper}>
            <Switch>
                <Route exact path={ROUTE.ADMIN} render={() => <Redirect to={ROUTE_ADMIN.DASHBOARD} />} />

                <Route path={ROUTE_ADMIN.DASHBOARD} component={Dashboard} />
                <Route path={ROUTE_ADMIN.REPORTS} component={ReportsPage} />
                <Route path={ROUTE_ADMIN.DZO} component={DzoPageRouter} />
                <Route path={ROUTE_ADMIN.CATEGORY} component={CategoryPage} />
                <Route path={ROUTE_ADMIN.PRESENTATION} component={PresentationPage} />
                <Route path={ROUTE_ADMIN.APPS} component={ClientAppPageRouter} />
                <Route path={ROUTE_ADMIN.USERS} component={UserPageRouter} />
                <Route path={ROUTE_ADMIN.PROMO_CAMPAIGN} component={PromoCampaignPageRouter} />
                <Route path={ROUTE_ADMIN.GROUPS} component={GroupsPageRouter} />
                <Route path={ROUTE_ADMIN.CONSENTS} component={ConsentsPageRouter} />

                <Route render={() => <Redirect to={ROUTE_ADMIN.DASHBOARD} />} />
            </Switch>
        </div>
    </div>
);

export default AdminPage;
