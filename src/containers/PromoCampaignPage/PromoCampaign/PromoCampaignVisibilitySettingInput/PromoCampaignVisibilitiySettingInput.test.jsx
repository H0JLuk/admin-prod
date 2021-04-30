import React from 'react';
import PromoCampaignVisibilitySettingInput from './PromoCampaignVisibilitySettingInput';
import { shallow } from 'enzyme';

describe('<PromoCampaignVisibilitySettingInput /> tests', () => {
    const props = {
        error: {
            location: '',
            salePoint: '',
            server: '',
        },
        onLocationChange: jest.fn(),
        onSalePointChange: jest.fn(),
        visibility: true,
        onVisibilityChange: jest.fn(),
        location: {
            id: 2046,
            name: 'Ростов',
            description: null,
            startDate: '2020-11-01',
            endDate: null,
            deleted: false,
            type: {
                id: 11,
                name: 'Город',
                description: null,
                startDate: '2020-01-01',
                endDate: null,
                priority: 6,
                deleted: false
            },
            parentName: 'Ярославская область'
        },
        salePoint: '',
        columnMode: true,
    };

    it('PromoCampaignVisibilitySettingInput snapshot', () => {
        const VisibilityInput = shallow(<PromoCampaignVisibilitySettingInput { ...props } />);
        expect(VisibilityInput.html()).toMatchSnapshot();
    });

    it('should render error server status', () => {
        const newProps = {
            ...props,
            error: {
                server: 'test'
            }
        };

        const VisibilityInput = shallow(<PromoCampaignVisibilitySettingInput { ...newProps } />);
        expect(VisibilityInput.find('.error').text()).toEqual(newProps.error.server);
    });

    it('should render visibility label', () => {
        const VisibilityInput = shallow(<PromoCampaignVisibilitySettingInput { ...props } />);
        expect(VisibilityInput.find('.label').text()).toEqual('Включить видимость');
    });

    it('should change visibility', () => {
        const VisibilityInput = shallow(<PromoCampaignVisibilitySettingInput { ...props } />);
        VisibilityInput.setProps({ ...props, visibility: false });
        expect(VisibilityInput.find('Switch').prop('checked')).toEqual(!props.visibility);
    });
});
