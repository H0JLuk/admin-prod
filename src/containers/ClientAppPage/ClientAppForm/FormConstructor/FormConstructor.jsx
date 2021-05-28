import React from 'react';
import cn from 'classnames';
import { Checkbox, Col, Form, Input, Row, Select } from 'antd';
import { FORM_TYPES } from '../ClientAppFormConstants';
import Banner from '../MainPageDesign/Banner/Banner';

import styles from './FormConstructor.module.css';

const FormInputByType = ({ isEdit, ...rest }) => {
    switch (rest.type) {
        case FORM_TYPES.BANNER: {
            // eslint-disable-next-line no-unused-vars
            const { type, ...restProps } = rest;
            return <Banner { ...restProps } />;
        }
        case FORM_TYPES.CHECKBOX_GROUP: {
            // eslint-disable-next-line no-unused-vars
            const { type, columnMode, ...restProps } = rest;
            return (
                <Checkbox.Group
                    className={ cn({ [styles.checkboxColumn]: columnMode }) }
                    { ...restProps }
                />
            );
        }
        case FORM_TYPES.TEXT_AREA: {
            // eslint-disable-next-line no-unused-vars
            const { type, ...restProps } = rest;
            return <Input.TextArea { ...restProps } />;
        }
        case FORM_TYPES.INPUT: {
            // eslint-disable-next-line no-unused-vars
            const { type, canEdit, ...restProps } = rest;
            if (!isEdit || canEdit) {
                return <Input allowClear { ...restProps } />;
            }
            return <div className={ styles.infoText }>{ restProps.value }</div>;
        }
        case FORM_TYPES.SELECT: {
            // eslint-disable-next-line no-unused-vars
            const { type, ...restProps } = rest;
            return <Select { ...restProps } />;
        }
    }
};

const AppFormConstructor = ({ row, isEdit }) => (
    <Row className={ styles.propertiesRow } gutter={ 24 }>
        { row.map(({ label, span, rules, name, ...restProps }) => (
            <Col className={ styles.colFlex } key={ label } span={ span }>
                <Form.Item
                    rules={ rules }
                    name={ name }
                    className={ cn({ [styles.labelBold]: isEdit }) }
                    label={ label }
                    validateFirst
                >
                    <FormInputByType isEdit={ isEdit } { ...restProps } />
                </Form.Item>
            </Col>
        )) }
    </Row>
);


export default AppFormConstructor;
