import React, { useState, useCallback, useRef } from 'react';
import PropTypes from 'prop-types';
import cn from 'classnames';
import debounce from 'lodash/debounce';
import noop from 'lodash/noop';
import { AutoComplete, Input } from 'antd';
import { SearchOutlined } from '@ant-design/icons';
import AutocompleteOptionLabel from './AutocompleteOptionLabel';
import { createSearchDataAndPassLocation, getResultsByTextAndType } from './AutocompleteHelper';
import { getStringOptionValue } from '@utils/utils';
import { LocationDto, SalePointDto, SearchType } from '@types';
import { OptionData, OptionGroupData } from 'rc-select/lib/interface';

import { ReactComponent as Cross } from '../../../static/images/cross.svg';

import styles from './AutocompleteLocationAndSalePoint.module.css';

export type AutocompleteLocationAndSalePointProps = {
    colClassName?: string;
    locationPlaceholder?: string;
    locationLabel?: string;
    locationLabelClassNames?: string;
    salePointPlaceholder?: string;
    salePointLabel?: string;
    salePointLabelClassNames?: string;
    locationDisabled?: boolean;
    salePointDisabled?: boolean;
    highlightClassName?: string;
    onLocationChange: (location: LocationDto | null) => void;
    onSalePointChange: (salePoint: SalePointDto | null) => void;
    initialLocationValue?: string;
    initialSalePointValue?: string;
    autoFocusLocation?: boolean;
    locationId?: number;
    error?: { location?: string; salePoint?: string; };
    columnMode?: boolean;
};

export type AutocompleteLocationAndSalePointState = {
    searchLocation: {
        value: string;
        results: LocationDto[];
    };
    searchSalePoint: {
        value: string;
        results: SalePointDto[];
    };
};

export interface LocationOption extends OptionData {
    data: LocationDto;
}

export interface SalePointOption extends OptionData {
    data: SalePointDto;
}

export type SelectedValues = {
    location: LocationDto | null;
    salePoint: SalePointDto | null;
};

export const LOCATION_FIELD = {
    name: 'location',
    label: 'Локация',
    placeholder: 'Область, город...',
};

export const SALE_POINT_FIELD = {
    name: 'salePoint',
    label: 'Точка продажи',
    placeholder: 'Отделение ВСП',
};

const AutocompleteLocationAndSalePoint: React.FC<AutocompleteLocationAndSalePointProps> = ({
    colClassName,
    locationPlaceholder = LOCATION_FIELD.placeholder,
    locationLabel = LOCATION_FIELD.label,
    locationLabelClassNames = '',
    salePointPlaceholder = SALE_POINT_FIELD.placeholder,
    salePointLabel = SALE_POINT_FIELD.label,
    salePointLabelClassNames = '',
    locationDisabled,
    salePointDisabled,
    highlightClassName = styles.highlight,
    onLocationChange,
    onSalePointChange,
    initialLocationValue = '',
    initialSalePointValue = '',
    autoFocusLocation = true,
    locationId,
    error = {},
    columnMode,
}) => {
    const [state, setState] = useState<AutocompleteLocationAndSalePointState>({
        searchLocation: {
            value: initialLocationValue,
            results: [],
        },
        searchSalePoint: {
            value: initialSalePointValue,
            results: [],
        },
    });
    const selectedValues = useRef<SelectedValues>({ location: null, salePoint: null });

    const changeLocation = (location: LocationDto | null) => {
        selectedValues.current = { ...selectedValues.current, location };
        onLocationChange(location);
    };

    const changeSalePoint = (salePoint: SalePointDto | null) => {
        selectedValues.current = { ...selectedValues.current, salePoint };
        onSalePointChange(salePoint);
    };

    const getSearchResults = useCallback(async (
        searchValue: string,
        typeSearch: SearchType = 'searchLocation',
        newLocationId: number | undefined = locationId,
    ) => {
        try {
            const searchResult = await getResultsByTextAndType(searchValue, typeSearch, newLocationId);

            setState((state) => ({
                ...state,
                [typeSearch]: {
                    ...state[typeSearch],
                    results: searchResult,
                },
            }));
        } catch (e) {
            console.error(e);
        }
    }, [locationId]);

    // eslint-disable-next-line react-hooks/exhaustive-deps
    const getResultsDebounced = useCallback(debounce(getSearchResults, 500), [getSearchResults]);

    const search = (searchValue: string, typeSearch: SearchType = 'searchLocation') => {
        if (typeSearch !== 'searchLocation' && typeSearch !== 'searchSalePoint') {
            throw Error('Incorrect `typeSearch` param');
        }

        setState(state => ({
            ...state,
            [typeSearch]: {
                ...state[typeSearch],
                value: searchValue,
            },
        }));

        if (typeSearch === 'searchLocation') {
            if (!searchValue && !state.searchSalePoint.value) {
                setState(state => ({
                    ...state,
                    searchSalePoint: {
                        ...state.searchSalePoint,
                        results: [],
                    },
                }));
            }

            if (searchValue.length < 2) {
                setState(state => ({
                    ...state,
                    [typeSearch]: {
                        value: searchValue,
                        results: [],
                    },
                }));
                return;
            }
        }

        getResultsDebounced(searchValue, typeSearch);
    };

    const handleSearchLocation = (searchValue: string) => {
        if (!searchValue) {
            changeLocation(null);
        }

        search(searchValue, 'searchLocation');
    };

    const handleSearchSalePoint = (searchValue: string) => {
        if (!searchValue) {
            changeSalePoint(null);
        }

        search(searchValue, 'searchSalePoint');
    };

    const handleSelectLocationOption = (value: string, option: OptionData | OptionGroupData) => {
        const { data } = option as LocationOption;

        if (!state.searchSalePoint.value) {
            getSearchResults('', 'searchSalePoint', data.id);
        }

        changeLocation(data);
        setState((state) => ({
            ...state,
            searchLocation: { ...state.searchLocation, value },
        }));
    };

    const handleSelectSalePointOption = (value: string, option: OptionData | OptionGroupData) => {
        const { data: salePoint, data: { location } } = option as SalePointOption;
        const { location: locationData, searchLocation } = createSearchDataAndPassLocation(location, typeof locationId === 'number');

        if (locationData) {
            changeLocation(locationData);
        }

        changeSalePoint(salePoint);
        setState((state) => ({
            ...state,
            searchSalePoint: { ...state.searchSalePoint, value },
            searchLocation: searchLocation ? searchLocation : state.searchLocation,
        }));
    };

    const handleBlurSalePoint = () => {
        const { searchSalePoint: { value } } = state;
        if (value.trim()) {
            const exactSalePoints = state.searchSalePoint.results.filter(({ name }) => name.toLowerCase() === value.toLowerCase());

            if (exactSalePoints.length) {
                const { salePoint } = selectedValues.current;
                const [firstExactElem] = exactSalePoints;

                if (salePoint?.name !== firstExactElem.name) {
                    const inputValue = `${firstExactElem.name}, ${firstExactElem.description}`;
                    handleSelectSalePointOption(inputValue, { data: firstExactElem } as any);
                }
            }
        }
    };

    const renderOptionLabelByType = ({ name, parentName }: LocationDto | SalePointDto, type: SearchType) => (
        <AutocompleteOptionLabel
            name={name}
            parentName={parentName}
            highlightValue={state[type]?.value}
            highlightClassName={highlightClassName}
        />
    );

    const { searchLocation, searchSalePoint } = state;
    const locationOptions: LocationOption[] = searchLocation.results.map((el) => ({
        label: renderOptionLabelByType(el, 'searchLocation'),
        value: getStringOptionValue(el),
        key: el.id,
        data: el,
    }));

    const salePointOptions: SalePointOption[] = searchSalePoint.results.map((el) => ({
        label: renderOptionLabelByType(el, 'searchSalePoint'),
        value: `${el.name}, ${el.description}`,
        key: el.id,
        data: el,
    }));

    const colClassNames = cn(styles.formColumn, colClassName);

    return (
        <>
            <div className={colClassNames}>
                <div className={cn(styles.formLabel, locationLabelClassNames)}>
                    <label htmlFor="rc_select_0">{locationLabel}</label>
                </div>
                <div className={cn(
                    styles.inputWrapper,
                    { [styles.inputWrapperColumn]: columnMode },
                )}>
                    <AutoComplete
                        className={cn(
                            styles.autocompleteInput,
                            { [styles.autocompleteInputColumn]: columnMode },
                            { [styles.hasError]: error.location },
                            { [styles.hideSuffix]: !!searchLocation.value },
                        )}
                        dropdownClassName={styles.autocompleteDropdown}
                        dropdownMatchSelectWidth={false}
                        options={locationOptions}
                        filterOption={false}
                        notFoundContent={null}
                        autoFocus={autoFocusLocation}
                        onSearch={handleSearchLocation}
                        onSelect={handleSelectLocationOption}
                        value={searchLocation.value}
                        allowClear
                        clearIcon={<Cross />}
                        disabled={locationDisabled}
                    >
                        <Input
                            placeholder={locationPlaceholder}
                            name={LOCATION_FIELD.name}
                            suffix={<SearchOutlined className={styles.suffix} />}
                        />
                    </AutoComplete>
                    {!!error.location && <div className={styles.formError}>{error.location}</div>}
                </div>
            </div>
            <div className={cn(colClassNames, { [styles.salePointColumn]: columnMode })}>
                <div className={cn(styles.formLabel, salePointLabelClassNames)}>
                    <label htmlFor="rc_select_1">{salePointLabel}</label>
                </div>
                <div>
                    <AutoComplete
                        className={cn(
                            styles.autocompleteInput,
                            { [styles.autocompleteInputColumn]: columnMode },
                            { [styles.hasError]: error.salePoint },
                            { [styles.hideSuffix]: !!searchSalePoint.value },
                        )}
                        dropdownClassName={styles.autocompleteDropdown}
                        dropdownMatchSelectWidth={false}
                        options={salePointOptions}
                        filterOption={false}
                        notFoundContent={null}
                        onSearch={handleSearchSalePoint}
                        onSelect={handleSelectSalePointOption}
                        onBlur={handleBlurSalePoint}
                        value={searchSalePoint.value}
                        allowClear
                        clearIcon={<Cross />}
                        disabled={salePointDisabled}
                    >
                        <Input
                            placeholder={salePointPlaceholder}
                            name={SALE_POINT_FIELD.name}
                            suffix={<SearchOutlined className={styles.suffix} />}
                        />
                    </AutoComplete>
                    {!!error.salePoint && <div className={styles.formError}>{error.salePoint}</div>}
                </div>
            </div>
        </>
    );
};

AutocompleteLocationAndSalePoint.propTypes = {
    colClassName: PropTypes.string,
    locationPlaceholder: PropTypes.string,
    locationLabel: PropTypes.string,
    locationLabelClassNames: PropTypes.string,
    salePointPlaceholder: PropTypes.string,
    salePointLabel: PropTypes.string,
    salePointLabelClassNames: PropTypes.string,
    locationDisabled: PropTypes.bool,
    salePointDisabled: PropTypes.bool,
    highlightClassName: PropTypes.string,
    onLocationChange: PropTypes.func.isRequired,
    onSalePointChange: PropTypes.func.isRequired,
    initialLocationValue: PropTypes.string,
    initialSalePointValue: PropTypes.string,
    autoFocusLocation: PropTypes.bool,
    locationId: PropTypes.number,
    error: PropTypes.object,
};

AutocompleteLocationAndSalePoint.defaultProps = {
    onLocationChange: noop,
    onSalePointChange: noop,
};

export default AutocompleteLocationAndSalePoint;
