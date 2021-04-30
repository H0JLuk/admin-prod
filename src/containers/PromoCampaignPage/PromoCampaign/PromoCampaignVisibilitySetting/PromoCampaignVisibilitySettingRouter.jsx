import React, { useCallback } from 'react';
import { Redirect, Route, Switch, useRouteMatch, useHistory } from 'react-router-dom';
import PromoCampaignVisibilitySetting from './PromoCampaignVisibilitySetting';
import PromoCampaignVisibilitySettingForm
    from './PromoCampaignVisibilitySettingForm/PromoCampaignVisibilitySettingForm';

const PromoCampaignVisibilitySettingRouter = () => {
    const match = useRouteMatch();
    const history = useHistory();

    const redirectToVisibilitySetting = useCallback(() => {
        history.push(`${match.url}`);
    }, [history, match.url]);

    return (
        <Switch>
            <Route exact path={ `${match.path}` } component={ PromoCampaignVisibilitySetting } />
            <Route
                path={ `${match.path}/create` }
                render={ routeProps => (
                    <PromoCampaignVisibilitySettingForm
                        { ...routeProps }
                        onSubmit={ redirectToVisibilitySetting }
                        onCancel={ redirectToVisibilitySetting }
                    />
                ) }
            />
            <Redirect to={ `${match.path}` } />
        </Switch>
    );
};

export default PromoCampaignVisibilitySettingRouter;
