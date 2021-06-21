import React from 'react';
import StepInfo from './StepInfo';
import { mount } from 'enzyme';
import * as clientAppService from '../../../../../api/services/clientAppService';
import { clientAppTestData, promoCampaignTestData } from '../../../../../../__tests__/constants';
import { sleep } from '../../../../../setupTests';

const NO_CATEGORY_LABEL = 'Нет выбранных категорий';
const EMPTY_URL_PROMO_CAMPAIGN = 'Нет ссылки';

describe('<StepInfo/> test', () => {
    const props = {
        promoCampaign: promoCampaignTestData,
    };

    beforeEach(() => {
        clientAppService.getClientAppInfo = jest.fn().mockResolvedValue(clientAppTestData);
    });

    it('should match to snapshot', async () => {
        const wrapper = mount(<StepInfo { ...props } />);
        await sleep();

        expect(wrapper.debug()).toMatchSnapshot();
    });

    it('should call `getClientAppInfo` function', async () => {
        mount(<StepInfo { ...props } />);
        await sleep();
        expect(clientAppService.getClientAppInfo).toHaveBeenCalledTimes(1);
    });

    it('should render label if category list is empty', async () => {
        const props = {
            promoCampaign: {
                ...promoCampaignTestData,
                categoryList: [],
            },
        };
        const wrapper = mount(<StepInfo { ...props } />);
        await sleep();
        const label = wrapper.find('.infoText').first().text();
        expect(label).toBe(NO_CATEGORY_LABEL);
    });

    it('should render label if no webUrl', async () => {
        const props = {
            promoCampaign: {
                ...promoCampaignTestData,
                webUrl: undefined,
            },
        };
        const wrapper = mount(<StepInfo { ...props } />);
        await sleep();
        const label = wrapper.find({ children: EMPTY_URL_PROMO_CAMPAIGN }).first().text();
        expect(label).toBe(EMPTY_URL_PROMO_CAMPAIGN);
    });
});
