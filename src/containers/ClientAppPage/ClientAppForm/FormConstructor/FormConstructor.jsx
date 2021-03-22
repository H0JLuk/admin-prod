import React from 'react';
import cn from 'classnames';
import { Checkbox, Col, Form, Input, Row } from 'antd';
import { FORM_TYPES } from '../ClientAppFormConstants';
import Banner from '../MainPageDesign/Banner/Banner';

import styles from './FormConstructor.module.css';

function FormInputByType({
    isEdit,
    type,
    columnMode,
    ...restProps
}) {

    switch (type) {
        case FORM_TYPES.BANNER:
            return <Banner { ...restProps } />;
        case FORM_TYPES.CHECKBOX_GROUP:
            return (
                <Checkbox.Group
                    className={ cn({ [styles.checkboxColumn]: columnMode }) }
                    { ...restProps }
                />
            );
        case FORM_TYPES.TEXT_BLOCK:
            return <Input.TextArea { ...restProps } />; /* TODO поменять во всем проекте на showCount */
        default:
            if (!isEdit) {
                return <Input allowClear { ...restProps } />;
            }
            return <div className={ styles.infoText }>{ restProps.value }</div>;
    }
}

export default function AppFormConstructor({ row, isEdit }) {
    return (
        <Row className={ styles.propertiesRow } gutter={ [24] }>
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
}