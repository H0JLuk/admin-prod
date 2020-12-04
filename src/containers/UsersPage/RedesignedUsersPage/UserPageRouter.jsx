import React from 'react';
import { Redirect, Route, Switch, useRouteMatch } from 'react-router-dom';
import UserPage from './UserPage/UserForm';
import TableUser from '../../TableUser/TableUser';
import UserMultiEdit from './UserPage/UserMultiEdit/UserMultiEdit';
import { ROUTE_ADMIN_USERS } from '../../../constants/route';

function UserPageRouter() {
    const match = useRouteMatch();

    return (
        <Switch>
            <Route exact path={ `${match.path}` } component={ TableUser } />
            <Route
                path={ ROUTE_ADMIN_USERS.EDIT_SOME_USERS }
                component={ UserMultiEdit }
            />
            <Route
                path={ ROUTE_ADMIN_USERS.ADD_USER }
                render={ routeProps => <UserPage { ...routeProps } type="new" /> }
            />
            <Route
                path={ ROUTE_ADMIN_USERS.EDIT_USER }
                render={ routeProps => <UserPage { ...routeProps } type="edit" /> }
            />
            <Route
                path={ ROUTE_ADMIN_USERS.USER_INFO }
                render={ routeProps => <UserPage { ...routeProps } type="info" /> }
            />

            <Redirect to={ `${match.path}` } />
        </Switch>
    );
}

export default UserPageRouter;
