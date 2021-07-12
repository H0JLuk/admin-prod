import React from 'react';
import cn from 'classnames';
import { CloseOutlined, DownOutlined } from '@ant-design/icons';
import { Checkbox, Select, SelectProps } from 'antd';

import styles from './SelectTags.module.css';

// OT = OptionType
interface ISelectTags<OT> {
    className?: string;
    showClearIcon?: boolean;
    canRemoveSelected?: boolean;
    onChange?: (value: string[]) => void;
    data: OT[];
    value?: number[];
    nameKey?: keyof OT;
    idKey?: keyof OT;
    placeholder: string;
    disabled?: boolean;
    maxTagTextLength?: number;
}

const SelectTags = <OT extends Record<string, any>>({
    className,
    showClearIcon = true,
    canRemoveSelected = true,
    onChange,
    data = [],
    value = [],
    nameKey = 'name',
    idKey = 'code',
    placeholder,
    disabled,
    maxTagTextLength = 12,
}: ISelectTags<OT>) => {
    const stringValue = value.map(String);

    const onRemoveSelectedTags = () => {
        onChange?.([]);
    };

    // eslint-disable-next-line @typescript-eslint/no-shadow
    const selectTagRender: SelectProps<string[]>['tagRender'] = ({ value, onClose }) => (
        value ? (
            <div className={styles.tagSelect}>
                <p className={styles.selectText}>
                    {findName(data, value as string, nameKey, idKey, maxTagTextLength)}
                </p>
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
        const optionValue = String(elem[idKey]);
        return {
            label: (
                <>
                    <Checkbox
                        className={styles.mrr}
                        checked={stringValue.includes(optionValue)}
                    />
                    {name}
                </>
            ),
            value: optionValue,
            disabled: elem.disabled,
        };
    });

    const suffix = suffixBlock(stringValue.length, onRemoveSelectedTags, showClearIcon);

    return (
        <Select<string[]>
            className={cn(styles.select, className)}
            suffixIcon={suffix}
            showArrow
            showSearch={false}
            maxTagCount="responsive"
            maxTagTextLength={maxTagTextLength}
            mode="tags"
            placeholder={placeholder}
            maxTagPlaceholder={<span>...</span>}
            tagRender={selectTagRender}
            onChange={onChange}
            dropdownClassName={styles.dropdown}
            options={options}
            value={stringValue}
            disabled={disabled}
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

function findName<OT>(
    data: OT[],
    selectedValue: string,
    nameKey: keyof OT,
    keyToCompare: keyof OT,
    maxTagTextLength: number,
) {
    const name = data.find((elem) => String(elem[keyToCompare]) === selectedValue);
    let displayValue = String(name?.[nameKey] ?? '');

    if (displayValue.length > maxTagTextLength) {
        displayValue = `${displayValue.slice(0, maxTagTextLength).trim()}...`;
    }

    return displayValue;
}

export default SelectTags;
