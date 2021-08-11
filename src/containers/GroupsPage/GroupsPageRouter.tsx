import React from 'react';
import { Redirect, Route, Switch, useRouteMatch } from 'react-router-dom';
import GroupList from './GroupList';
import { GROUPS_PAGES } from '@constants/route';
import GroupInfo from './GroupInfo/';
import GroupForm from './GroupForms';

const GroupsPageRouter: React.FC = () => {
    const match = useRouteMatch<{ groupId: string; }>();

    return (
        <Switch>
            <Route
                exact
                path={`${ match.path }`}
                render={routeProps => <GroupList {...routeProps} matchPath={match.path} />}
            />
            <Route
                path={`${ match.path }${ GROUPS_PAGES.ADD_GROUP }`}
                render={routeProps => <GroupForm {...routeProps} matchPath={match.path} mode="create" />}
            />
            <Route
                path={`${ match.path }${ GROUPS_PAGES.EDIT_GROUP }`}
                render={routeProps => <GroupForm {...routeProps} matchPath={match.path} mode="edit" />}
            />
            <Route
                path={`${ match.path }${ GROUPS_PAGES.INFO_GROUP}`}
                render={routeProps => <GroupInfo {...routeProps} matchPath={match.path} />}
            />

            <Redirect to={`${ match.path }`} />
        </Switch>
    );
};

export default GroupsPageRouter;
