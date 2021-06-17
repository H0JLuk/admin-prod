import React, { useCallback } from 'react';
import { Checkbox } from 'antd';
import { CheckboxChangeEvent } from 'antd/lib/checkbox';
import noop from 'lodash/noop';

import styles from './Checkboxes.module.css';

export const ALL_APPS_CHECKBOX_TEXT = 'Все приложения';

type CheckboxesData = {
    id?: number;
    label: string;
    disabled: boolean;
    checked: boolean;
};

type CheckBoxCustomProps = CheckboxesData & {
    name: string;
    onChange: (checked: boolean, name: string) => void;
};

type CheckboxesProps = {
    checkboxesData: Record<string, CheckboxesData>;
    onChange: (checked: boolean, name: string) => void;
    onChangeAll: (checked: boolean) => void;
    disabledAll: boolean;
};

export const CheckBoxCustom: React.FC<CheckBoxCustomProps> = ({
    label,
    name,
    disabled,
    onChange,
    checked,
}) => {
    const onChangeHandler = useCallback((e: CheckboxChangeEvent) => onChange(e.target.checked, name), [onChange, name]);

    return (
        <Checkbox
            className={styles.checkbox}
            name={name}
            onChange={onChangeHandler}
            checked={checked}
            disabled={disabled}
        >
            {label}
        </Checkbox>
    );
};

const Checkboxes: React.FC<CheckboxesProps> = ({
    checkboxesData = {},
    onChange = noop,
    onChangeAll = noop,
    disabledAll = false,
}) => {
    const checkboxesKeys = Object.keys(checkboxesData);
    const allAreChecked = checkboxesKeys.every((key) => checkboxesData[key].checked);

    return (
        <>
            <div className={styles.checkboxAllApps}>
                <CheckBoxCustom
                    label={ALL_APPS_CHECKBOX_TEXT}
                    disabled={disabledAll}
                    onChange={onChangeAll}
                    checked={allAreChecked}
                    name="all"
                />
            </div>
            <div className={styles.checkbox}>
                {checkboxesKeys.map((key) => {
                    const { label, disabled, checked } = checkboxesData[key];

                    return (
                        <CheckBoxCustom
                            name={key}
                            label={label}
                            disabled={disabledAll || disabled}
                            onChange={onChange}
                            key={key}
                            checked={checked}
                        />
                    );
                })}
            </div>
        </>
    );
};

export default Checkboxes;
