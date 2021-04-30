import React from 'react';
import { MemoryRouter } from 'react-router-dom';
import { mount, shallow } from 'enzyme';
import { act } from 'react-dom/test-utils';
import ClientAppPage from './ClientAppPage';
import ROLES from '../../constants/roles';

import * as clientAppService from '../../api/services/clientAppService';
import * as sessionService from '../../api/services/sessionService';
import * as helper from '../../utils/helper';
import { CLIENT_APPS_PAGES } from '../../constants/route';
import { clientAppListTestResponse } from '../../../__tests__/constants';
import { sleep } from '../../setupTests';

describe('<ClientAppPage /> test', () => {
    const props = {
        matchPath: 'matchPath',
        history: {
            push: jest.fn(),
        },
    };

    beforeEach(() => {
        sessionService.getRole = jest.fn(() => ROLES.ADMIN);
    });

    it('should match snapshot', () => {
        const ClientAppPageComponent = shallow(<ClientAppPage { ...props } />);

        expect(ClientAppPageComponent.debug()).toMatchSnapshot();
    });

    it('should do history push on clicking add button', () => {
        const ClientAppPageComponent = shallow(
            <ClientAppPage { ...props } />
        );

        ClientAppPageComponent.find('HeaderWithActions')
            .prop('buttons')[0]
            .onClick();

        expect(props.history.push).toBeCalledTimes(1);
        expect(props.history.push).toBeCalledWith(`${props.matchPath}${CLIENT_APPS_PAGES.ADD_APP}`);
    });

    it('should go to sortable mode on clicking sort button', () => {
        clientAppService.reorderClientApp = jest.fn();
        clientAppService.getClientAppList = jest.fn(() => clientAppListTestResponse);
        const ClientAppPageComponent = shallow(<ClientAppPage { ...props } />);

        expect(ClientAppPageComponent.find('HeaderWithActions').prop('buttons')[1].label).not.toEqual('Отменить');
        ClientAppPageComponent.find('HeaderWithActions').prop('buttons')[1].onClick();
        expect(ClientAppPageComponent.find('HeaderWithActions').prop('buttons')[1].label).toEqual('Отменить');

        ClientAppPageComponent.find('HeaderWithActions').prop('buttons')[0].onClick();
        expect(clientAppService.reorderClientApp).toBeCalledTimes(1);
    });

    it('should warn with error in console after getClientAppList rejection', async () => {
        clientAppService.getClientAppList.mockRejectedValueOnce('warn');
        const spy = jest.spyOn(console, 'warn').mockImplementation(() => '');
        mount(
            <MemoryRouter>
                <ClientAppPage { ...props } />
            </MemoryRouter>
        );
        await sleep();
        expect(spy).toBeCalledTimes(1);
    });

    it('should cancel sortable mode', () => {
        clientAppService.reorderClientApp = jest.fn();
        clientAppService.getClientAppList = jest.fn(() => clientAppListTestResponse);
        const ClientAppPageComponent = shallow(<ClientAppPage { ...props } />);

        ClientAppPageComponent.find('HeaderWithActions').prop('buttons')[1].onClick();
        expect(ClientAppPageComponent.find('HeaderWithActions').prop('buttons')[1].label).toEqual('Отменить');

        ClientAppPageComponent.find('HeaderWithActions').prop('buttons')[1].onClick();
        expect(ClientAppPageComponent.find('HeaderWithActions').prop('buttons')[1].label).toEqual('Изменить порядок');
        expect(1).toEqual(1);
    });

    it('should call `arrayMove` function', async () => {
        sessionService.getRole = jest.fn(() => ROLES.ADMIN);
        clientAppService.getClientAppList = jest.fn(() => clientAppListTestResponse);
        helper.arrayMove = jest.fn(() => []);

        const ClientAppPageComponent = shallow(<ClientAppPage { ...props } />);
        ClientAppPageComponent.find('sortableList').simulate('sortEnd', { oldIndex: 0, newIndex: 1 });
        expect(helper.arrayMove).toHaveBeenCalledWith([], 0, 1);
    });

    it('sortableContainer should render <div /> children', async () => {
        clientAppService.reorderClientApp = jest.fn();
        sessionService.getRole = jest.fn(() => ROLES.ADMIN);
        clientAppService.getClientAppList = jest.fn(() => clientAppListTestResponse);

        const ClientAppPageComponent = mount(
            <MemoryRouter>
                <ClientAppPage { ...props } />
            </MemoryRouter>
        );

        await act(async () => {
            expect(ClientAppPageComponent.find('sortableList').find('div')).toHaveLength(1);
        });
    });
});
