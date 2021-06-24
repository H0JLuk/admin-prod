import React from 'react';
import { shallow } from 'enzyme';
import { CLIENT_APPS_PAGES } from '../../../constants/route';
import ClientAppMenu, { DropdownMenu } from './ClientAppMenu';

import * as sessionService from '../../../api/services/sessionService';
import * as clientAppService from '../../../api/services/clientAppService';
import * as utils from '../../../utils/utils';

sessionService.saveAppCode = jest.fn();
utils.confirmModal = jest.fn();
clientAppService.deleteClientApp = jest.fn();

describe('<ClientAppMenu /> test', () => {
    const props = {
        mathUrl: 'url',
        clientAppItem: { code: 'code', id: 'id', displayName: 'displayName' },
        forceUpdate: jest.fn(),
        history: {
            push: jest.fn(),
        },
    };

    it('should match snapshot', () => {
        const ClientAppMenuComponent = shallow(<ClientAppMenu { ...props } />);

        expect(ClientAppMenuComponent.html()).toMatchSnapshot();
    });

    it('should open dropdown on click', () => {
        const ClientAppMenuComponent = shallow(<ClientAppMenu { ...props } />);
        expect(ClientAppMenuComponent.prop('visible')).toBe(false);

        ClientAppMenuComponent.simulate('visibleChange', true);
        expect(ClientAppMenuComponent.prop('visible')).toBe(true);
    });

    it('should do history push and change appCode on editPage click', () => {
        const updateProps = {
            ...props,
            history: {
                push: jest.fn(),
            },
        };
        const ClientAppMenuComponent = shallow(<ClientAppMenu { ...updateProps } />);

        ClientAppMenuComponent.simulate('visibleChange', true);
        ClientAppMenuComponent.prop('overlay').props.redirectToEditPage();

        const historyPushFunc = updateProps.history.push;
        expect(historyPushFunc).toBeCalledTimes(1);
        expect(
            historyPushFunc
        ).toBeCalledWith(
            `${updateProps.matchUrl}${CLIENT_APPS_PAGES.EDIT_APP}`,
            { appState: updateProps.clientAppItem }
        );

        expect(sessionService.saveAppCode).toBeCalledTimes(1);
        expect(sessionService.saveAppCode).toBeCalledWith(updateProps.clientAppItem.code);
    });

    it('should call modal on deleting ', async () => {
        const ClientAppMenuComponent = shallow(<ClientAppMenu { ...props } />);
        ClientAppMenuComponent.simulate('visibleChange', true);
        ClientAppMenuComponent.prop('overlay').props.onDelete();

        expect(utils.confirmModal).toHaveBeenCalledTimes(1);

        await utils.confirmModal.mock.calls[0][0].onOk();

        expect(clientAppService.deleteClientApp).toBeCalledTimes(1);
        expect(clientAppService.deleteClientApp).toBeCalledWith(
            props.clientAppItem.id
        );

        expect(props.forceUpdate).toBeCalledTimes(1);
    });
});


describe('<DropdownMenu /> tests', () => {

    const props = {
        onDelete: jest.fn(),
        redirectToEditPage: jest.fn(),
    };

    it('should call `onDelete` function', () => {
        const wrapper = shallow(<DropdownMenu { ...props } />);

        wrapper.find('MenuItem').first().children().simulate('click');
        expect(props.redirectToEditPage).toHaveBeenCalledTimes(1);
        expect(props.onDelete).toHaveBeenCalledTimes(0);
    });

    it('should call `redirectToEditPage` function', () => {
        const wrapper = shallow(<DropdownMenu { ...props } />);

        wrapper.find('MenuItem').last().children().simulate('click');
        expect(props.onDelete).toHaveBeenCalledTimes(1);
        expect(props.redirectToEditPage).toHaveBeenCalledTimes(0);
    });
});
