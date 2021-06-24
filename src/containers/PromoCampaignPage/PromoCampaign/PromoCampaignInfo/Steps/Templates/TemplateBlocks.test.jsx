import React from 'react';
import { ImageBlock, TextBlock } from './TemplateBlocks';
import { shallow } from 'enzyme';

describe('<TemplateBlocks /> test', () => {
    describe('<ImageBlock /> test', () => {
        const props = {
            label: 'label',
            type: 'banner',
            src: 'src',
            size: 'size',
        };
        const ImageBlockItem = shallow(<ImageBlock { ...props } />);

        it('ImageBlock snapshot', () => {
            expect(ImageBlockItem.html()).toMatchSnapshot();
        });

        it('check banner type', () => {
            expect(ImageBlockItem.find('.banner').hasClass('banner')).toEqual(true);
        });

        it('check logo type', () => {
            const newProps = {
                ...props,
                type: 'logo',
            };
            ImageBlockItem.setProps(newProps);
            expect(ImageBlockItem.find('.logo').hasClass('logo')).toEqual(true);
            expect(ImageBlockItem.find('.imageLogo').hasClass('imageLogo')).toEqual(true);
        });
    });

    describe('<TextBlock /> test', () => {
        const props = {
            label: 'label',
            text: 'text',
        };
        const TextBlockItem = shallow(<TextBlock { ...props } />);

        it('TextBlock snapshot', () => {
            expect(TextBlockItem.html()).toMatchSnapshot();
        });

        it('should render text and label', () => {
            expect(TextBlockItem.find('.title').text()).toBe(props.label);
            expect(TextBlockItem.find('.text').text()).toBe(props.text);
        });
    });
});
