import React from 'react';
import { CloseOutlined, DownOutlined } from '@ant-design/icons';
import { Checkbox, Select } from 'antd';

import styles from './SelectTags.module.css';

function SelectTags({
    onChange,
    data = [],
    value = [],
    nameKey = 'name',
    idKey = 'code',
    placeholder,
}) {

    const stringValue = value.map(String);

    const setSelect = (tag) => {
        onChange(tag);
    };

    const onRemoveSelectedTag = () => {
        onChange([]);
    };

    const selectTagRender = ({ value, onClose }) => (
        value && <div className={ styles.tagSelect } >
            <p className={ styles.selectText }>{ findName(data, value, nameKey, idKey) }</p>
            <CloseOutlined
                height="15px"
                width="15px"
                fill="#09A552"
                onClick={ onClose }
            />
        </div>
    );

    const options = data.map((elem) => {
        const name = String(elem[nameKey]);
        const value = String(elem[idKey]);
        return {
            label: (
                <>
                    <Checkbox
                        className={ styles.mrr }
                        checked={ stringValue.includes(value) }
                    />
                    { name }
                </>
            ),
            value,
        };
    });

    return (
        <Select
            className={ styles.select }
            suffixIcon={ () => suffixBlock(stringValue.length, onRemoveSelectedTag) }
            showArrow
            showSearch={ false }
            maxTagCount="responsive"
            maxTagTextLength={ 50 }
            mode="tags"
            placeholder={ placeholder }
            maxTagPlaceholder={ tagsPlaceholder }
            tagRender={ selectTagRender }
            onChange={ setSelect }
            dropdownClassName={ styles.dropdown }
            options={ options }
            value={ stringValue }
        />
    );
}

const tagsPlaceholder = <div className={ styles.tagPlaceholder }>...</div>;

function suffixBlock(selectedCount, onRemoveSelectedTag) {
    return (
        <div className={ styles.suffixBlock }>
            <DownOutlined className={ styles.icon } />
            <div className={ styles.closeIcon }>
                { !!selectedCount && <div className={ styles.selectedCount }>{ selectedCount }</div> }
                { !!selectedCount && (
                    <CloseOutlined
                        className={ styles.icon }
                        size={ 25 }
                        onClick={ onRemoveSelectedTag }
                    />
                ) }
            </div>
        </div>
    );
}

function findName(data, selectedValue, nameKey, keyToCompare) {
    const name = data.find((elem) => {
        const key = String(elem[keyToCompare]);
        return key === selectedValue;
    });
    return name && name[nameKey];
}

export default SelectTags;


