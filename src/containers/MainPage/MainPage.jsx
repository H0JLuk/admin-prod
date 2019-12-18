import React from 'react';
import { Switch, Route, Redirect, withRouter } from 'react-router-dom';
import { ROUTE, MAIN_ROUTE } from '../../constants/route';
import styles from './MainPage.module.css';
import Header from '../Header/Header';
import FilesPage from '../FilesPage/FilesPage';
import UsersPage from '../UsersPage/UsersPage';
import { logout } from '../../api/services/authService';

const MainPage = (props) => {
    const doLogout = () =>{
        logout().then(() => {
            props.history.push(ROUTE.LOGIN);
        });
    };

    return (
        <>
            <Header doLogout={doLogout}/>
            <div className={styles.wrapper}>
                <Switch>
                    <Route path={MAIN_ROUTE.FILES} component={FilesPage} />
                    <Route path={MAIN_ROUTE.USERS} component={UsersPage} />
                    <Route render={() => <Redirect to={MAIN_ROUTE.FILES}/>}/>
                </Switch>
            </div>
        </>
    )
};

export default withRouter(MainPage);
