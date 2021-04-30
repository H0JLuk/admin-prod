import React from 'react';
import { mount, shallow } from 'enzyme';

import UploadPromoCodesModal from './UploadPromoCodesModal';

import * as notice from '../../../../../../../components/toast/Notice';

notice.warnNotice = jest.fn();

describe('<UploadPromoCodesModal /> test', () => {
    const initialProps = {
        onSave: jest.fn(),
        onClose: jest.fn(),
        open: true,
    };

    const event = {
        preventDefault: jest.fn(),
    };
    const info = {
        file: new File(['test'], 'test.csv', {
            type: 'csv',
        }),
        fileList: [{ name: 'Новый текстовый документ.csv' }],
    };

    const container = shallow(<UploadPromoCodesModal { ...initialProps } />);

    it('handleClose should be called when canceling', () => {
        container.find('Modal').simulate('cancel');
        expect(initialProps.onClose).toHaveBeenCalledTimes(1);
    });

    it('if file is missing warnNotice should be called with "Выберите файл для загрузки!"', () => {
        const event = {
            preventDefault: jest.fn(),
        };
        container.find('Modal').simulate('ok', event);
        expect(notice.warnNotice).toHaveBeenCalledWith('Выберите файл для загрузки!');
        expect(event.preventDefault).toHaveBeenCalledTimes(1);
    });

    it('when UploadPromoCodesModal unmount, onClose should be called', () => {
        const container = mount(<UploadPromoCodesModal { ...initialProps } />);
        container.unmount();
        expect(initialProps.onClose).toHaveBeenCalledTimes(1);
    });

    it('onSave should be called, when adding file', () => {
        container.find('Dragger').simulate('change', info);
        container.find('Dragger').prop('beforeUpload')(info.file);
        container.find('Modal').simulate('ok', event);
        expect(initialProps.onSave).toHaveBeenCalledTimes(1);
    });

    it('fileList should be added and removed', () => {
        container.find('Dragger').simulate('change', info);
        expect(container.find('Dragger').prop('fileList')).toEqual(info.fileList);
        container.find('Dragger').simulate('remove', info.file);
        expect(container.find('Dragger').prop('fileList')).toEqual([]);
    });

    it('if file is missing warnNotice should be called with "Можно загрузить только один файл за раз!"', () => {
        container.find('Dragger').simulate('change', {
            ...info,
            fileList: [...info.fileList, ...info.fileList],
        });
        container.find('Modal').simulate('ok', event);
        expect(container.find('Dragger').prop('fileList')).toHaveLength(1);
    });
});
