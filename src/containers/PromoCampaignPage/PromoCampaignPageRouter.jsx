import React from 'react';
import { Redirect, Route, Switch, useRouteMatch } from 'react-router-dom';
import { PROMO_CAMPAIGN_PAGES } from '../../constants/route';
import PromoCampaignInfo from './PromoCampaign/PromoCampaignInfo/PromoCampaignInfo';
import PromoCampaignList from './PromoCampaign/PromoCampaignList/PromoCampaignList';
import PromoCampaignForm from './PromoCampaign/PromoCampaignForm/PromoCampaignForm';
import PromoCampaignVisibilitySettingRouter from './PromoCampaign/PromoCampaignVisibilitySetting/PromoCampaignVisibilitySettingRouter';

function PromoCampaignRouter() {
    const match = useRouteMatch();

    return (
        <Switch>
            <Route exact path={ `${match.path}` } component={ PromoCampaignList } />
            <Route
                path={ `${ match.path }${ PROMO_CAMPAIGN_PAGES.ADD_PROMO_CAMPAIGN }` }
                render={ routeProps => <PromoCampaignForm { ...routeProps } matchUrl={ match.path } /> }
            />
            <Route
                path={ `${ match.path }${ PROMO_CAMPAIGN_PAGES.PROMO_CAMPAIGN_EDIT }` }
                render={ routeProps => <PromoCampaignForm { ...routeProps } matchUrl={ match.path } mode='edit' /> }
            />
            <Route
                path={ `${ match.path }${ PROMO_CAMPAIGN_PAGES.PROMO_CAMPAIGN_COPY }` }
                render={ routeProps => <PromoCampaignForm { ...routeProps } matchUrl={ match.path } mode='edit' isCopy /> }
            />
            <Route
                path={ `${ match.path }${ PROMO_CAMPAIGN_PAGES.PROMO_CAMPAIGN_INFO }` }
                render={ routeProps => <PromoCampaignInfo { ...routeProps } matchUrl={ match.path } /> }
            />
            <Route
                path={ `${ match.path }${ PROMO_CAMPAIGN_PAGES.VISIBILITY_SETTINGS }` }
                component={ PromoCampaignVisibilitySettingRouter }
            />

            <Redirect to={ `${match.path}` } />
        </Switch>
    );
}

export default PromoCampaignRouter;