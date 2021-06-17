import React from 'react';
import { CloseOutlined, DownOutlined } from '@ant-design/icons';
import { Checkbox, Select } from 'antd';
import { SelectProps } from 'antd/es/select';

import styles from './SelectTags.module.css';

interface ISelectTags {
    showClearIcon?: boolean;
    canRemoveSelected?: boolean;
    onChange?: (value: string[]) => void;
    data: SelectTagsOptions[];
    value?: number[];
    nameKey?: string;
    idKey?: string;
    placeholder: string;
}

// TODO: Придумать как обобщить тип options с помощью дженерика
type SelectTagsOptions = Record<string, any>;

const SelectTags: React.FC<ISelectTags> = ({
    showClearIcon = true,
    canRemoveSelected = true,
    onChange,
    data = [],
    value = [],
    nameKey = 'name',
    idKey = 'code',
    placeholder,
}) => {
    const stringValue = value.map(String);

    const onRemoveSelectedTags = () => {
        onChange && onChange([]);
    };

    const selectTagRender: SelectProps<string[]>['tagRender'] = ({ value, onClose }) => (
        value ? (
            <div className={styles.tagSelect} >
                <p className={styles.selectText}>{findName(data, value as string, nameKey, idKey)}</p>
                {canRemoveSelected && (
                    <CloseOutlined
                        height="15px"
                        width="15px"
                        onClick={onClose}
                    />
                )}
            </div>
        ) : <span />
    );

    const options = data.map((elem) => {
        const name = String(elem[nameKey]);
        const value = String(elem[idKey]);
        return {
            label: (
                <>
                    <Checkbox
                        className={styles.mrr}
                        checked={stringValue.includes(value)}
                    />
                    {name}
                </>
            ),
            value,
            disabled: elem.disabled,
        };
    });

    return (
        <Select<string[]>
            className={styles.select}
            suffixIcon={() => suffixBlock(stringValue.length, onRemoveSelectedTags, showClearIcon)}
            showArrow
            showSearch={false}
            maxTagCount="responsive"
            maxTagTextLength={50}
            mode="tags"
            placeholder={placeholder}
            maxTagPlaceholder={<span>...</span>}
            tagRender={selectTagRender}
            onChange={onChange}
            dropdownClassName={styles.dropdown}
            options={options}
            value={stringValue}
        />
    );
};

function suffixBlock(selectedCount: number, onRemoveSelectedTag: () => void, showClearIcon?: boolean) {
    return (
        <div className={styles.suffixBlock}>
            <DownOutlined className={styles.icon} />
            <div className={styles.closeIcon}>
                {!!selectedCount && <div className={styles.selectedCount}>{selectedCount}</div>}
                {showClearIcon && !!selectedCount && (
                    <CloseOutlined
                        className={styles.icon}
                        size={25}
                        onClick={onRemoveSelectedTag}
                    />
                )}
            </div>
        </div>
    );
}

function findName(data: SelectTagsOptions[], selectedValue: string, nameKey: string, keyToCompare: string) {
    const name = data.find((elem) => String(elem[keyToCompare]) === selectedValue);

    return name && String(name[nameKey]);
}

export default SelectTags;
