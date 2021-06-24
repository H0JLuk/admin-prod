import React from 'react';
import { shallow } from 'enzyme';
import PromoCampaignVisibilitySettingForm from './PromoCampaignVisibilitySettingForm';
import { visibilitySettingLocation as location, salePointTest as salePoint } from '../../../../../../__tests__/constants';
import { addVisibilitySetting } from '../../../../../api/services/promoCampaignService';
import { act } from '@testing-library/react';


jest.mock('../../../../../api/services/promoCampaignService', () => ({
    addVisibilitySetting: jest.fn(),
}));

describe('<PromoCampaignVisibilitySettingForm /> tests', () => {
    const props = {
        onCancel: jest.fn(),
        onSubmit: jest.fn(),
        match: { params: { promoCampaignId: 11 } },
    };

    it('PromoCampaignVisibilitySettingForm snapshot', () => {
        const VisibilityForm = shallow(<PromoCampaignVisibilitySettingForm { ...props } />);
        expect(VisibilityForm.html()).toMatchSnapshot();
    });

    it('should add new visibility setting', async () => {
        const VisibilityForm = shallow(<PromoCampaignVisibilitySettingForm { ...props } />);
        VisibilityForm.find('PromoCampaignVisibilitySettingInput').first().prop('onLocationChange')(location);
        VisibilityForm.find('PromoCampaignVisibilitySettingInput').first().prop('onSalePointChange')(salePoint);

        await act(async () => {
            VisibilityForm.find('Button').last().prop('onClick')();
        });

        expect(props.onSubmit).toBeCalledWith({ location, salePoint, visibility: true });
    });

    it('should catch in onFinish func', async () => {
        addVisibilitySetting.mockRejectedValue({ message: 'catch test' });
        const VisibilityForm = shallow(<PromoCampaignVisibilitySettingForm { ...props } />);
        VisibilityForm.find('PromoCampaignVisibilitySettingInput').prop('onLocationChange')(location);
        VisibilityForm.find('PromoCampaignVisibilitySettingInput').prop('onSalePointChange')(salePoint);

        await act(async () => {
            VisibilityForm.find('Button').last().prop('onClick')();
        });

        expect(
            VisibilityForm.find('PromoCampaignVisibilitySettingInput').prop('error').server
        ).toEqual('catch test');
    });

    it('should close form', () => {
        const VisibilityForm = shallow(<PromoCampaignVisibilitySettingForm { ...props } />);
        VisibilityForm.find('Button').first().simulate('click');
        expect(props.onCancel).toBeCalled();
    });

    it('should show location error', async () => {
        const VisibilityForm = shallow(<PromoCampaignVisibilitySettingForm { ...props } />);
        VisibilityForm.find('PromoCampaignVisibilitySettingInput').prop('onLocationChange')(false);
        await act(async () => {
            VisibilityForm.find('Button').last().prop('onClick')();
        });

        expect(
            VisibilityForm.find('PromoCampaignVisibilitySettingInput').prop('error').location
        ).toEqual('Укажите локацию');
    });
});
