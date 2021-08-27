/* eslint-disable @typescript-eslint/no-non-null-assertion */
import React from 'react';
import omit from 'lodash/omit';
import { sleep } from '@setupTests';
import LocationForm from './LocationForm';
import { mount, shallow } from 'enzyme';
import { addLocation, deleteLocation, editLocation, getLocationsByText } from '@apiServices/locationService';
import { act } from 'react-dom/test-utils';
import { Button, Form } from 'antd';
import { confirmModal } from '@utils/utils';
import AutoCompleteComponent from '@components/AutoComplete';
import AutocompleteOptionLabel from '@components/AutoComplete/AutocompleteLocationAndSalePoint/AutocompleteOptionLabel';
import { testLocation } from '@testConstants';

const mockHistoryPush = jest.fn();

let mockEmptyStateLocation = false;
const mockLocation = {
    location: testLocation,
};

jest.mock('@apiServices/locationService', () => ({
    deleteLocation: jest.fn(),
    addLocation: jest.fn(),
    editLocation: jest.fn(),
    getLocationsByText: jest.fn(),
    getLocationTypeOptions: jest.fn(),
}));

jest.mock('react-router-dom', () => ({
    useParams: () => ({ salePointId: 13 }),
    useLocation: () => ({
        state: !mockEmptyStateLocation ? mockLocation : undefined,
    }),
    useHistory: () => ({
        push: mockHistoryPush,
    }),
}));

jest.mock('@utils/utils', () => ({
    confirmModal: jest.fn(),
}));

describe('<LocationForm /> tests', () => {
    const defaultProps = {
        matchPath: '/admin/reference-books/sale-point',
        mode: 'add',
    };

    beforeEach(() =>
        console.error = jest.fn(),
    );

    it('LocationForm snapshot', () => {
        const wrapper = shallow(<LocationForm {...defaultProps} />);
        expect(wrapper.html()).toMatchSnapshot();
    });

    it('should push to locations list on edit if no location provided', () => {
        mockEmptyStateLocation = true;
        const newProps = { ...defaultProps, mode: 'edit' };
        shallow(<LocationForm {...newProps} />);
        expect(mockHistoryPush).toBeCalledTimes(1);
        mockEmptyStateLocation = false;
    });

    it('should call `deleteLocation` function', async () => {
        const newProps = { ...defaultProps, mode: 'edit' };

        const wrapper = mount(<LocationForm {...newProps} />);
        const deleteButton = wrapper.find(Button).last();
        await act(async () => {
            deleteButton.simulate('click');
        });

        await (confirmModal as jest.Mock).mock.calls[0][0].onOk();
        expect(deleteLocation).toBeCalledTimes(1);
        expect(mockHistoryPush).toBeCalledTimes(1);
    });

    it('should catch in `deleteLocation` function', async () => {
        (deleteLocation as jest.Mock).mockRejectedValue(new Error('test error'));
        const newProps = { ...defaultProps, mode: 'edit' };

        const wrapper = mount(<LocationForm {...newProps} />);
        const deleteButton = wrapper.find(Button).last();
        await act(async () => {
            deleteButton.simulate('click');
        });

        await (confirmModal as jest.Mock).mock.calls[0][0].onOk();
        expect(console.error).toHaveBeenCalledWith(new Error('test error'));
    });

    it('should update a location if inputs are valid', async () => {
        const newProps = { ...defaultProps, mode: 'edit' };
        const wrapper = mount(<LocationForm {...newProps} />);
        const formInstance = wrapper.find(Form).prop('form')!;

        formInstance.setFieldsValue({
            name: 'тестовая локация',
            parentLocation: testLocation,
            typeId: 2,
        });

        formInstance.submit();
        await sleep();
        expect(editLocation).toBeCalledTimes(1);
    });

    it('should catch in editLocation function', async () => {
        (editLocation as jest.Mock).mockRejectedValue(new Error('test error'));
        const newProps = { ...defaultProps, mode: 'edit' };
        const wrapper = mount(<LocationForm {...newProps} />);
        const formInstance = wrapper.find(Form).prop('form')!;

        formInstance.submit();
        await sleep();
        expect(editLocation).toBeCalledTimes(1);
        expect(console.error).toHaveBeenCalledWith(new Error('test error'));
    });

    it('should create new location if form fields are valid', async () => {
        const wrapper = mount(<LocationForm {...defaultProps} />);
        const formInstance = wrapper.find(Form).prop('form')!;
        const testData = {
            name: 'Тестовая имя локации',
            parentLocation: testLocation,
            typeId: 1,
        };

        formInstance.setFieldsValue(testData);
        formInstance.submit();
        await sleep();
        expect(addLocation).toBeCalledTimes(1);
        expect(addLocation).toBeCalledWith({
            ...(omit(testData, 'parentLocation')),
            parentId: testData.parentLocation.id,
            description: '',
        });
    });

    it('should render an empty form to add new location', async () => {
        mockEmptyStateLocation = true;
        const wrapper = mount(<LocationForm {...defaultProps} />);
        const form = wrapper.find(Form);
        const formInstance = form.prop('form')!;

        expect(formInstance.getFieldsValue()).toEqual({
            typeId: undefined,
            parentLocation: null,
            name: '',
            description: '',
        });
        mockEmptyStateLocation = false;
    });

    it('renderOptionItemLabel should return AutocompleteOptionLabel', async () => {
        (getLocationsByText as jest.Mock).mockResolvedValue([testLocation]);
        const wrapper = mount(<LocationForm {...defaultProps} />);
        const autocompleteComponent = wrapper.find(AutoCompleteComponent);
        const renderOptionItemLabel = autocompleteComponent.prop('renderOptionItemLabel') as any;
        const renderedOption = renderOptionItemLabel(testLocation, '');

        expect(renderedOption).toEqual(
            <AutocompleteOptionLabel
                name={testLocation.name}
                parentName={testLocation.parentName}
                highlightValue=""
                highlightClassName="highlight"
            />,
        );
    });
});
