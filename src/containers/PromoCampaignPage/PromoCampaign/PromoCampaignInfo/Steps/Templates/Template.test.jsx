import React from 'react';
import Template from './Template';
import { shallow } from 'enzyme';
import {
    getTextsReturnValue,
    promoCampaignBannerArray,
    promoCampaignTextsArray,
} from '../../../../../../../__tests__/constants';

describe('<Template /> test', () => {
    const props = {
        banners: promoCampaignBannerArray,
        texts: promoCampaignTextsArray,
        type: 'NORMAL' // 'NORMAL' || 'PRESENT'
    };

    it('Template snapshot', () => {
        const TemplateItem = shallow(<Template { ...props } />);
        expect(TemplateItem.first().html()).toMatchSnapshot();
    });

    it('should render ImageBlock and TextBlock', () => {
        const TemplateItem = shallow(<Template { ...props } />);

        expect(TemplateItem.find('ImageBlock').first()).toHaveLength(1);
        expect(TemplateItem.find('TextBlock').first()).toHaveLength(1);
    });

    it('should not render Template', () => {
        const newProps = {
            ...props,
            type: 'errorType'
        };

        const TemplateItem = shallow(<Template { ...newProps } />);
        expect(TemplateItem).toHaveLength(0);
    });

    it('should return only result in getTexts func', () => {
        const newProps = {
            ...props,
            texts: getTextsReturnValue
        };

        const TemplateItem = shallow(<Template { ...newProps } />);
        expect(TemplateItem.find('TextBlock').first()).toHaveLength(1);
    });
});
