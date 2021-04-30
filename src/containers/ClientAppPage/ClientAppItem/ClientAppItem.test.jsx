import React from 'react';
import { shallow } from 'enzyme';
import ClientAppItem from './ClientAppItem';

import * as appNavigation from '../../../utils/appNavigation';
import * as sessionService from '../../../api/services/sessionService';

sessionService.saveAppCode = jest.fn();

describe('<ClientAppItem /> test', () => {
    const props = {
        item: { code: 'code', displayName: 'displayName' },
        isSortable: false,
        matchUrl: 'matchUrl',
        forceUpdate: jest.fn(),
        history: jest.fn(),
        tooltipIsVisible: true,
    };

    it('should match snapshot and render text props ', () => {
        const ClientAppItemComponent = shallow(<ClientAppItem { ...props } />);

        expect(
            ClientAppItemComponent.find('h4')
                .first()
                .text()
        ).toEqual(props.item.displayName);
        expect(
            ClientAppItemComponent.find('.cardCodeValue')
                .first()
                .text()
        ).toEqual(props.item.code);

        expect(ClientAppItemComponent.html()).toMatchSnapshot();
    });

    it('should call history push', () => {
        const updateProps = { ...props, history: { push: jest.fn() } };
        const ClientAppItemComponent = shallow(
            <ClientAppItem { ...updateProps } />
        );

        appNavigation.getLinkForPromoCampaignPage = jest.fn(() => 'testRole');

        ClientAppItemComponent.find('.cardInfo')
            .first()
            .simulate('click');

        const historyPushFunc = updateProps.history.push;
        expect(historyPushFunc).toBeCalledTimes(1);
        expect(historyPushFunc).toBeCalledWith('testRole');

        expect(appNavigation.getLinkForPromoCampaignPage).toBeCalledTimes(1);

        expect(sessionService.saveAppCode).toBeCalledTimes(1);
        expect(sessionService.saveAppCode).toBeCalledWith(props.item.code);
    });

    it('should turn to sortable mode', () => {
        const updateProps = { ...props, isSortable: true };
        const ClientAppItemComponent = shallow(
            <ClientAppItem { ...updateProps } />
        );

        expect(ClientAppItemComponent.exists('.sortableIcon')).toBe(true);
        expect(ClientAppItemComponent.html()).toMatchSnapshot();
    });

    it('should hide tooltip', () => {
        const updateProps = { ...props, tooltipIsVisible: false };
        const ClientAppItemComponent = shallow(
            <ClientAppItem { ...updateProps } />
        );

        expect(ClientAppItemComponent.exists('.cardAction')).toBe(false);
        expect(ClientAppItemComponent.html()).toMatchSnapshot();
    });
});
