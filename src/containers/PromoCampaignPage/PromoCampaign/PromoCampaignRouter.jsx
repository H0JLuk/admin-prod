import React from 'react';
import { Redirect, Route, Switch } from 'react-router-dom';
import PromoCampaignVisibilitySettingRouter from './PromoCampaignVisibilitySetting/PromoCampaignVisibilitySettingRouter';

const PromoCampaignRouter =({ match }) => (
    <Switch>
        <Route path={ `${match.path}/visibility-setting` } component={ PromoCampaignVisibilitySettingRouter } />
        <Redirect to={ `${match.path}` } />
    </Switch>
);

export default PromoCampaignRouter;