import React from 'react';
import { shallow } from 'enzyme';
import FormConstructor from './FormConstructor';
import { FORM_TYPES } from '../ClientAppFormConstants';
import { LOGIN_TYPES_ENUM, LOGIN_TYPE_OPTIONS } from '../../../../constants/loginTypes';
import Themes from '../../../../constants/themes';

describe('<FormConstructor /> test', () => {
    const props = {
        isEdit: false,
        row: [
            {
                label: 'label',
                span: 'span',
                rules: 'rules',
                name: 'name',
                value: Themes,
                type: FORM_TYPES.INPUT,
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
            row: [{ ...props.row[0], type: FORM_TYPES.BANNER, value: Themes.COFFEE }],
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
            row: [{ ...props.row[0], type: FORM_TYPES.TEXT_AREA }],
        };
        const FormConstructorComponent = shallow(
            <FormConstructor { ...newProps } />
        );

        expect(FormConstructorComponent.find('FormInputByType').html()).toMatch('textarea');
        expect(FormConstructorComponent.find('FormInputByType').html()).toMatchSnapshot();
    });

    it('should render select', () => {
        const newProps = {
            ...props,
            row: [{ ...props.row[0], value: ['test', 'test2'], type: FORM_TYPES.SELECT }],
        };
        const FormConstructorComponent = shallow(
            <FormConstructor { ...newProps } />
        );
        expect(FormConstructorComponent.find('FormInputByType').html()).toMatch('select');
        expect(FormConstructorComponent.find('FormInputByType').html()).toMatchSnapshot();
    });

    it('should disabled one checkbox', () => {
        const newProps = {
            ...props,
            row: [{
                ...props.row[0],
                name: 'login_types',
                id: 'login_types',
                type: FORM_TYPES.CHECKBOX_GROUP,
                value: [LOGIN_TYPE_OPTIONS[0].value],
                options: LOGIN_TYPE_OPTIONS,
            }],
            disabledFields: {
                login_types: [LOGIN_TYPES_ENUM.DIRECT_LINK],
            },
        };

        const FormConstructorComponent = shallow(
            <FormConstructor { ...newProps } />
        );

        const checkboxGroup = FormConstructorComponent.find('FormInputByType').dive();
        expect(checkboxGroup.prop('options')[1].disabled).toBe(false);
        expect(checkboxGroup.prop('options')[2].disabled).toBe(true);
    });
});
