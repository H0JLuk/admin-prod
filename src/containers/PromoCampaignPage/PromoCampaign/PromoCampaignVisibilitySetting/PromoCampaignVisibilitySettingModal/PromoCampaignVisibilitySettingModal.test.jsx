import { shallow } from 'enzyme';
import React from 'react';
import { visibilitySettingLocation as location, visibilitySettingSalePoint as salePoint } from '../../../../../../__tests__/constants';
import { addVisibilitySetting } from '../../../../../api/services/promoCampaignService';
import PromoCampaignVisibilitySettingModal from './PromoCampaignVisibilitySettingModal';

jest.mock('../../../../../api/services/promoCampaignService', () => ({
    addVisibilitySetting: jest.fn()
}));

describe('<PromoCampaignVisibilitySettingModal /> tests', () => {
    const props = {
        promoCampaignId: 11,
        closeModal: jest.fn(),
        forceUpdate: jest.fn(),
        isModalVisible: true,
    };

    it('PromoCampaignVisibilitySettingModal snapshot', () => {
        const newProps = { ...props, isModalVisible: false };
        const VisibilityModal = shallow(<PromoCampaignVisibilitySettingModal { ...newProps } />);
        expect(VisibilityModal.html()).toMatchSnapshot();
    });

    it('should open modal, add company and close modal', async () => {
        addVisibilitySetting.mockResolvedValue();
        const VisibilityModal = shallow(<PromoCampaignVisibilitySettingModal { ...props } />);
        VisibilityModal.find('PromoCampaignVisibilitySettingInput').prop('onLocationChange')(location);
        VisibilityModal.find('PromoCampaignVisibilitySettingInput').prop('onSalePointChange')(salePoint);
        await VisibilityModal.find('Modal').prop('onOk')();

        VisibilityModal.setProps({ ...props, isModalVisible: false });

        expect(VisibilityModal.find('Modal').prop('visible')).toEqual(!props.isModalVisible);
        expect(props.closeModal).toBeCalled();
        expect(props.forceUpdate).toBeCalled();
    });

    it('should catch in onFinish func', async () => {
        addVisibilitySetting.mockRejectedValue({ message: 'catch test' });
        const VisibilityModal = shallow(<PromoCampaignVisibilitySettingModal { ...props } />);
        VisibilityModal.find('PromoCampaignVisibilitySettingInput').prop('onLocationChange')(location);
        VisibilityModal.find('PromoCampaignVisibilitySettingInput').prop('onSalePointChange')(salePoint);
        await VisibilityModal.find('Modal').prop('onOk')();
        VisibilityModal.setProps({ ...props, isModalVisible: false });

        expect(
            VisibilityModal.find('PromoCampaignVisibilitySettingInput').prop('error').server
        ).toEqual('catch test');
    });

    it('should cancel modal', () => {
        const VisibilityModal = shallow(<PromoCampaignVisibilitySettingModal { ...props } />);
        VisibilityModal.find('Modal').prop('onCancel')();

        expect(props.closeModal).toBeCalled();
    });

    it('should show location warning', async () => {
        const VisibilityModal = shallow(<PromoCampaignVisibilitySettingModal { ...props } />);
        VisibilityModal.find('PromoCampaignVisibilitySettingInput').prop('onLocationChange')(false);
        await VisibilityModal.find('Modal').prop('onOk')();

        expect(
            VisibilityModal.find('PromoCampaignVisibilitySettingInput').prop('error').location
        ).toEqual('Укажите локацию');
    });

    it('should add promo campaign without salePoint', async () => {
        const VisibilityModal = shallow(<PromoCampaignVisibilitySettingModal { ...props } />);
        VisibilityModal.find('PromoCampaignVisibilitySettingInput').prop('onLocationChange')(location);
        await VisibilityModal.find('Modal').prop('onOk')();
        expect(props.closeModal).toBeCalled();
        expect(props.forceUpdate).toBeCalled();
    });
});

