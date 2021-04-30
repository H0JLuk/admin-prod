import React from 'react';
import { createMemoryHistory } from 'history';
import { Router, Route } from 'react-router-dom';
import { render } from '@testing-library/react';
import ClientAppPageRouter from './ClientAppPageRouter';
import * as sessionService from '../../api/services/sessionService';
import ROLES from '../../constants/roles';
import { CLIENT_APPS_PAGES } from '../../constants/route';

const ClientAppPageName = 'ClientAppPage';
const ClientAppContainerName = 'ClientAppContainer';
jest.mock('./ClientAppPage', () => () => <div>ClientAppPage</div>);
jest.mock('./ClientAppForm/ClientAppContainer', () => ({ type }) => <div>ClientAppContainer <span>{ type }</span></div>);

describe('<ClientAppPageRouter /> tests.', () => {

    it('should render ClientAppPage', () => {
        const history = createMemoryHistory();

        const { getByText } = render(
            <Router history={ history }>
                <Route path="/test">
                    <ClientAppPageRouter />
                </Route>
            </Router>
        );


        history.push('/test');
        expect(getByText(ClientAppPageName)).toBeInTheDocument();

        history.push('/test/random_string');
        expect(getByText(ClientAppPageName)).toBeInTheDocument();
    });

    it('should render ClientAppContainer', () => {
        sessionService.getRole = jest.fn(() => ROLES.ADMIN);
        const history = createMemoryHistory();

        const { getByText } = render(
            <Router history={ history }>
                <Route path="/test">
                    <ClientAppPageRouter />
                </Route>
            </Router>
        );


        history.push(`/test${CLIENT_APPS_PAGES.ADD_APP}`);
        expect(getByText(ClientAppContainerName)).toBeInTheDocument();
        expect(getByText('new')).toBeInTheDocument();

        history.push(`/test${CLIENT_APPS_PAGES.EDIT_APP}`);
        expect(getByText(ClientAppContainerName)).toBeInTheDocument();
        expect(getByText('edit')).toBeInTheDocument();
    });

    it('should redirect to ClientAppPage', () => {
        sessionService.getRole = jest.fn(() => 'anotherRole');
        const history = createMemoryHistory();

        const { getByText } = render(
            <Router history={ history }>
                <Route path="/test">
                    <ClientAppPageRouter />
                </Route>
            </Router>
        );


        history.push(`/test${CLIENT_APPS_PAGES.ADD_APP}`);
        expect(getByText(ClientAppPageName)).toBeInTheDocument();

        history.push(`/test${CLIENT_APPS_PAGES.EDIT_APP}`);
        expect(getByText(ClientAppPageName)).toBeInTheDocument();
    });
});
