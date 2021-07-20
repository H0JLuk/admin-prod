import React, { useState, useEffect, useRef } from 'react';
import SelectTags, { ISelectTags } from '../';

type SelectTagsOnChangeByCloseProps<OT> = ISelectTags<OT>;

const SelectTagsOnChangeByClose = <OT extends Record<string, any>>({
    value,
    onChange,
    ...restProps
}: SelectTagsOnChangeByCloseProps<OT>) => {
    const [state, setState] = useState<number[] | string[]>(value ?? []);
    const isOpenRef = useRef(false);
    const isChangeValue = useRef(false);

    useEffect(() => {
        setState((prev) => value && value.length > prev.length ? value : prev);
    }, [value]);

    const onDropdownVisibleChange = (open: boolean) => {
        isOpenRef.current = open;
        if (!open && isChangeValue.current) {
            onChange?.(state);
            isChangeValue.current = false;
        }
    };

    const onChangeHandler = (selected: number[] | string[]) => {
        if (!isOpenRef.current) {
            onChange?.(selected);
        }

        isChangeValue.current = isOpenRef.current;
        setState(selected);
    };

    return (
        <SelectTags<OT>
            {...restProps}
            value={state}
            onDropdownVisibleChange={onDropdownVisibleChange}
            onChange={onChangeHandler}
        />
    );
};

export default SelectTagsOnChangeByClose;
