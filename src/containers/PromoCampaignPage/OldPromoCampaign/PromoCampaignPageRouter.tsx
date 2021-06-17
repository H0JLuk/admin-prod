import React from 'react';
import { Redirect, Route, Switch, match } from 'react-router-dom';
import PromoCampaignRouter from '../PromoCampaign/PromoCampaignRouter';
import PromoCampaignPage from './PromoCampaignPage';

type IPromoCampaignPageRouter = {
    match: match;
};

const PromoCampaignPageRouter: React.FC<IPromoCampaignPageRouter> = ({ match }) => (
    <Switch>
        <Route exact path={`${match.path}`} component={PromoCampaignPage} />
        <Route path={`${match.path}/:promoCampaignId`} component={PromoCampaignRouter} />
        <Redirect to={`${match.path}`} />
    </Switch>
);

export default PromoCampaignPageRouter;
