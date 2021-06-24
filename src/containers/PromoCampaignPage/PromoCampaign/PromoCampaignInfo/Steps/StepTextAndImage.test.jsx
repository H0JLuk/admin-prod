import React from 'react';
import StepTextAndImage from './StepTextAndImage';
import { shallow } from 'enzyme';
import { promoCampaignBannerArray, promoCampaignTextsArray } from '../../../../../../__tests__/constants';

describe('<StepTextAndImage /> test', () => {
    const props = {
        banners: promoCampaignBannerArray,
        texts: promoCampaignTextsArray,
        type: 'NORMAL',
    };
    const StepTextAndImageItem = shallow(<StepTextAndImage { ...props } />);

    it('StepTextAndImage snapshot', () => {
        expect(StepTextAndImageItem.html).toMatchSnapshot();
    });

    it('normal type test', () => {
        expect(StepTextAndImageItem.find('.title').text()).toEqual('Экскурсия');
        expect(StepTextAndImageItem.find('Template').prop('type')).toEqual(props.type);
    });

    it('present type test', () => {
        const newProps = {
            ...props,
            type: 'PRESENT',
        };
        StepTextAndImageItem.setProps(newProps);
        expect(StepTextAndImageItem.find('.title').text()).toEqual('Подарок');
        expect(StepTextAndImageItem.find('Template').prop('type')).toEqual(newProps.type);
    });
});

