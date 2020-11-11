import React, { Fragment } from 'react';
import { Redirect, Route, Switch, withRouter } from 'react-router-dom';
import { ROUTE, ROUTE_ADMIN } from '../../constants/route';
import PromoCampaignPage from '../../containers/PromoCampaignPage/PromoCampaignPage';
import styles from './AdminPage.module.css';

import Header from '../../components/Header/Header';
import FilesPage from '../../containers/FilesPage/FilesPage';
import UsersPage from '../../containers/UsersPage/UsersPage';
import DzoPage from '../../containers/DzoPage/DzoPage';
import LandingPage from '../../containers/LandingPage/LandingPage';
import CategoryPage from '../../containers/CategoryPage/CategoryPage';

const AdminPage = (props) => {
    
    const { history } = props;

    return (
        <Fragment>
            <Header history={ history } />
            <div className={ styles.wrapper }>
                <Switch>
                    <Route exact path={ ROUTE.ADMIN } render={ () => <Redirect to={ ROUTE_ADMIN.USERS } /> } />

                    <Route path={ ROUTE_ADMIN.USERS } component={ UsersPage } />
                    <Route path={ ROUTE_ADMIN.FILES } component={ FilesPage } />
                    <Route path={ ROUTE_ADMIN.DZO } component={ DzoPage } />
                    <Route path={ ROUTE_ADMIN.LANDING } component={ LandingPage } />
                    <Route path={ ROUTE_ADMIN.CATEGORY } component={ CategoryPage } />
                    <Route path={ ROUTE_ADMIN.PROMO_CAMPAIGN } component={ PromoCampaignPage } />

                    <Route render={ () => <Redirect to={ ROUTE_ADMIN.USERS } /> } />
                </Switch>
            </div>
        </Fragment>
    );
};

export default withRouter(AdminPage);
