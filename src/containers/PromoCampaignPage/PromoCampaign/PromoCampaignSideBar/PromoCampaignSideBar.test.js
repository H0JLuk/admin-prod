import React from 'react';
import { shallow, mount } from 'enzyme';
import PromoCampaignSideBar from './PromoCampaignSideBar';

describe('<PromoCampaignSideBar /> test', () => {
    const initialProps = {
        active: 1,
        onClick: jest.fn(),
        validStep: 2,
        newPromoCampaign: true,
        hideLastStep: false,
    };

    it('should match the snapshot', () => {
        const container = shallow(<PromoCampaignSideBar { ...initialProps } />);
        expect(container.html()).toMatchSnapshot();
    });

    it('if promo campaign is new, currentSteps length should be 3', () => {
        const container = shallow(<PromoCampaignSideBar { ...initialProps } />);
        expect(container.find('MenuItem')).toHaveLength(3);
    });

    it('if promo campaign is not new, currentSteps length should be 3', () => {
        const container = shallow(<PromoCampaignSideBar { ...{ ...initialProps, newPromoCampaign: false } } />);
        expect(container.find('MenuItem')).toHaveLength(3);
    });

    it('if promo campaign is not new and the last step is hidden, currentSteps length should be 2', () => {
        const container = shallow(<PromoCampaignSideBar { ...{ ...initialProps, newPromoCampaign: false, hideLastStep: true } } />);
        expect(container.find('MenuItem')).toHaveLength(2);
    });

    it('callback should be called', () => {
        const container = mount(<PromoCampaignSideBar { ...initialProps } />);
        container.find('MenuItem').find('div').at(0).simulate('click');
        expect(initialProps.onClick).toBeCalledTimes(1);
        expect(initialProps.onClick).toBeCalledWith(1);
    });

    it('callback should not be called', () => {
        const container = mount(<PromoCampaignSideBar { ...initialProps } />);
        container.find('MenuItem').find('div').at(2).simulate('click');
        expect(initialProps.onClick).not.toBeCalled();
    });
});
