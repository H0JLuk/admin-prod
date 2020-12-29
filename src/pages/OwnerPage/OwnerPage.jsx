import React, { Fragment } from 'react';
import { Redirect, Route, Switch, withRouter } from 'react-router-dom';
import { ROUTE, ROUTE_OWNER } from '../../constants/route';
import PromoCampaignPage from '../../containers/PromoCampaignPage/PromoCampaignPage';
import styles from './OwnerPage.module.css';
import Header from '../../components/Header/Header';
import DzoPage from '../../containers/DzoPage/DzoPage';
import LandingPage from '../../containers/LandingPage/LandingPage';
import CategoryPage from '../../containers/CategoryPage/CategoryPage';

const OwnerPage = (props) => {

    const { history } = props;

    return (
        <Fragment>
            <Header history={ history } />
            <div className={ styles.wrapper }>
                <Switch>
                    <Route exact path={ ROUTE.OWNER } render={ () => <Redirect to={ ROUTE_OWNER.DZO } /> } />

                    <Route path={ ROUTE_OWNER.DZO } component={ DzoPage } />
                    <Route path={ ROUTE_OWNER.LANDING } component={ LandingPage } />
                    <Route path={ ROUTE_OWNER.CATEGORY } component={ CategoryPage } />
                    <Route path={ ROUTE_OWNER.PROMO_CAMPAIGN } component={ PromoCampaignPage } />

                    <Route render={ () => <Redirect to={ ROUTE_OWNER.DZO } /> } />
                </Switch>
            </div>
        </Fragment>
    );
};

export default withRouter(OwnerPage);
