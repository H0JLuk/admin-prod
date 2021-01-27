import React, { Fragment } from 'react';
import { Redirect, Route, Switch, withRouter } from 'react-router-dom';
import { ROUTE, ROUTE_ADMIN } from '../../../constants/route';
import styles from './AdminPage.module.css';

import Header from '../../../components/Header/OldHeader/Header';
import FilesPage from '../../../containers/FilesPage/FilesPage';
import UsersPage from '../../../containers/UsersPage/OldUsers/UsersPage';
import DzoPage from '../../../containers/DzoPage/DzoPage';
import PresentationPage from '../../../containers/PresentationPage/PresentationPage';
import CategoryPage from '../../../containers/CategoryPage/CategoryPage';
import PromoCampaignPageRouter from '../../../containers/PromoCampaignPage/OldPromoCampaign/PromoCampaignPageRouter';

const AdminPage = (props) => {

    const { history } = props;

    return (
        <Fragment>
            <Header history={ history } />
            <div className={ styles.wrapper }>
                <Switch>
                    <Route exact path={ `${ROUTE.OLD_DESIGN}${ROUTE.ADMIN}` } render={ () => <Redirect to={ ROUTE_ADMIN.OLD_DESIGN_USERS } /> } />

                    <Route path={ ROUTE_ADMIN.OLD_DESIGN_USERS } component={ UsersPage } />
                    <Route path={ ROUTE_ADMIN.FILES } component={ FilesPage } />
                    <Route path={ ROUTE_ADMIN.DZO } component={ DzoPage } />
                    <Route path={ ROUTE_ADMIN.PRESENTATION } component={ PresentationPage } />
                    <Route path={ ROUTE_ADMIN.CATEGORY } component={ CategoryPage } />
                    <Route path={ ROUTE_ADMIN.OLD_DESIGN_PROMO_CAMPAIGN } component={ PromoCampaignPageRouter } />

                    <Route render={ () => <Redirect to={ ROUTE_ADMIN.OLD_DESIGN_USERS } /> } />
                </Switch>
            </div>
        </Fragment>
    );
};

export default withRouter(AdminPage);
