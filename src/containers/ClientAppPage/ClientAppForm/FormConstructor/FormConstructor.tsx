import React from 'react';
import cn from 'classnames';
import { Checkbox, Col, Form, Input, Row, Select } from 'antd';
import { FormConstructorItem, FormConstructorFormItem, FORM_TYPES } from '../ClientAppFormConstants';
import Banner from '../MainPageDesign/Banner';

import styles from './FormConstructor.module.css';

type FormInputByTypeProps = FormConstructorFormItem & {
    isEdit?: boolean;
    canEdit?: boolean;
    disabledFields?: Record<string, string[]>;
    hiddenFields?: string[];
};

type AppFormConstructorProps = {
    isEdit?: boolean;
    row: FormConstructorItem[];
    disabledFields?: Record<string, string[]>;
    hiddenFields?: string[];
    isCreate?: boolean;
};

const FormInputByType: React.FC<FormInputByTypeProps> = ({ isEdit, disabledFields = {}, ...rest }) => {
    switch (rest.type) {
        case FORM_TYPES.BANNER: {
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
            const { type, ...restProps } = rest;
            return <Banner {...restProps} />;
        }
        case FORM_TYPES.CHECKBOX_GROUP: {
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
            const { type, columnMode, ...restProps } = rest;
            const hasFieldsToDisable = disabledFields[(restProps as any).id];
            if (hasFieldsToDisable) {
                restProps.options = (restProps.options || []).map(
                    op => typeof op === 'object' ? ({ ...op, disabled: hasFieldsToDisable.includes(op.value as string) }) : op,
                );
            }
            return (
                <Checkbox.Group
                    className={cn({ [styles.checkboxColumn]: columnMode })}
                    {...restProps}
                />
            );
        }
        case FORM_TYPES.TEXT_AREA: {
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
            const { type, ...restProps } = rest;
            return <Input.TextArea {...restProps} />;
        }
        case FORM_TYPES.INPUT: {
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
            const { type, canEdit, id, ...restProps } = rest;
            if (!isEdit || canEdit) {
                return <Input allowClear {...restProps} />;
            }
            return <div className={styles.infoText}>{restProps.value}</div>;
        }
        case FORM_TYPES.SELECT: {
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
            const { type, ...restProps } = rest;
            return <Select {...restProps} />;
        }
        case FORM_TYPES.FORM_GROUP: {
            return null;
        }
        case FORM_TYPES.CHECKBOX: {
            const { title, id, ...restProps } = rest;
            return <Checkbox {...restProps} >{title}</Checkbox>;
        }
    }
};

const AppFormConstructor: React.FC<AppFormConstructorProps> = ({
    row,
    isEdit,
    isCreate = false,
    disabledFields,
    hiddenFields,
}) => (
    <Row className={styles.propertiesRow} gutter={24}>
        {row.map(({ label, span, rules, name, normalize, hideWhenCreate, valuePropName, isFormGroup, items, ...restProps }, index) => !(isCreate && hideWhenCreate) && (
            <Col className={styles.colFlex} key={index + String(label)} span={span}>
                {!isFormGroup ? (!hiddenFields?.includes(String(name)) && (
                    <Form.Item
                        rules={rules}
                        name={name}
                        className={cn({ [styles.labelBold]: isEdit })}
                        label={label}
                        valuePropName={valuePropName}
                        normalize={normalize}
                        validateTrigger="onSubmit"
                        validateFirst
                    >
                        <FormInputByType
                            isEdit={isEdit}
                            {...restProps}
                            disabledFields={disabledFields}
                        />
                    </Form.Item>
                )) : items?.map((internalRow, internalIndex) => (
                    <AppFormConstructor
                        key={internalIndex}
                        row={internalRow}
                        disabledFields={disabledFields}
                        hiddenFields={hiddenFields}
                        isCreate={isCreate}
                    />
                ))
                }
            </Col>
        ))}
    </Row>
);

export default AppFormConstructor;
