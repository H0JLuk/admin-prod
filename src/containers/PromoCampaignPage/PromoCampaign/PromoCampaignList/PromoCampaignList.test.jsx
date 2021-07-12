import React from 'react';
import { mount, shallow } from 'enzyme';
import { act } from 'react-dom/test-utils';

import PromoCampaignList from './PromoCampaignList';
import { promoCampaignTestData } from '../../../../../__tests__/constants';

import * as promoCampaignService from '../../../../api/services/promoCampaignService';
import * as appNavigation from '../../../../utils/appNavigation';
import * as helper from '../../../../utils/helper';
import { sleep } from '../../../../setupTests';

promoCampaignService.getFilteredPromoCampaignList = jest.fn();
promoCampaignService.reorderPromoCampaigns = jest.fn();
appNavigation.getLinkForCreatePromoCampaign = jest.fn();


const mockHistoryPush = jest.fn();
jest.mock('react-router-dom', () => ({
    ...jest.requireActual('react-router-dom'),
    useLocation: () => ({ pathname: '/testpath' }),
    useHistory: () => ({
        push: mockHistoryPush,
        location: jest.fn(),
    }),
    useRouteMatch: () => ({ path: 'test' }),
}));

describe('<PromoCampaignList /> test', () => {

    const container = shallow(<PromoCampaignList />);

    const promoCampaignList = [
        { ...promoCampaignTestData },
        { ...promoCampaignTestData, id: 23 },
        { ...promoCampaignTestData, id: 22 },
    ];

    it('should match the snapshot', () => {
        expect(container.html()).toMatchSnapshot();
    });

    it('should do history push on clicking add button', () => {
        container.find('HeaderWithActions').prop('buttons')[0].onClick();
        expect(mockHistoryPush).toBeCalledTimes(1);
        expect(appNavigation.getLinkForCreatePromoCampaign).toBeCalledTimes(1);
    });

    it('should go to sortable mode on clicking sort button', () => {
        expect(container.find('HeaderWithActions').prop('buttons')[1].label).toEqual('Изменить порядок');
        container.find('HeaderWithActions').prop('buttons')[1].onClick();
        expect(container.find('HeaderWithActions').prop('buttons')[1].label).toEqual('Отменить');
    });

    it('reorderPromoCampaigns should be called when the sort button is clicked in sortable mode', async () => {
        promoCampaignService.getFilteredPromoCampaignList = jest.fn(() => ({ promoCampaignDtoList: [] }));
        await container.find('HeaderWithActions').prop('buttons')[0].onClick();
        expect(promoCampaignService.reorderPromoCampaigns).toBeCalledTimes(1);
        expect(container.find('HeaderWithActions').prop('buttons')[1].label).toEqual('Изменить порядок');
    });

    it('console.warn should be called when reorderPromoCampaigns rejected', async () => {
        const spy = jest.spyOn(console, 'warn').mockImplementation(() => '');
        promoCampaignService.reorderPromoCampaigns.mockImplementation(() => Promise.reject('test error'));
        await container.find('HeaderWithActions').prop('buttons')[1].onClick();
        await container.find('HeaderWithActions').prop('buttons')[0].onClick();
        expect(spy).toHaveBeenCalledTimes(1);
        expect(spy).toHaveBeenCalledWith('test error');
    });

    it('SortableElementItem should not be displayed', async () => {
        promoCampaignService.getFilteredPromoCampaignList = jest.fn(() => ({ promoCampaignDtoList: [] }));
        container.find('HeaderWithActions').prop('buttons')[1].onClick();
        container.find('HeaderWithActions').prop('buttons')[1].onClick();
        expect(container.find('sortableList').children()).toHaveLength(0);
    });

    it('updateData should be called', async () => {
        promoCampaignService.getFilteredPromoCampaignList = jest.fn(() => ({
            promoCampaignDtoList: promoCampaignList,
        }));
        await container.find('HeaderWithActions').prop('buttons')[1].onClick();
        await container.find('HeaderWithActions').prop('buttons')[1].onClick();
        expect(promoCampaignService.getFilteredPromoCampaignList).toBeCalledTimes(1);
        expect(container.find('sortableList').children()).toHaveLength(3);
    });

    it('idMap should be correct', async () => {
        promoCampaignService.getFilteredPromoCampaignList = jest.fn(() => ({
            promoCampaignDtoList: promoCampaignList,
        }));
        const idMap = {
            '24': 0,
            '23': 1,
            '22': 2,
        };
        await container.find('HeaderWithActions').prop('buttons')[1].onClick();
        await container.find('HeaderWithActions').prop('buttons')[0].onClick();
        expect(promoCampaignService.reorderPromoCampaigns).toHaveBeenCalledWith(idMap);
    });

    it('should call `arrayMove` function', async () => {
        helper.arrayMove = jest.fn(() => []);
        container.find('sortableList').simulate('sortEnd', { oldIndex: 0, newIndex: 1 });
        expect(helper.arrayMove).toHaveBeenCalledWith(promoCampaignList, 0, 1);
    });

    it('console.error should be called when getFilteredPromoCampaignList rejected', async () => {
        const spyConsoleError = jest.spyOn(console, 'error').mockImplementation(() => '');
        const requestError = new Error('test error');
        promoCampaignService.getFilteredPromoCampaignList.mockImplementation(() => Promise.reject(requestError));
        await container.find('HeaderWithActions').prop('buttons')[1].onClick();
        await container.find('HeaderWithActions').prop('buttons')[1].onClick();
        await sleep();
        expect(spyConsoleError).toHaveBeenCalledTimes(1);
        expect(spyConsoleError).toHaveBeenCalledWith(requestError);
    });

    it('getFilteredPromoCampaignList should be called', () => {
        console.error = jest.fn().mockImplementation(() => '');
        promoCampaignService.getFilteredPromoCampaignList.mockResolvedValue({ promoCampaignDtoList: promoCampaignList });
        mount(<PromoCampaignList />);
        act(async () => {
            expect(promoCampaignService.getFilteredPromoCampaignList).toHaveBeenCalled();
        });
    });
});
