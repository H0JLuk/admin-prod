import React, { Fragment } from 'react';
import { Redirect, Route, Switch, withRouter } from 'react-router-dom';
import { ROUTE, ROUTE_USER_MANAGER } from '../../constants/route';
import UsersPage from '../../containers/UsersPage/UsersPage';
import styles from './UserManagerPage.module.css';
import Header from '../../components/Header/Header';

const UserManagerPage = (props) => {
        
    const { history } = props;

    return (
        <Fragment>
            <Header history={ history } />
            <div className={ styles.wrapper }>
                <Switch>
                    <Route exact path={ ROUTE.USER_MANAGER } render={ () => <Redirect to={ ROUTE_USER_MANAGER.USERS } /> } />

                    <Route path={ ROUTE_USER_MANAGER.USERS } component={ UsersPage } />

                    <Route render={ () => <Redirect to={ ROUTE_USER_MANAGER.USERS } /> } />
                </Switch>
            </div>
        </Fragment>
    );
};

export default withRouter(UserManagerPage);
