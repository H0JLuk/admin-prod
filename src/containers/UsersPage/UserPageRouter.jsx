import React from 'react';
import { Redirect, Route, Switch, useRouteMatch } from 'react-router-dom';
import UserPage from './UserPage/UserForm';
import UsersList from './UserPage/UsersList';
import UserMultiEdit from './UserPage/UserMultiEdit/UserMultiEdit';
import { USERS_PAGES } from '../../constants/route';

function UserPageRouter() {
    const match = useRouteMatch();

    return (
        <Switch>
            <Route
                exact
                path={ `${ match.path }` }
                render={ routeProps => <UsersList { ...routeProps } matchUrl={ match.path } /> }
            />
            <Route
                path={ `${ match.path }${ USERS_PAGES.EDIT_SOME_USERS }` }
                render={ routeProps => <UserMultiEdit { ...routeProps } matchUrl={ match.path } /> }
            />
            <Route
                path={ `${ match.path }${ USERS_PAGES.ADD_USER }` }
                render={ routeProps => <UserPage { ...routeProps } matchUrl={ match.path } type="new" /> }
            />
            <Route
                path={ `${ match.path }${ USERS_PAGES.EDIT_USER }` }
                render={ routeProps => <UserPage { ...routeProps } matchUrl={ match.path } type="edit" /> }
            />
            <Route
                path={ `${ match.path }${ USERS_PAGES.USER_INFO }` }
                render={ routeProps => <UserPage { ...routeProps } matchUrl={ match.path } type="info" /> }
            />

            <Redirect to={ `${ match.path }` } />
        </Switch>
    );
}

export default UserPageRouter;
