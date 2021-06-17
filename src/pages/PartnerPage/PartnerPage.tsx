import React from 'react';
import { Redirect, Route, Switch } from 'react-router-dom';
import { ROUTE, ROUTE_PARTNER } from '@constants/route';

import UserPageRouter from '@containers/UsersPage/UserPageRouter';
import Sidebar from '@components/Sidebar/Sidebar';

import styles from './PartnerPage.module.css';

const PartnerPage = () => (
    <div className={styles.pageWrapper}>
        <Sidebar />
        <div className={styles.wrapper}>
            <Switch>
                <Route exact path={`${ROUTE.PARTNER}`} render={() => <Redirect to={ROUTE_PARTNER.USERS} />} />

                <Route path={ROUTE_PARTNER.USERS} component={UserPageRouter} />

                <Route render={() => <Redirect to={ROUTE_PARTNER.USERS} />} />
            </Switch>
        </div>
    </div>
);

export default PartnerPage;
