import React from 'react';
import { shallow } from 'enzyme';
import FormConstructor from './FormConstructor';
import { FORM_TYPES } from '../ClientAppFormConstants';

describe('<FormConstructor /> test', () => {
    const props = {
        isEdit: false,
        row: [
            {
                label: 'label',
                span: 'span',
                rules: 'rules',
                name: 'name',
                value: {
                    vitrina_theme: 'vitrina_theme',
                    gradient: 'gradient',
                },
            },
        ],
    };

    it('should be mount snap', () => {
        const FormConstructorComponent = shallow(
            <FormConstructor { ...props } />
        );

        expect(FormConstructorComponent.debug()).toMatchSnapshot();
    });

    it('should render bannerType', () => {
        const newProps = {
            ...props,
            row: [{ ...props.row[0], type: FORM_TYPES.BANNER }],
        };
        const FormConstructorComponent = shallow(
            <FormConstructor { ...newProps } />
        );

        expect(FormConstructorComponent.find('FormInputByType').html()).toMatch('imageBlock');
        expect(FormConstructorComponent.find('FormInputByType').html()).toMatchSnapshot();
    });

    it('should render checkBoxes', () => {
        const newProps = {
            ...props,
            row: [{ ...props.row[0], type: FORM_TYPES.CHECKBOX_GROUP }],
        };
        const FormConstructorComponent = shallow(
            <FormConstructor { ...newProps } />
        );

        expect(FormConstructorComponent.find('FormInputByType').html()).toMatch('checkbox');
        expect(FormConstructorComponent.find('FormInputByType').html()).toMatchSnapshot();
    });

    it('should render textBlock', () => {
        const newProps = {
            ...props,
            row: [{ ...props.row[0], type: FORM_TYPES.TEXT_BLOCK }],
        };
        const FormConstructorComponent = shallow(
            <FormConstructor { ...newProps } />
        );

        expect(FormConstructorComponent.find('FormInputByType').html()).toMatch('textarea');
        expect(FormConstructorComponent.find('FormInputByType').html()).toMatchSnapshot();
    });

    it('should render input in default', () => {
        const FormConstructorComponent = shallow(
            <FormConstructor { ...props } />
        );

        expect(FormConstructorComponent.find('FormInputByType').html()).toMatch('input');
        expect(FormConstructorComponent.find('FormInputByType').html()).toMatchSnapshot();
    });

    it('should render div in default with editMode', () => {
        const newProps = {
            ...props,
            isEdit: true,
            row: [{ ...props.row[0], value: 'test' }],
        };
        const FormConstructorComponent = shallow(
            <FormConstructor { ...newProps } />
        );

        expect(FormConstructorComponent.find('FormInputByType').html()).toMatch('infoText');
        expect(FormConstructorComponent.find('FormInputByType').html()).toMatchSnapshot();
    });
});
