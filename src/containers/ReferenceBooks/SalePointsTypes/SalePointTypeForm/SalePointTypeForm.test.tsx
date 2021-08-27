import React from 'react';
import { Location } from 'history';
import { message, Form } from 'antd';
import { shallow, mount } from 'enzyme';
import { act } from 'react-dom/test-utils';
import { match, useLocation } from 'react-router-dom';

import { sleep } from '@setupTests';
import SalePointTypeForm from './SalePointTypeForm';
import {
    getSalePointTypeById,
    addSalePointType,
    editSalePointType,
    deleteSalePointType,
} from '@apiServices/salePointService';

import * as utils from '@utils/utils';

(utils.confirmModal as jest.Mock) = jest.fn();
(message.error as jest.Mock) = jest.fn();

jest.mock('react-router-dom', () => ({
    useLocation: jest.fn(),
    useParams: () => ({ salePointTypeId: '0' }),
}));

jest.mock('@apiServices/salePointService', () => ({
    getSalePointTypeById: jest.fn(),
    addSalePointType: jest.fn(),
    editSalePointType: jest.fn(),
    deleteSalePointType: jest.fn(),
}));

const mockHistoryPush = jest.fn();

const mockTestSalePointType = {
    state: {
        salePoint: {
            deleted: false,
            description: 'Тестовое описание',
            endDate: null,
            id: 0,
            kind: 'INTERNAL',
            name: 'Тест',
            priority: 1,
            startDate: '2020-01-01',
        },
    },
};

const testFormData = {
    description: 'Тест',
    kind: 'EXTERNAL',
    name: 'Тестовое имя',
    priority: 1,
};

const TEST_PROPS = {
    matchPath: 'test',
    mode: 'add',
    history:  {
        push: mockHistoryPush,
        replace: jest.fn(),
    } as any,
    location: {} as Location,
    match: {} as match,
};

describe('<SalePointTypeForm /> test', () => {
    it('should match snapshot', () => {
        (useLocation as jest.Mock).mockImplementation(() => mockTestSalePointType);
        const Component = shallow(<SalePointTypeForm {...TEST_PROPS} />);
        expect(Component.html()).toMatchSnapshot();
    });

    it('sale point type should be created', async () => {
        (useLocation as jest.Mock).mockImplementation(() => mockTestSalePointType);
        const EditableComponent = mount(<SalePointTypeForm {...TEST_PROPS} />);
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        const formInstance = EditableComponent.find(Form).prop('form')!;
        formInstance.setFieldsValue(testFormData);
        formInstance.submit();
        await sleep();
        expect(addSalePointType).toHaveBeenCalledTimes(1);
        expect(addSalePointType).toHaveBeenCalledWith(testFormData);
    });

    it('should open edit mode', () => {
        const newProps = { ...TEST_PROPS, mode: 'edit' };
        (useLocation as jest.Mock).mockImplementation(() => mockTestSalePointType);
        const EditableComponent = mount(<SalePointTypeForm {...newProps} />);
        expect(EditableComponent.find('.pageTitle').text()).toBe('Тип точки продажи Тест');
    });

    it('should get sale point from server', async () => {
        const newProps = { ...TEST_PROPS, mode: 'edit' };
        (useLocation as jest.Mock).mockImplementation(() => ({}));
        await act(async () => {
            mount(<SalePointTypeForm {...newProps} />);
        });
        expect(getSalePointTypeById).toHaveBeenCalledTimes(1);
        expect(getSalePointTypeById).toHaveBeenCalledWith(0);
    });

    it('sale point type should be edited', async () => {
        const newProps = { ...TEST_PROPS, mode: 'edit' };
        const formData = {
            description: 'Тестовое описание',
            kind: 'EXTERNAL',
            name: 'Тест имени',
            priority: 1,
        };
        (useLocation as jest.Mock).mockImplementation(() => mockTestSalePointType);
        const EditableComponent = mount(<SalePointTypeForm {...newProps} />);
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        const formInstance = EditableComponent.find(Form).prop('form')!;
        formInstance.setFieldsValue(formData);
        formInstance.submit();
        await sleep();
        expect(editSalePointType).toHaveBeenCalled();
    });

    it('sale point type should not be edited', async () => {
        const newProps = { ...TEST_PROPS, mode: 'edit' };
        const formData = {
            description: 'тест некорректного описания&',
            kind: 'EXTERNAL',
            name: 'test',
            priority: 1,
        };
        const warnSpy = jest.spyOn(console, 'warn').mockImplementation(() => ({}));
        (useLocation as jest.Mock).mockImplementation(() => mockTestSalePointType);
        (editSalePointType as jest.Mock).mockRejectedValue('Error');
        const EditableComponent = mount(<SalePointTypeForm {...newProps} />);
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        const formInstance = EditableComponent.find(Form).prop('form')!;
        formInstance.setFieldsValue(formData);
        formInstance.submit();
        await sleep();
        expect(warnSpy).toHaveBeenCalledTimes(2);
    });

    it('sale point type should not be edited with error message', async () => {
        const formData = {
            description: 'Тестовое описание',
            kind: 'EXTERNAL',
            name: 'Тестовое имя',
            priority: 1,
        };
        console.warn = jest.fn(() => '');
        const newProps = { ...TEST_PROPS, mode: 'edit' };
        (useLocation as jest.Mock).mockImplementation(() => mockTestSalePointType);
        (editSalePointType as jest.Mock).mockRejectedValue(new Error('Error'));
        const EditableComponent = mount(<SalePointTypeForm {...newProps} />);
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        const formInstance = EditableComponent.find(Form).prop('form')!;
        formInstance.setFieldsValue(formData);
        formInstance.submit();
        await sleep();
        expect(message.error).toHaveBeenCalledWith('Ошибка изменения типа точки продажи: Error');
    });

    it('should redirect to sale point type list', async () => {
        const newProps = { ...TEST_PROPS, mode: 'edit' };
        (useLocation as jest.Mock).mockImplementation(() => mockTestSalePointType);
        const EditableComponent = mount(<SalePointTypeForm {...newProps} />);
        EditableComponent.find('button').at(1).simulate('click');
        await sleep();
        expect(mockHistoryPush).toHaveBeenCalled();
    });

    it('sale point type should be delete', async () => {
        const newProps = { ...TEST_PROPS, mode: 'edit' };
        (useLocation as jest.Mock).mockImplementation(() => mockTestSalePointType);
        const EditableComponent = mount(<SalePointTypeForm {...newProps} />);
        EditableComponent.find('button').at(2).simulate('click');
        await sleep();
        expect(utils.confirmModal).toHaveBeenCalled();
        await (utils.confirmModal as jest.Mock).mock.calls[0][0].onOk();
        expect(deleteSalePointType).toHaveBeenCalled();
    });

    it('sale point type should not be delete', async () => {
        const warnSpy = jest.spyOn(console, 'warn').mockImplementation(() => ({}));
        const newProps = { ...TEST_PROPS, mode: 'edit' };
        (useLocation as jest.Mock).mockImplementation(() => mockTestSalePointType);
        (deleteSalePointType as jest.Mock).mockRejectedValue('Error');
        const EditableComponent = mount(<SalePointTypeForm {...newProps} />);
        EditableComponent.find('button').at(2).simulate('click');
        await sleep();
        await (utils.confirmModal as jest.Mock).mock.calls[0][0].onOk();
        expect(warnSpy).toHaveBeenCalledTimes(1);
    });

    it('sale point type should not be delete with error message', async () => {
        console.warn = jest.fn(() => '');
        const newProps = { ...TEST_PROPS, mode: 'edit' };
        (useLocation as jest.Mock).mockImplementation(() => mockTestSalePointType);
        (deleteSalePointType as jest.Mock).mockRejectedValue(new Error('Error'));
        const EditableComponent = mount(<SalePointTypeForm {...newProps} />);
        EditableComponent.find('button').at(2).simulate('click');
        await sleep();
        await (utils.confirmModal as jest.Mock).mock.calls[0][0].onOk();
        expect(message.error).toHaveBeenCalledWith('Ошибка удаления типа точки продажи: Error');
    });
});
