import React from 'react';
import { shallow, mount } from 'enzyme';
import { act } from 'react-dom/test-utils';
import Dashboard from './Dashboard';

import { clientAppListTestResponse, dzoListTestData, promoCampaignTestData } from '../../../__tests__/constants';
import { sleep } from '../../setupTests';
import * as utils from '../../utils/utils';
import * as adminService from '../../api/services/adminService';
import * as clientAppService from '../../api/services/clientAppService';
import * as dzoService from '../../api/services/dzoService';
import * as appNavigation from '../../utils/appNavigation';
import * as promoCampaignService from '../../api/services/promoCampaignService';

const dashboardInfo = [
    {
        active: true,
        clientApplicationCode: 'test',
        clientApplicationDisplayName: 'test name',
        clientApplicationId: 1,
        deleted: true,
        dzoId: 2,
        dzoName: 'string',
        expireInDays: 10,
        issuedCodePercents: 50,
        noCodes: true,
        promoCampaignId: 3,
        promoCampaignName: 'test promo-campaign'
    },
    {
        active: true,
        clientApplicationCode: 'test2',
        clientApplicationDisplayName: 'test name2',
        clientApplicationId: 2,
        deleted: true,
        dzoId: 3,
        dzoName: 'string2',
        expireInDays: 15,
        issuedCodePercents: 80,
        noCodes: true,
        promoCampaignId: 8,
        promoCampaignName: 'test promo-campaign2'
    }
];

const mockHistoryPush = jest.fn();
jest.mock('react-router-dom', () => ({
    useHistory: () => ({
        push: mockHistoryPush,
    }),
    generatePath: jest.fn()
}));

appNavigation.getPathForPromoCampaignInfo = jest.fn();

describe('<Dashboard /> test', () => {
    const container = shallow(<Dashboard />);

    beforeEach(() => {
        adminService.getDashboardInfo = jest.fn(() => dashboardInfo);
        clientAppService.getClientAppList = jest.fn(() => clientAppListTestResponse);
        dzoService.getDzoList = jest.fn(() => ({ dzoDtoList: dzoListTestData }));
    });

    it('should be mount snap', () => {
        expect(container.html()).toMatchSnapshot();
    });

    it('filterName should be "Приложение"', async () => {
        const container = mount(<Dashboard />);
        expect(container.find('p').text()).toEqual('Фильтровать');
        const dropDownContainer = shallow(container.find('Dropdown').at(1).prop('overlay'));
        await act(async () => {
            dropDownContainer.find('Menu').simulate('click', { key: '1' });
        });
        container.update();
        expect(container.find('p').text()).toEqual('Приложение');
    });

    it('filterName should be "ДЗО"', async () => {
        const container = mount(<Dashboard />);
        const dropDownContainer = shallow(container.find('Dropdown').at(1).prop('overlay'));
        await act(async () => {
            dropDownContainer.find('Menu').simulate('click', { key: '2' });
        });
        container.update();
        expect(container.find('p').at(0).text()).toEqual('ДЗО');
    });

    it('onFilterTagClick should be called with selected', () => {
        const container = shallow(<Dashboard />);
        expect(container.find('DashboardFilterList').prop('filterIdList')).toHaveLength(0);
        container.find('DashboardFilterList').simulate('click', 7, true);
        expect(container.find('DashboardFilterList').prop('filterIdList')[0]).toEqual(7);
    });

    it('onFilterTagClick should be called', () => {
        container.find('DashboardFilterList').simulate('click', 7, true);
        container.find('DashboardFilterList').simulate('click', 8, true);
        container.find('DashboardFilterList').simulate('click', 9, true);
        container.find('DashboardFilterList').simulate('click', 7, false);
        expect(container.find('DashboardFilterList').prop('filterIdList')[0]).toEqual(8);
        expect(container.find('DashboardFilterList').prop('filterIdList')).toHaveLength(2);
    });

    it('filterTagList should be correct', async () => {
        utils.requestWithMinWait = jest.fn(() => [adminService.getDashboardInfo(), clientAppService.getClientAppList(), dzoService.getDzoList()]);
        const container = mount(<Dashboard />);
        const dropDownContainer = shallow(container.find('Dropdown').at(1).prop('overlay'));
        await act(async () => {
            dropDownContainer.find('Menu').simulate('click', { key: '2' });
        });
        container.update();
        expect(container.find('DashboardFilterList').prop('list')).toEqual([
            {
                id: 0,
                displayName: 'Беру!'
            },
            {
                id: 3,
                displayName: 'Сбермаркет'
            },
            {
                id: 70,
                displayName: 'СберМобайл'
            },
        ]);
    });

    it('list should be filtered by dzo', async () => {
        utils.requestWithMinWait = jest.fn(() => [adminService.getDashboardInfo(), clientAppService.getClientAppList(), dzoService.getDzoList()]);
        const container = mount(<Dashboard />);
        const dropDownContainer = shallow(container.find('Dropdown').at(1).prop('overlay'));
        await act(async () => {
            dropDownContainer.find('Menu').simulate('click', { key: '2' });
        });
        await act(async () => {
            container.find('DashboardFilterList').prop('onClick')(2, true);
        });
        container.update();
        expect(container.find('DashboardItem')).toHaveLength(1);
        expect(container.find('DashboardItem').prop('dzoId')).toEqual(2);
    });

    it('list should be filtered by application', async () => {
        utils.requestWithMinWait = jest.fn(() => [adminService.getDashboardInfo(), clientAppService.getClientAppList(), dzoService.getDzoList()]);
        const container = mount(<Dashboard />);
        const dropDownContainer = shallow(container.find('Dropdown').at(1).prop('overlay'));
        await act(async () => {
            dropDownContainer.find('Menu').simulate('click', { key: '1' });
        });
        await act(async () => {
            container.find('DashboardFilterList').prop('onClick')(1, true);
        });
        container.update();
        expect(container.find('DashboardItem')).toHaveLength(1);
        expect(container.find('DashboardItem').prop('clientApplicationId')).toEqual(1);
    });

    it('requestWithMinWait should be called', async () => {
        utils.requestWithMinWait = jest.fn(() => [adminService.getDashboardInfo(), clientAppService.getClientAppList(), dzoService.getDzoList()]);
        await act(async () => {
            mount(<Dashboard />);
        });
        expect(utils.requestWithMinWait).toHaveBeenCalledTimes(1);
    });

    it('console.error should be called with "test error" message', async () => {
        const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => '');
        utils.requestWithMinWait = jest.fn(() => Promise.reject(new Error ('test error')));
        await act(async () => {
            mount(<Dashboard />);
        });
        expect(consoleErrorSpy).toHaveBeenCalledTimes(1);
        expect(consoleErrorSpy).toHaveBeenCalledWith('test error');
    });

    it('getPromoCampaignById should be called', async () => {
        utils.requestWithMinWait = jest.fn(() => [adminService.getDashboardInfo(), clientAppService.getClientAppList(), dzoService.getDzoList()]);
        promoCampaignService.getPromoCampaignById = jest.fn(() => ({ promoCampaignDtoList: [promoCampaignTestData] }));
        const container = mount(<Dashboard />);
        await sleep();
        container.update();
        await act(async () => {
            container.find('.item').at(0).simulate('click');
        });
        expect(promoCampaignService.getPromoCampaignById).toHaveBeenCalledTimes(1);
        expect(mockHistoryPush).toHaveBeenCalled();
    });

    it('history.push should not be called', async () => {
        utils.requestWithMinWait = jest.fn(() => [adminService.getDashboardInfo(), clientAppService.getClientAppList(), dzoService.getDzoList()]);
        promoCampaignService.getPromoCampaignById = jest.fn();
        const container = mount(<Dashboard />);
        await sleep();
        container.update();
        await act(async () => {
            container.find('.item').at(0).simulate('click');
        });
        expect(mockHistoryPush).not.toHaveBeenCalled();
    });

    it('console.error should be called, when there is an error ', async () => {
        utils.requestWithMinWait = jest.fn(() => [adminService.getDashboardInfo(), clientAppService.getClientAppList(), dzoService.getDzoList()]);
        promoCampaignService.getPromoCampaignById = jest.fn(() => Promise.reject(new Error ('test error')));
        const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => '');
        const container = mount(<Dashboard />);
        await sleep();
        container.update();
        await act(async () => {
            container.find('.item').at(0).simulate('click');
        });
        expect(consoleErrorSpy).toHaveBeenCalledTimes(1);
        expect(consoleErrorSpy).toHaveBeenCalledWith('test error');
    });
});
