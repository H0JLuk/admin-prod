import { shallow } from 'enzyme';
import React from 'react';
import StepTextAndImage from './StepTextAndImage';

describe('<StepTextAndImage /> tests', () => {
    const props = {
        typePromoCampaign: 'NORMAL',
        addChangedImg: jest.fn(),
        banners: {},
        texts: {},
        setFields: jest.fn(),
        isCopy: false,
    };
    const wrapper = shallow(<StepTextAndImage { ...props } />);

    it('StepTextAndImage snapshot', () => {
        expect(wrapper.debug()).toMatchSnapshot();
    });

    it('should render StepTextAndImage', () => {
        expect(wrapper.find('.containerStep')).toHaveLength(1);
    });

    it('should render normal type title', () => {
        expect(wrapper.find('.title').text()).toEqual('Экскурсия');
    });

    it('should call setFields and addChangedImg prop funcs', () => {
        wrapper.find('Template').simulate('removeImg', [ 'banners', 'card ']);
        expect(props.addChangedImg).toBeCalled();
        expect(props.setFields).toBeCalled();
    });

    it('should render present type title', () => {
        wrapper.setProps({ typePromoCampaign: 'PRESENT' });
        expect(wrapper.find('.title').text()).toEqual('Подарки');
    });

    it('should render landing type title', () => {
        wrapper.setProps({ typePromoCampaign: 'LANDING' });
        expect(wrapper.find('.title').text()).toEqual('Лендинг');
    });
});


