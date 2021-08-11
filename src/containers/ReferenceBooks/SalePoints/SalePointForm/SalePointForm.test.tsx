/* eslint-disable @typescript-eslint/no-non-null-assertion */
import React from 'react';
import SalePointForm from './SalePointForm';
import { waitFor } from '@testing-library/react';
import { Form } from 'antd';
import { mount, shallow } from 'enzyme';
import {
    salePointTypeTestResponse,
    searchLocation,
    searchSalePointTestData,
    testLocation,
    testSalePoint,
} from '@testConstants';
import {
    addSalePoint,
    deleteSalePoint,
    getSalePointByText,
    getSalePointsByText,
    getSalePointTypesList,
    editSalePoint,
} from '@apiServices/salePointService';
import { getLocationsByText } from '@apiServices/locationService';
import { confirmModal } from '@utils/utils';
import AutocompleteOptionLabel from '@components/AutoComplete/AutocompleteLocationAndSalePoint/AutocompleteOptionLabel';
import { act } from 'react-dom/test-utils';
import { sleep } from '@setupTests';

const testFormData = {
    name: 'Тестовое имя точки',
    typeId: 1,
    location: testLocation,
    parentSalePoint: testSalePoint,
};

let mockEmptyStateLocation = false;
const mockLocation = { salePoint: searchSalePointTestData[0] };
const mockHistoryPush = jest.fn();

jest.mock('react-router-dom', () => ({
    useParams: () => ({ salePointId: 13 }),
    useLocation: () => ({
        state: !mockEmptyStateLocation ? mockLocation : undefined,
    }),
    useHistory: () => ({
        push: mockHistoryPush,
        replace: jest.fn(),
    }),
}));

jest.mock('@apiServices/salePointService', () => ({
    addSalePoint: jest.fn(),
    deleteSalePoint: jest.fn(),
    editSalePoint: jest.fn(),
    getChannelOptions: jest.fn(),
    getSalePointsByText: jest.fn(),
    getSalePointByText: jest.fn(),
    getSalePointTypesList: jest.fn(),
}));

jest.mock('@apiServices/locationService', () => ({
    getLocationsByText: jest.fn(),
}));

jest.mock('@utils/utils', () => ({
    confirmModal: jest.fn(),
}));

describe('<SalePointForm /> tests', () => {
    const defaultProps = {
        matchPath: '/admin/reference-books/sale-point',
        mode: 'add',
    };

    beforeEach(() => {
        (getLocationsByText as jest.Mock).mockImplementation(() => searchLocation);
        (getSalePointByText as jest.Mock).mockImplementation(() => testSalePoint);
        (getSalePointTypesList as jest.Mock).mockImplementation(() => salePointTypeTestResponse);
        (getSalePointsByText as jest.Mock).mockImplementation(() => searchSalePointTestData);
    });

    it('SalePointForm snapshot', () => {
        const wrapper = shallow(<SalePointForm {...defaultProps} />);
        expect(wrapper.html()).toMatchSnapshot();
    });

    it('should render options with parent sale point', async () => {
        const newProps = { ...defaultProps, mode: 'add' };
        const wrapper = mount(<SalePointForm {...newProps} />);
        const renderOptionItemLabel: any = wrapper.find('AutoCompleteComponent').at(0).prop('renderOptionItemLabel');

        await waitFor(() => expect(renderOptionItemLabel(testSalePoint, 'test value')).toEqual(
            <AutocompleteOptionLabel
                name={testSalePoint.name}
                parentName={testSalePoint.parentName}
                highlightValue="test value"
                highlightClassName="highlight"
            />,
        ));
    });

    it('should render options with parent location', async () => {
        const newProps = { ...defaultProps, mode: 'add' };
        const wrapper = mount(<SalePointForm {...newProps} />);
        const renderOptionItemLabel: any = wrapper.find('AutoCompleteComponent').at(1).prop('renderOptionItemLabel');

        await waitFor(() => expect(renderOptionItemLabel(testLocation, 'test value')).toEqual(
            <AutocompleteOptionLabel
                name={testLocation.name}
                parentName={testLocation.parentName}
                highlightValue="test value"
                highlightClassName="highlight"
            />,
        ));
    });

    it('should add salePoint', async () => {
        const wrapper = mount(<SalePointForm {...defaultProps} />);
        const formInstance = wrapper.find(Form).prop('form')!;

        formInstance.setFieldsValue(testFormData);
        formInstance.submit();
        await sleep();

        expect(addSalePoint).toBeCalledTimes(1);
        expect(addSalePoint).toBeCalledWith({
            description: '',
            name: testFormData.name,
            locationId: testFormData.location.id,
            parentId: testFormData.parentSalePoint.id,
            typeId: testFormData.typeId,
        });
    });

    it('should click cancel button and redirect to sale points page', async () => {
        const wrapper = mount(<SalePointForm {...defaultProps} />);
        await act(async () => {
            wrapper.find('Button').first().simulate('click');
        });
        expect(mockHistoryPush).toBeCalledTimes(1);
    });

    it('should edit salePoint', async () => {
        const newProps = { ...defaultProps, mode: 'edit' };
        const wrapper = mount(<SalePointForm {...newProps} />);
        const formInstance = wrapper.find(Form).prop('form')!;

        formInstance.setFieldsValue(testFormData);
        formInstance.submit();
        await sleep();

        expect(editSalePoint).toBeCalledTimes(1);
    });

    it('should render edit title', () => {
        const newProps = { ...defaultProps, mode: 'edit' };
        const wrap = shallow(<SalePointForm {...newProps} />);
        expect(wrap.find('.pageTitle').first().text()).toEqual(`Точка продажи ${searchSalePointTestData[0].name}`);
    });

    it('should call catch in onFinish function', async () => {
        const spyOnConsole = jest
            .spyOn(console, 'error')
            .mockImplementation(() => '');
        (addSalePoint as jest.Mock).mockRejectedValue(new Error('test error'));

        const wrapper = shallow(<SalePointForm {...defaultProps} />);
        const form: any = wrapper.find('ForwardRef(InternalForm)').at(0);
        await form.prop('onFinish')(testFormData);

        expect(addSalePoint).toBeCalledTimes(1);
        expect(spyOnConsole).toHaveBeenCalledWith('test error');
    });

    it('should delete sale point', async () => {
        const newProps = { ...defaultProps, mode: 'edit' };
        const wrapper = mount(<SalePointForm {...newProps} />);

        await act(async () => {
            wrapper.find('Button').last().simulate('click');
        });
        await (confirmModal as jest.Mock).mock.calls[0][0].onOk();

        expect(deleteSalePoint).toBeCalledTimes(1);
    });

    it('should call catch in removeSalePoint function', async () => {
        const spyOnConsole = jest
            .spyOn(console, 'error')
            .mockImplementation(() => '');

        (deleteSalePoint as jest.Mock).mockRejectedValue(new Error('test error'));
        const newProps = { ...defaultProps, mode: 'edit' };
        const wrapper = mount(<SalePointForm {...newProps} />);

        await act(async () => {
            wrapper.find('Button').last().simulate('click');
        });
        await (confirmModal as jest.Mock).mock.calls[0][0].onOk();

        expect(deleteSalePoint).toBeCalledTimes(1);
        expect(spyOnConsole).toHaveBeenCalledWith('test error');
    });

    it('should not render SalePointForm', () => {
        mockEmptyStateLocation = true;
        const newProps = { ...defaultProps, mode: 'edit' };
        const wrapper = shallow(<SalePointForm {...newProps} />);

        expect(wrapper.html()).toBeNull();
        expect(mockHistoryPush).toBeCalledTimes(1);
        mockEmptyStateLocation = false;
    });
});
