import React, { useState, useCallback, useEffect, ReactNode, useRef, SetStateAction } from 'react';
import noop from 'lodash/noop';
import debounce from 'lodash/debounce';
import cn from 'classnames';
import { AutoComplete, AutoCompleteProps, Input, InputProps } from 'antd';
import { SearchOutlined } from '@ant-design/icons';
import { OptionData, OptionGroupData } from 'rc-select/lib/interface';
import { KeysWithString } from '@types';

import { ReactComponent as Cross } from '@imgs/cross.svg';
import styles from './AutoCompleteComponent.module.css';

export type AutoCompleteMethods<DataType> = {
    clearState(): void;
    getOptions(): DataType[];
    getValue(): string;
    setSelectedOption(value: string, option: AutoCompleteOption<DataType>): void;
    callRequestFunc(searchValue: string, ...args: any[]): Promise<DataType[]>;
};

export interface AutoCompleteOption<DataType> extends OptionData {
    data: DataType;
}

interface AutoCompleteComponentProps<DataType> extends Omit<AutoCompleteProps, 'onSelect' | 'onSearch' | 'options' | 'defaultValue' | 'value'> {
    className?: string;
    error?: string;
    value?: DataType | string | null;
    options?: DataType[];
    renderOptionItemLabel?: (option: DataType, searchValue: string) => React.ReactNode;
    renderOptionStringValue?: (option: DataType) => string;
    onSearch?: (searchValue: string) => void;
    onSelect?: (selected: DataType | null) => void;
    searchCondition?: (searchValue: string) => boolean;
    disabled?: boolean;
    placeholder: string;
    inputMaxLength?: InputProps['maxLength'];
    requestFunction?: (searchValue: string, ...args: any[]) => Promise<DataType[]>;
    componentMethods?: React.MutableRefObject<AutoCompleteMethods<DataType>>;
    clearValueOnBlur?: boolean;
    selectExactValueOnBlur?: boolean;
    selectFirstValueOnBlur?: boolean;
    keyForCompareSelect?: KeysWithString<DataType>;
    clearSelectedBySearch?: boolean;
}

type AutoCompleteComponentState<DataType> = {
    value: string;
    options: DataType[];
    selectedElem: DataType | null;
};

const DEFAULT_STATE = {
    value: '',
    options: [],
    selectedElem: null,
};

const AutoCompleteComponent = <DataType extends { label?: ReactNode; id?: number; value?: string; }>({
    className,
    error,
    value,
    options,
    renderOptionItemLabel,
    renderOptionStringValue,
    onSearch = noop,
    onSelect = noop,
    onBlur = noop,
    searchCondition = noop as any,
    disabled,
    placeholder,
    inputMaxLength,
    requestFunction = noop as any,
    componentMethods,
    clearValueOnBlur,
    selectExactValueOnBlur,
    selectFirstValueOnBlur,
    keyForCompareSelect,
    clearSelectedBySearch,
    ...restProps
}: AutoCompleteComponentProps<DataType>) => {
    const [loading, setLoading] = useState(true);
    const [state, setState] = useState<AutoCompleteComponentState<DataType>>(DEFAULT_STATE);
    const stateRef = useRef<AutoCompleteComponentState<DataType>>(DEFAULT_STATE);

    const changeState = useCallback((nextState: SetStateAction<AutoCompleteComponentState<DataType>>) => {
        stateRef.current = typeof nextState === 'function' ? nextState(stateRef.current) : nextState;
        setState(nextState);
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    useEffect(() => {
        if (componentMethods) {
            componentMethods.current = {
                clearState: () => changeState(DEFAULT_STATE),
                getOptions: () => stateRef.current.options,
                getValue: () => stateRef.current.value,
                setSelectedOption: (value, option) => onSelectHandler(value, option as OptionData),
                callRequestFunc: async (searchValue, ...args) => {
                    setLoading(true);
                    try {
                        const searchResult = await requestFunction(searchValue, ...args);

                        changeState(prev => ({ ...prev, options: searchResult }));
                        setLoading(false);
                        return searchResult;
                    } catch (e) {
                        setLoading(false);
                        console.error(e);
                        return [];
                    }
                },
            };
        }

        if (value) {
            changeState({ ...state, value: getOptionValue(value, renderOptionStringValue) ?? '' });
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    useEffect(() => {
        changeState(prev => ({
            ...prev,
            options: Array.isArray(options) ? options : [],
        }));
    }, [changeState, options]);

    const getSearchResults = useCallback(async (searchValue) => {
        try {
            const searchResult = await requestFunction(searchValue);

            changeState(prev => ({
                ...prev,
                options: searchResult,
            }));
        } catch (e) {
            console.error(e);
        }
        setLoading(false);
    }, [changeState, requestFunction]);

    // eslint-disable-next-line react-hooks/exhaustive-deps
    const getResultsDebounced = useCallback(debounce(getSearchResults, 500), [getSearchResults]);

    const selectValue = (selectedElem: DataType | null) => {
        onSelect(selectedElem);
        changeState(prev => ({ ...prev, selectedElem }));
    };

    const onSearchHandler = (searchValue: string) => {
        if (!searchValue || clearSelectedBySearch) {
            selectValue(null);
        }

        setLoading(true);
        onSearch(searchValue);
        changeState(prev => ({ ...prev, value: searchValue }));

        if (!searchValue || searchCondition(searchValue)) {
            changeState(prev => ({
                ...prev,
                value: searchValue,
                options: [],
            }));
            setLoading(false);
            getResultsDebounced.cancel();
            return;
        }

        getResultsDebounced(searchValue);
    };

    const onSelectHandler = (value: string, { data }: OptionData | OptionGroupData) => {
        selectValue(data);
        changeState(prev => ({ ...prev, value }));
    };

    const onBlurHandler = (e: React.FocusEvent<HTMLInputElement>) => {
        const currState = stateRef.current;
        onBlur(e);

        if (clearValueOnBlur && !currState.options.length && currState.selectedElem) {
            return selectValue(null);
        }

        if (keyForCompareSelect && !currState.selectedElem) {
            if (selectExactValueOnBlur) {
                const stateValue = currState.value.trim().toLowerCase();
                const exactElem = stateValue && currState.options.find(
                    ({ [keyForCompareSelect]: optionValue }) => (optionValue ?? '' as any).toLowerCase() === stateValue,
                );

                if (exactElem) {
                    const inputValue = getOptionValue(exactElem, renderOptionStringValue);
                    onSelectHandler(inputValue, {
                        key: 'selectedExactOnBlur',
                        value: inputValue,
                        label: getOptionLabel(exactElem, currState.value),
                        data: exactElem,
                    });
                }
            }

            if (selectFirstValueOnBlur && currState.options.length) {
                const [firstOption] = currState.options;
                const inputValue = getOptionValue(firstOption, renderOptionStringValue);
                onSelectHandler(inputValue, {
                    key: 'selectFirstOnBlur',
                    value: inputValue,
                    label: getOptionLabel(firstOption, firstOption[keyForCompareSelect] as any),
                    data: firstOption,
                });
            }
        }
    };

    const selectOptions: AutoCompleteOption<DataType>[] = state.options.map((el, idx) => ({
        label: getOptionLabel(el, state.value, renderOptionItemLabel),
        value: getOptionValue(el, renderOptionStringValue),
        key: el.id ?? idx,
        data: el,
    }));

    return (
        <>
            <AutoComplete
                {...restProps}
                className={cn(
                    className,
                    styles.autocompleteInput,
                    { [styles.hasError]: !!error },
                    { [styles.hideSuffix]: !!state.value },
                )}
                dropdownClassName={styles.autocompleteDropdown}
                dropdownMatchSelectWidth={false}
                options={selectOptions}
                filterOption={false}
                notFoundContent={!state.value || searchCondition(state.value) || loading ? null : 'Ничего не найдено'}
                onSearch={onSearchHandler}
                onSelect={onSelectHandler}
                onBlur={onBlurHandler}
                value={state.value}
                allowClear
                clearIcon={<Cross />}
                disabled={disabled}
            >
                <Input
                    placeholder={placeholder}
                    suffix={<SearchOutlined className={styles.suffix} />}
                    maxLength={inputMaxLength}
                />
            </AutoComplete>
            {!!error && <div className={styles.formError}>{error}</div>}
        </>
    );
};

export default AutoCompleteComponent;

function getOptionLabel<DataType extends { label?: ReactNode; }>(
    el: DataType,
    stateValue: string,
    renderFunc?: AutoCompleteComponentProps<DataType>['renderOptionItemLabel'],
): ReactNode {
    return renderFunc?.(el, stateValue) ?? <div>{el.label}</div>;
}

function getOptionValue<DataType extends { value?: string; } | string>(
    el: DataType | string | undefined,
    renderFunc: AutoCompleteComponentProps<DataType>['renderOptionStringValue'],
) {
    if (typeof el === 'string') {
        return el;
    }
    return !el ? '' : renderFunc?.(el) ?? el.value ?? '';
}
