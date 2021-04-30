import React from 'react';
import { shallow } from 'enzyme';
import DashboardItem from './DashboardItem';

const props = {
    handleClick: jest.fn(),
    active: false,
    clientApplicationCode: 'test',
    clientApplicationDisplayName: 'test name',
    dzoName: 'testDZO',
    expireInDays: null,
    issuedCodePercents: null,
    promoCampaignId: 1,
    promoCampaignName: 'test promo-campaign',
    noCodes: true,
};

describe('<DashboardItem /> test', () => {
    const container = shallow(<DashboardItem { ...props } />);

    it('should be render snap(noCodes: true)', () => {
        expect(container.html()).toMatchSnapshot();
    });

    it('should be render snap(noCodes: false)', () => {
        const container = shallow(<DashboardItem { ...{ ...props, noCodes: false } } />);
        expect(container.html()).toMatchSnapshot();
    });

    it('should be render snap(expireInDays !== null)', () => {
        const container = shallow(<DashboardItem { ...{ ...props, expireInDays: 15 } } />);
        expect(container.html()).toMatchSnapshot();
    });

    it('should be render snap(issuedCodePercents !== null)', () => {
        const container = shallow(<DashboardItem { ...{ ...props, issuedCodePercents: 70 } } />);
        expect(container.html()).toMatchSnapshot();
    });

    it('promo-campaign activity should be "Активная"', () => {
        const container = shallow(<DashboardItem { ...{ ...props, active: true } } />);
        expect(container.find('div').at(4).text()).toEqual('Активная');
    });

    it('handleClick should be called', () => {
        const container = shallow(<DashboardItem { ...props } />);
        container.find('.item').simulate('click');
        expect(props.handleClick).toHaveBeenCalledTimes(1);
        expect(props.handleClick).toHaveBeenCalledWith(props.clientApplicationCode, props.promoCampaignId);
    });
});
