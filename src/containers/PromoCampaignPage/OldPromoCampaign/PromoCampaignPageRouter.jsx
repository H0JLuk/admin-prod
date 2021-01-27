import React from 'react';
import { Redirect, Route, Switch } from 'react-router-dom';
import PromoCampaignRouter from '../PromoCampaign/PromoCampaignRouter';
import PromoCampaignPage from './PromoCampaignPage';

const PromoCampaignPageRouter = ({ match }) => (
    <Switch>
        <Route exact path={ `${match.path}` } component={ PromoCampaignPage } />
        <Route path={ `${match.path}/:promoCampaignId` } component={ PromoCampaignRouter } />
        <Redirect to={ `${match.path}` } />
    </Switch>
);

export default PromoCampaignPageRouter;