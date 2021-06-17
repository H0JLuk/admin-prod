import React from 'react';
import PromoCampaignVisibilitySettingRouter from './PromoCampaignVisibilitySettingRouter';
import { Route, Router } from 'react-router-dom';
import { fireEvent, render } from '@testing-library/react';
import { createMemoryHistory } from 'history';

const PromoCampaignVisibilitySettingFormName = 'PromoCampaignVisibilitySettingForm';
const PromoCampaignVisibilitySettingName = 'PromoCampaignVisibilitySetting';
const SUBMIT_BTN = 'SUBMIT_BTN';
const CANCEL_BTN = 'CANCEL_BTN';

jest.mock('./PromoCampaignVisibilitySettingForm/PromoCampaignVisibilitySettingForm', () => ({ onSubmit, onCancel }) => (
    <div>
        <span>PromoCampaignVisibilitySettingForm</span>
        <button onClick={ onSubmit }>SUBMIT_BTN</button>
        <button onClick={ onCancel }>CANCEL_BTN</button>
    </div>
));

jest.mock('./PromoCampaignVisibilitySetting', () => () => (
    <div>
        <span>PromoCampaignVisibilitySetting</span>
    </div>
));

const mockPush = jest.fn();
jest.mock('react-router-dom', () => ({
    ...jest.requireActual('react-router-dom'),
    useHistory: () => ({
        push: mockPush,
    }),
}));

describe('PromoCampaignVisibilitySettingRouter test', () => {
    it('should render PromoCampaignVisibilitySettingForm', () => {
        const history = createMemoryHistory();

        const { getByText } = render(
            <Router history={ history }>
                <Route path="/test">
                    <PromoCampaignVisibilitySettingRouter />
                </Route>
            </Router>
        );

        history.push('/test');
        expect(getByText(PromoCampaignVisibilitySettingName)).toBeInTheDocument();

        history.push('/test/create');
        expect(getByText(PromoCampaignVisibilitySettingFormName)).toBeInTheDocument();

        history.push('/test/random');
        expect(getByText(PromoCampaignVisibilitySettingName)).toBeInTheDocument();
    });

    it('should call history.push after submit', () => {
        const history = createMemoryHistory();
        const { getByText } = render(
            <Router history={ history }>
                <Route path="/test">
                    <PromoCampaignVisibilitySettingRouter />
                </Route>
            </Router>
        );

        history.push('/test/create');
        fireEvent.click(getByText(SUBMIT_BTN));
        expect(mockPush).toBeCalled();
    });

    it('should call history.push after cancel', () => {
        const history = createMemoryHistory();
        const { getByText } = render(
            <Router history={ history }>
                <Route path="/test">
                    <PromoCampaignVisibilitySettingRouter />
                </Route>
            </Router>
        );

        history.push('/test/create');
        fireEvent.click(getByText(CANCEL_BTN));
        expect(mockPush).toBeCalled();
    });
});
