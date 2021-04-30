import React from 'react';
import ImagesBlock from './ImagesBlock';
import { UploadOutlined } from '@ant-design/icons';
import { shallow } from 'enzyme';

describe('<ImagesBlock /> tests', () => {

    const props = {
        textButton: 'Добавить',
        base64URL: 'some base64 url',
        imgURL: null,
        originFileObj: undefined,
        iconButton: <UploadOutlined />,
        setting: '770px x 368px, 2МБ .jpg,.jpeg,.png',
        description: 'Добавить баннер',
        footer: false,
        type: 'banner'
    };

    it('ImagesBlock snapshot', () => {
        const ImagesBlockItem = shallow(<ImagesBlock { ...props } />);
        expect(ImagesBlockItem.html()).toMatchSnapshot();
    });

    it('should render noFile', () => {
        const ImagesBlockItem = shallow(<ImagesBlock { ...props } />);
        expect(ImagesBlockItem.find('.noFile')).toHaveLength(1);
    });

    it('should render image preview and footer', () => {
        const newProps = {
            ...props,
            footer: true,
            originFileObj: {}
        };

        const ImagesBlockItem = shallow(<ImagesBlock { ...newProps } />);
        expect(ImagesBlockItem.find('.imgPreviewWrap')).toHaveLength(1);
        expect(ImagesBlockItem.find('.footer')).toHaveLength(1);
    });

    it('should call getFileName func', () => {
        const newProps = {
            ...props,
            footer: true,
            originFileObj: {},
            imgURL: 'some img url'
        };

        const ImagesBlockItem = shallow(<ImagesBlock { ...newProps } />);
        expect(ImagesBlockItem.find('.footer')).toHaveLength(1);
    });
});
