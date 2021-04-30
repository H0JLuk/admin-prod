import React from 'react';
import { createMemoryHistory } from 'history';
import { Router, Route, generatePath } from 'react-router-dom';
import { render } from '@testing-library/react';
import { PROMO_CAMPAIGN_PAGES } from '../../constants/route';
import PromoCampaignPageRouter from './PromoCampaignPageRouter';

const PromoCampaignListName = 'PromoCampaignList';
const PromoCampaignInfoName = 'PromoCampaignInfo';
const PromoCampaignFormName = 'PromoCampaignForm';
const PromoCampaignVisibilitySettingRouterName = 'PromoCampaignVisibilitySettingRouter';
jest.mock(
    './PromoCampaign/PromoCampaignList/PromoCampaignList',
    () => () => <div>PromoCampaignList</div>
);
jest.mock(
    './PromoCampaign/PromoCampaignInfo/PromoCampaignInfo',
    () => () => <div>PromoCampaignInfo</div>
);
jest.mock(
    './PromoCampaign/PromoCampaignForm/PromoCampaignForm',
    () => ({ mode = 'new', isCopy }) => (
        <div>
            PromoCampaignForm
            <span> { mode }</span>
            { mode === 'edit' && <span>{ isCopy ? 'isCopy' : 'notCopy' }</span> }
        </div>
    )
);
jest.mock(
    './PromoCampaign/PromoCampaignVisibilitySetting/PromoCampaignVisibilitySettingRouter',
    () => () => <div>PromoCampaignVisibilitySettingRouter</div>
);


describe('<PromoCampaignPageRouter /> tests.', () => {

    let history;
    let getByText;

    beforeEach(() => {
        history = createMemoryHistory();
        ({ getByText } = render(
            <Router history={ history }>
                <Route path="/test">
                    <PromoCampaignPageRouter />
                </Route>
            </Router>
        ));
    });

    it('should render PromoCampaignList', () => {

        history.push('/test');
        expect(getByText(PromoCampaignListName)).toBeInTheDocument();

        history.push('/test/random_string');
        expect(getByText(PromoCampaignListName)).toBeInTheDocument();
    });

    it('should render PromoCampaignInfo', () => {
        const url = generatePath(`/test${PROMO_CAMPAIGN_PAGES.PROMO_CAMPAIGN_INFO}`, { promoCampaignId: 1 });

        history.push(url);
        expect(getByText(PromoCampaignInfoName)).toBeInTheDocument();
    });

    it('should render PromoCampaignForm', () => {
        const createURL = generatePath(`/test${PROMO_CAMPAIGN_PAGES.ADD_PROMO_CAMPAIGN}`);
        const copyURL = generatePath(`/test${PROMO_CAMPAIGN_PAGES.PROMO_CAMPAIGN_COPY}`);
        const editURL = generatePath(`/test${PROMO_CAMPAIGN_PAGES.PROMO_CAMPAIGN_EDIT}`, { promoCampaignId: 1 });

        history.push(createURL);
        expect(getByText(PromoCampaignFormName)).toBeInTheDocument();
        expect(getByText('new')).toBeInTheDocument();

        history.push(copyURL);
        expect(getByText(PromoCampaignFormName)).toBeInTheDocument();
        expect(getByText('edit')).toBeInTheDocument();
        expect(getByText('isCopy')).toBeInTheDocument();

        history.push(editURL);
        expect(getByText(PromoCampaignFormName)).toBeInTheDocument();
        expect(getByText('edit')).toBeInTheDocument();
        expect(getByText('notCopy')).toBeInTheDocument();
    });

    it('should render PromoCampaignVisibilitySettingRouter', () => {
        const url = generatePath(`/test${PROMO_CAMPAIGN_PAGES.VISIBILITY_SETTINGS}`, { promoCampaignId: 1 });

        history.push(url);
        expect(getByText(PromoCampaignVisibilitySettingRouterName)).toBeInTheDocument();
    });

});
