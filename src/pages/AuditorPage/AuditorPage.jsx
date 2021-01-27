import React, { Fragment } from 'react';
import { Redirect, Route, Switch, withRouter } from 'react-router-dom';
import { ROUTE, ROUTE_AUDITOR } from '../../constants/route';
import styles from './AuditorPage.module.css';
import Header from '../../components/Header/OldHeader/Header';
import AuditPage from '../../containers/AuditPage/AuditPage';

const AuditorPage = (props) => {
        
    const { history } = props;

    return (
        <Fragment>
            <Header history={ history } />
            <div className={ styles.wrapper }>
                <Switch>
                    <Route exact path={ ROUTE.AUDITOR } render={ () => <Redirect to={ ROUTE_AUDITOR.AUDIT } /> } />

                    <Route path={ ROUTE_AUDITOR.AUDIT } component={ AuditPage } />

                    <Route render={ () => <Redirect to={ ROUTE_AUDITOR.AUDIT } /> } />
                </Switch>
            </div>
        </Fragment>
    );
};

export default withRouter(AuditorPage);
