import React from 'react';
import { Redirect, Route, Switch, match as Match } from 'react-router-dom';
import PromoCampaignVisibilitySettingRouter from './PromoCampaignVisibilitySetting/PromoCampaignVisibilitySettingRouter';

type PromoCampaignRouterProps = {
    match: Match;
};

const PromoCampaignRouter: React.FC<PromoCampaignRouterProps> = ({ match }) => (
    <Switch>
        <Route path={`${match.path}/visibility-setting`} component={PromoCampaignVisibilitySettingRouter} />
        <Redirect to={`${match.path}`} />
    </Switch>
);

export default PromoCampaignRouter;
