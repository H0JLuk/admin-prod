import React, { useCallback } from 'react';
import { Checkbox } from 'antd';

import styles from './Checkboxes.module.css';

const ALL_APPS_CHECKBOX_TEXT = 'Все приложения';

const CheckBoxCustom = ({ label, name, disabled, onChange, checked }) => {
    const onChangeHandler = useCallback((e) => onChange(e.target.checked, name), [onChange, name]);

    return (
        <Checkbox
            className={ styles.checkbox }
            name={ name }
            onChange={ onChangeHandler }
            checked={ checked }
            disabled={ disabled }
        >
            { label }
        </Checkbox>
    );
};

const Checkboxes = ({ checkboxesData = {}, onChange = () => {}, onChangeAll = () => {}, disabledAll = false }) => {
    const checkboxesKeys = Object.keys(checkboxesData);
    const allAreChecked = checkboxesKeys.every((key) => checkboxesData[key].checked);

    return (
        <>
            <div className={ styles.checkboxAllApps }>
                <CheckBoxCustom
                    label={ ALL_APPS_CHECKBOX_TEXT }
                    disabled={ disabledAll }
                    onChange={ onChangeAll }
                    checked={ allAreChecked }
                    name="all"
                />
            </div>
            <div className={ styles.checkbox }>
                { checkboxesKeys.map((key) => {
                    const { label, disabled, checked } = checkboxesData[key];

                    return (
                        <CheckBoxCustom
                            name={ key }
                            label={ label }
                            disabled={ disabledAll || disabled }
                            onChange={ onChange }
                            key={ key }
                            checked={ checked }
                        />
                    );
                }) }
            </div>
        </>
    );
};

export default Checkboxes;
