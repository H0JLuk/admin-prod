import React, { Fragment } from 'react';
import { Redirect, Route, Switch, withRouter } from 'react-router-dom';
import { ROUTE, ROUTE_OWNER } from '../../../constants/route';
import PromoCampaignPage from '../../../containers/PromoCampaignPage/OldPromoCampaign/PromoCampaignPage';
import Header from '../../../components/Header/OldHeader/Header';
import DzoPage from '../../../containers/DzoPage/OldDzoPage/DzoPage';
import PresentationPage from '../../../containers/PresentationPage/PresentationPage';
import CategoryPage from '../../../containers/CategoryPage/CategoryPage';
import ReportsPage from '../../../containers/ReportsPage/ReportsPage';

import styles from './OwnerPage.module.css';

const OwnerPage = (props) => {

    const { history } = props;

    return (
        <Fragment>
            <Header history={ history } />
            <div className={ styles.wrapper }>
                <Switch>
                    <Route exact path={ ROUTE.OWNER } render={ () => <Redirect to={ ROUTE_OWNER.DZO } /> } />

                    <Route path={ ROUTE_OWNER.DZO } component={ DzoPage } />
                    <Route path={ ROUTE_OWNER.REPORTS } component={ ReportsPage } />
                    <Route path={ ROUTE_OWNER.PRESENTATION } component={ PresentationPage } />
                    <Route path={ ROUTE_OWNER.CATEGORY } component={ CategoryPage } />
                    <Route path={ ROUTE_OWNER.OLD_DESIGN_PROMO_CAMPAIGN } component={ PromoCampaignPage } />

                    <Route render={ () => <Redirect to={ ROUTE_OWNER.DZO } /> } />
                </Switch>
            </div>
        </Fragment>
    );
};

export default withRouter(OwnerPage);
