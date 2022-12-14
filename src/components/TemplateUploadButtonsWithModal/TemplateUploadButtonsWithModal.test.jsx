import React from 'react';
import { mount } from 'enzyme';
import TemplateUploadButtonsWithModal from './TemplateUploadButtonsWithModal';
import { sleep } from '../../setupTests';
import { getActiveClientApps, getDefaultAppCode } from '../../api/services/clientAppService';
import { addUsersWithTemplate } from '../../api/services/usersService';
import { Button, Form, message, Modal, Upload } from 'antd';
import { act } from 'react-dom/test-utils';

jest.mock('../../utils/helper', () => ({
    downloadFileFunc: jest.fn(),
}));

jest.mock('../../api/services/usersService', () => ({
    addUsersWithTemplate: jest.fn(),
    deleteUsersWithTemplate: jest.fn(),
}));

jest.mock('../../api/services/clientAppService', () => ({
    getActiveClientApps: jest.fn(),
    getDefaultAppCode: jest.fn(),
}));

const TEST_PROPS = {
    onSuccess: jest.fn(),
};

const TEST_APP_LIST = [
    {
        code: 'mobile-sales-manager',
        displayName: 'Витрина мобильного менеджера продаж',
        id: 10,
        isDeleted: false,
        name: 'Витрина ММП',
        orderNumber: 0,
    },
    {
        code: 'greenday-presents',
        displayName: 'Витрина ВСП',
        id: 7,
        isDeleted: false,
        name: 'Витрина экосистемы с подарками',
        orderNumber: 1,
    },
];

const TEST_FILE_CSV = 'TEST_NAME.csv';

const TEST_INFO = {
    file: {
        name: TEST_FILE_CSV,
        status: 'TEST_STATUS',
    },
};

describe('<TemplateUploadButtonsWithModal /> test', () => {
    global.URL.createObjectURL = jest.fn();
    const Component = mount(<TemplateUploadButtonsWithModal { ...TEST_PROPS } />);
    const Buttons = Component.find('Button');

    beforeEach(() => {
        getActiveClientApps.mockResolvedValue(TEST_APP_LIST);
    });

    it('should be mount snap', () => {
        expect(Component.html()).toMatchSnapshot();
    });

    it('should call show and close modal', async () => {
        await act(async () => {
            Buttons.first().simulate('click');
        });
        Component.update();

        expect(getActiveClientApps).toBeCalledTimes(1);
        const ModalTemplate = Component.find(Modal);
        expect(ModalTemplate.prop('visible')).toBe(true);

        expect(1).toBe(1);
        await act(async () => {
            ModalTemplate.find(Button).at(1).simulate('click');
        });
        Component.update();

        expect(Component.find(Modal).prop('visible')).toBe(false);
    });

    it('should call show and upload file', async () => {
        getDefaultAppCode.mockResolvedValue({ headers: { clientAppCode: TEST_APP_LIST[0].code } });
        addUsersWithTemplate.mockResolvedValue(new Blob(['test'], { type: 'text/csv;charset=utf-8;' }));
        await act(async () => {
            Buttons.first().simulate('click');
        });
        const file = new File(['example text'], TEST_FILE_CSV, { type: 'text/csv;charset=utf-8;' });
        Component.find(Modal).find(Form).props().form.setFieldsValue({ appCode: TEST_APP_LIST[0].code, file });
        Component.find(Modal).find(Button).at(2).simulate('click');
        await sleep();
        expect(TEST_PROPS.onSuccess).toBeCalledTimes(1);
    });

    it('should call show and upload file with catch', async () => {
        getDefaultAppCode.mockResolvedValue({ headers: { clientAppCode: TEST_APP_LIST[0].code } });
        addUsersWithTemplate.mockRejectedValue(new Error('Error'));
        message.error = jest.fn();
        await act(async () => {
            Buttons.first().simulate('click');
        });
        const ModalTemplate = Component.find(Modal);
        const file = new File(['example text'], TEST_FILE_CSV, { type: 'text/csv;charset=utf-8;' });
        ModalTemplate.find(Form).props().form.setFieldsValue({ appCode: TEST_APP_LIST[0].code, file });
        ModalTemplate.find(Button).at(2).simulate('click');
        await sleep();
        expect(message.error).toBeCalledTimes(1);
    });

    it('should call normFile function', async () => {
        act(() => {
            Buttons.first().simulate('click');
        });

        const ModalTemplate = Component.find(Modal);

        act(() => {
            expect(
                ModalTemplate.find(Form.Item).at(0).props().getValueFromEvent(TEST_INFO)['name']
            ).toEqual(TEST_FILE_CSV);
        });
    });

    it('should call normFile function with status removed', async () => {
        await act(async () => {
            Buttons.first().simulate('click');
        });
        const ModalTemplate = Component.find(Modal);
        expect(
            ModalTemplate.find(Form.Item).at(0).props().getValueFromEvent({ ...TEST_INFO, file: { ...TEST_INFO.file, status: 'removed' } })
        ).toEqual(undefined);
    });

    it('should call onChangeFile and onRemoveFile functions', async () => {
        Buttons.at(0).simulate('click');
        await sleep();
        const ModalTemplate = Component.find(Modal);

        act(() => {
            expect(ModalTemplate.find(Upload).props().beforeUpload()).toEqual(false);
            expect(ModalTemplate.find(Upload).props().onRemove()).toEqual(undefined);
        });
    });

});
