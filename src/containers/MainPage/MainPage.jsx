import React, { Fragment } from 'react';
import { Switch, Route, Redirect, withRouter } from 'react-router-dom';
import { ROUTE, APP_ROUTE } from '../../constants/route';
import Header from '../Header/Header';
import FilesPage from '../FilesPage/FilesPage';
import UsersPage from '../UsersPage/UsersPage';
import DzoPage from '../DzoPage/DzoPage';
import LandingPage from '../LandingPage/LandingPage';
import CategoryPage from '../CategoryPage/CategoryPage';
import SliderPage from '../SliderPage/SliderPage';
import styles from './MainPage.module.css';

import { logout } from '../../api/services/authService';
import { getClientAppCodeHeader } from "../../api/services/sessionService";
import PromoCampaignPage from "../PromoCampaignPage/PromoCampaignPage";


const MainPage = (props) => {
    const doLogout = () => {
        logout().then(() => {
            props.history.push(ROUTE.LOGIN);
        });
    };

    return (
        <Fragment>
            <Header doLogout={ doLogout } code={ getClientAppCodeHeader() } />
            <div className={ styles.wrapper }>
                <Switch>
                    <Route path={ APP_ROUTE.FILES } component={ FilesPage } />
                    <Route path={ APP_ROUTE.USERS } component={ UsersPage } />
                    <Route path={ APP_ROUTE.DZO } component={ DzoPage } />
                    <Route path={ APP_ROUTE.LANDING } component={ LandingPage } />
                    <Route path={ APP_ROUTE.CATEGORY } component={ CategoryPage } />
                    <Route path={ APP_ROUTE.SLIDER } component={ SliderPage } />
                    <Route path={ APP_ROUTE.PROMO_CAMPAIGN } component={ PromoCampaignPage } />
                    <Route render={ () => <Redirect to={ APP_ROUTE.USERS } /> } />
                </Switch>
            </div>
        </Fragment>
    );
};

export default withRouter(MainPage);
