import React from 'react';
import { shallow, mount } from 'enzyme';
import { act } from 'react-dom/test-utils';
import PromoCodeStatisticModal, { promoCodeTypes } from './PromoCodeStatisticModal';
import * as promoCampaignService from '../../../../../../../api/services/promoCampaignService';

describe('<PromoCodeStatisticModal /> test', () => {
    const initialProps = {
        onClose: jest.fn(),
        open: true,
        id: '1',
        promoCodeType: 'PERSONAL',
    };

    const container = shallow(<PromoCodeStatisticModal { ...initialProps } />);

    it('onClose should be called upon confirmation', () => {
        container.find('Modal').prop('onOk')();
        expect(initialProps.onClose).toHaveBeenCalledTimes(1);
    });

    it('onClose should be called when canceling', () => {
        container.find('Modal').prop('onCancel')();
        expect(initialProps.onClose).toHaveBeenCalledTimes(1);
    });

    it('description should be correct', () => {
        const description = container.find('Title').children().text();
        expect(description).toEqual(promoCodeTypes.PERSONAL);
    });

    it('should call `getPromoCampaignStatistics` function', async () => {
        promoCampaignService.getPromoCampaignStatistics = jest.fn()
            .mockResolvedValue({
                promoCampaignStatisticsDto: {
                    campaignId: 1,
                    issuedPromoCodesNumber: 2,
                    totalPromoCodesNumber: 3
                }
            });
        mount(<PromoCodeStatisticModal { ...initialProps } />);
        await act(async () => {
            expect(promoCampaignService.getPromoCampaignStatistics).toHaveBeenCalledTimes(1);
        });
    });

    it('if the modal is closed, getPromoCampaignStatistic should not be called', async () => {
        promoCampaignService.getPromoCampaignStatistics = jest.fn()
            .mockResolvedValue({
                promoCampaignStatisticsDto: {
                    campaignId: 1,
                    issuedPromoCodesNumber: 2,
                    totalPromoCodesNumber: 3
                }
            });
        mount(<PromoCodeStatisticModal { ...{ ...initialProps, open: false } } />);
        await act(async () => {
            expect(promoCampaignService.getPromoCampaignStatistics).not.toHaveBeenCalled();
        });
    });
});
