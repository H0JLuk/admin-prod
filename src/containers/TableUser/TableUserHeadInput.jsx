import React, { useCallback, useMemo } from 'react';
import { Input } from 'antd';
import { SearchOutlined } from '@ant-design/icons';

import { ReactComponent as Cross } from '../../static/images/cross.svg';
import styles from './TableUser.module.css';

const TableUserHeadInput = ({
    title,
    valueSet = '',
    value = '',
    inputName,
    onChange = () => {},
}) => {
    const clearInput = useCallback(() => onChange(inputName), [inputName, onChange]);
    const onChangeHandler = useCallback((e) => onChange(inputName, e.target.value), [onChange, inputName]);
    const suffix = useMemo(() => <Cross onClick={ clearInput } />, [clearInput]);

    return (
        <div className={ styles.section }>
            <SearchOutlined />
            <Input
                placeholder={ title }
                value={ valueSet }
                suffix={ value !== '' ? suffix : <span /> }
                className={ styles.inputFilter }
                onChange={ onChangeHandler }
            />
        </div>
    );
};

export default TableUserHeadInput;
