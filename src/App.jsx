import React from 'react';
import { Switch, Route, Redirect } from 'react-router-dom';
import { ROUTE } from './constants/route';
import LoginPage from './containers/LoginPage/LoginPage';
import MainPage from './containers/MainPage/MainPage';
import { isLoggedIn} from './api/services/authService';

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
            <>
                <Switch>
                    <Route exact path="/" render={() => <Redirect to={ROUTE.LOGIN}/>}/>
                    <Route path={ROUTE.LOGIN} component={LoginPage} />
                    <Route path={ROUTE.MAIN} component={this.withRedirect(MainPage)} />
                    <Route render={() => <Redirect to={ROUTE.LOGIN}/>}/>
                </Switch>
            </>
        )
    }
}

export default App;
