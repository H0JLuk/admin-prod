import React from 'react';
import { shallow } from 'enzyme';
import { message } from 'antd';
import PromoCampaignItemMenu from './PromoCampaignItemMenu';

import * as utils from '../../../../../../utils/utils';
import * as promoCampaignService from '../../../../../../api/services/promoCampaignService';
import * as promoCampaignUtils from '../../../../PromoCampaignUtils';

promoCampaignService.uploadPromoCodes = jest.fn();
utils.confirmModal = jest.fn();
promoCampaignUtils.onConfirmDeletePromoCampaign = jest.fn();

describe('<PromoCampaignItemMenu /> test', () => {
    const initialProps = {
        onDeleteItem: jest.fn(),
        promoCampaign: {
            id: 1,
            name: 'promoCampaign',
            promoCodeType: 'PERSONAL',
        },
        matchUrl: 'url',
    };

    const container = shallow(<PromoCampaignItemMenu { ...initialProps } />);

    it('should match snapshot', () => {
        expect(container.html()).toMatchSnapshot();
    });

    it('confirmModal should be called', () => {
        const dropDownContainer = shallow(container.find('Dropdown').prop('overlay'));
        dropDownContainer.find('div').at(3).simulate('click');
        expect(utils.confirmModal).toBeCalledTimes(1);
    });

    it('dropdown should be displayed', () => {
        container.find('Dropdown').simulate('visibleChange', true);
        expect(container.find('Dropdown').prop('visible')).toBe(true);
    });

    it('dropdown should not be displayed', () => {
        const dropDownContainer = shallow(container.find('Dropdown').prop('overlay'));
        dropDownContainer.find('Menu').simulate('click');
        expect(container.find('Dropdown').prop('visible')).toBe(false);
    });

    it('modal statistic should be displayed', () => {
        container.find('Dropdown').prop('overlay').props.onShowStatistic();
        expect(container.find('PromoCodeStatisticModal').prop('open')).toBe(true);
    });

    it('modal statistic should not be displayed', () => {
        container.find('PromoCodeStatisticModal').prop('onClose')();
        expect(container.find('PromoCodeStatisticModal').prop('open')).toBe(false);
    });

    it('promo codes modal should be displayed', () => {
        container.find('Dropdown').prop('overlay').props.onPromoCodeUpload();
        expect(container.find('UploadPromoCodesModal').prop('open')).toBe(true);
    });

    it('promo codes modal should n`t be displayed', () => {
        container.find('UploadPromoCodesModal').prop('onClose')();
        expect(container.find('UploadPromoCodesModal').prop('open')).toBe(false);
    });

    it('uploadPromoCodes should be called is in a state fulfilled', () => {
        promoCampaignService.uploadPromoCodes.mockResolvedValue();
        container.find('UploadPromoCodesModal').prop('onSave')();
        expect(promoCampaignService.uploadPromoCodes).toHaveBeenCalledTimes(1);
    });

    it('should call confirmModal on deleting', async () => {
        const { promoCampaign } = initialProps;
        container.find('Dropdown').prop('overlay').props.onDelete();

        expect(utils.confirmModal).toHaveBeenCalledTimes(1);

        await utils.confirmModal.mock.calls[0][0].onOk();

        expect(promoCampaignUtils.onConfirmDeletePromoCampaign).toHaveBeenCalledTimes(1);
        expect(promoCampaignUtils.onConfirmDeletePromoCampaign).toHaveBeenCalledWith(
            promoCampaign.id,
            promoCampaign.name
        );
        expect(initialProps.onDeleteItem).toHaveBeenCalledTimes(1);
    });

    it('console.warn should be called when onConfirmDeletePromoCampaign rejected', async () => {
        const spy = jest.spyOn(console, 'warn').mockImplementation(() => '');
        promoCampaignUtils.onConfirmDeletePromoCampaign.mockImplementation(() => Promise.reject('test error'));
        container.find('Dropdown').prop('overlay').props.onDelete();
        await utils.confirmModal.mock.calls[0][0].onOk();
        expect(spy).toHaveBeenCalledTimes(1);
        expect(spy).toHaveBeenCalledWith('test error');
    });

    it('errorNotice should be called when promoCodeUpload rejected', async () => {
        promoCampaignService.uploadPromoCodes.mockImplementation(() => Promise.reject(new Error ('test error')));
        message.error = jest.fn();
        await container.find('UploadPromoCodesModal').prop('onSave')();
        expect(message.error).toHaveBeenCalledWith('test error');
    });
});
