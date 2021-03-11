import React from 'react';
import { Redirect, Route, Switch } from 'react-router-dom';
import { ROUTE, ROUTE_OWNER } from '../../constants/route';

import PromoCampaignPageRouter from '../../containers/PromoCampaignPage/PromoCampaignPageRouter';
import ClientAppPageRouter from '../../containers/ClientAppPage/ClientAppPageRouter';
import CategoryPage from '../../containers/CategoryPage/CategoryPage';
import Dashboard from '../../containers/Dashboard/Dashboard';
import DzoPageRouter from '../../containers/DzoPage/DzoPageRouter';
import FilesPage from '../../containers/FilesPage/FilesPage';
import PresentationPage from '../../containers/PresentationPage/PresentationPage';
import GroupsPageRouter from '../../containers/GroupsPage/GroupsPageRouter';
import Sidebar from '../../components/Sidebar/Sidebar';

import styles from './OwnerPage.module.css';

const OwnerPage = () => (
    <div className={ styles.pageWrapper }>
        <Sidebar />
        <div className={ styles.wrapper }>
            <Switch>
                <Route exact path={ ROUTE.OWNER } render={ () => <Redirect to={ ROUTE_OWNER.DASHBOARD } /> } />

                <Route path={ ROUTE_OWNER.DASHBOARD } component={ Dashboard } />
                <Route path={ ROUTE_OWNER.DZO } component={ DzoPageRouter } />
                <Route path={ ROUTE_OWNER.FILES } component={ FilesPage } />
                <Route path={ ROUTE_OWNER.PRESENTATION } component={ PresentationPage } />
                <Route path={ ROUTE_OWNER.CATEGORY } component={ CategoryPage } />
                <Route path={ ROUTE_OWNER.APPS } component={ ClientAppPageRouter } />
                <Route path={ ROUTE_OWNER.PROMO_CAMPAIGN } component={ PromoCampaignPageRouter } />
                <Route path={ ROUTE_OWNER.GROUPS } component={ GroupsPageRouter } />

                <Route render={ () => <Redirect to={ ROUTE_OWNER.DASHBOARD } /> } />
            </Switch>
        </div>
    </div>
);

export default OwnerPage;
