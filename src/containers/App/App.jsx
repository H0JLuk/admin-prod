import React from 'react';
import { Switch, Route, Redirect } from 'react-router-dom';
import { ROUTE, MAIN_ROUTE } from '../../constants/route';
import styles from './App.module.css';
import LoginPage from '../LoginPage/LoginPage';
import MainPage from '../MainPage/MainPage';
import FilesPage from '../FilesPage/FilesPage';
import UsersPage from '../UsersPage/UsersPage';
import { isLoggedIn } from '../../api/services/authService';

class App extends React.PureComponent {
    componentDidMount() {
        console.log(process.env.REACT_APP_BACKEND_URL);
    }

    withRedirect = (Component) => (props) => {
        if (!isLoggedIn()) {
            return <Redirect to={ROUTE.LOGIN}/>;
        }

        return <Component {...props} />;
    };

    render() {
        return (
            <div className={styles.app}>
                <Switch>
                    <Route exact path="/" render={() => <Redirect to={ROUTE.LOGIN}/>}/>
                    <Route path={ROUTE.LOGIN} component={LoginPage} />
                    <Route path={ROUTE.MAIN} component={MainPage} />
                    <Route render={() => <Redirect to={ROUTE.LOGIN}/>}/>
                </Switch>
            </div>
        )
    }
}

export default App;
