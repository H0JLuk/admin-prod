import React from 'react';
import Template from './Template';
import { shallow } from 'enzyme';

describe('<Template /> tests', () => {
    const props = {
        banners: {},
        texts: {
            HEADER: 'Test Header',
            RULES: 'Test Rules',
        },
        type: 'NORMAL',
        onRemoveImg: jest.fn(),
        isCopy: false,
    };

    it('Template snapshot', () => {
        const TemplateItem = shallow(<Template { ...props } />);
        expect(TemplateItem).toMatchSnapshot();
    });

    it('should render normal type Template', () => {
        const TemplateItem = shallow(<Template { ...props } />);
        expect(TemplateItem.find('UploadPicture')).toHaveLength(4);
        expect(TemplateItem.find('TextBlock')).toHaveLength(2);
    });

    it('should call onRemoveImg prop func', () => {
        const TemplateItem = shallow(<Template { ...props } />);
        TemplateItem.find('UploadPicture').first().prop('onRemoveImg')();
        expect(props.onRemoveImg).toBeCalled();
    });

    it('should render present type Template', () => {
        const TemplateItem = shallow(<Template { ...props } type="PRESENT" />);

        expect(TemplateItem.find('UploadPicture')).toHaveLength(3);
        expect(TemplateItem.find('TextBlock')).toHaveLength(3);
    });

    it('should not render Template', () => {
        const TemplateItem = shallow(<Template { ...props } type="ERROR" />);
        expect(TemplateItem).toHaveLength(0);
    });
});
