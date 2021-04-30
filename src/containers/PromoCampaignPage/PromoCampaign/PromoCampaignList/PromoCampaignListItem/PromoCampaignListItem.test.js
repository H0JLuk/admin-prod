import React from 'react';
import { shallow } from 'enzyme';
import PromoCampaignItem from './PromoCampaignListItem';
import { promoCampaignTestData } from '../../../../../../__tests__/constants';


const mockHistoryPush = jest.fn();
jest.mock('react-router-dom', () => ({
    useHistory: () => ({
        push: mockHistoryPush,
    }),
    generatePath: () => ({ path: 'test' }),
}));

describe('<PromoCampaignItem /> test', () => {
    const initialProps = {
        promoCampaign: { ...promoCampaignTestData },
        onDeleteItem: jest.fn(),
        sortable: false,
        matchUrl: 'url',
    };

    const container = shallow(<PromoCampaignItem { ...initialProps } />);

    it('should match snapshot', () => {
        expect(container.html()).toMatchSnapshot();
    });

    it('onCardClick should be called', () => {
        container.find('.cardInfo').simulate('click');
        expect(mockHistoryPush).toHaveBeenCalledTimes(1);
    });

    it('status promo-campaign should be "Активная"', () => {
        expect(container.find('.status').at(1).text()).toEqual('Активная');
    });

    it('status promo-campaign should be "Неактивная"', () => {
        container.setProps({ promoCampaign: { ...initialProps.promoCampaign, active: false } });
        expect(container.find('.status').at(1).text()).toEqual('Неактивная');
    });

    it('should displayed PromoCampaignItemMenu', () => {
        expect(container.find('.cardMenu').text()).toMatch('PromoCampaignItemMenu');
    });

    it('should displayed sortableIcon', () => {
        container.setProps({ sortable: true });
        expect(container.find('.cardMenu').html()).toMatch('sortableIcon');
    });
});
