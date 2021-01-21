import React, { useState, useCallback } from 'react';
import PropTypes from 'prop-types';
import cn from 'classnames';
import debounce from 'lodash/debounce';
import { AutoComplete, Input } from 'antd';
import { SearchOutlined } from '@ant-design/icons';
import AutocompleteOptionLabel from './AutocompleteOptionLabel';
import { createSearchDataAndPassLocation, getResultsByTextAndType } from './AutocompleteHelper';
import { getStringOptionValue } from '../../../utils/utils';

import { ReactComponent as Cross } from '../../../static/images/cross.svg';

import styles from './AutocompleteLocationAndSalePoint.module.css';

const LOCATION_FIELD = {
    name: 'location',
    label: 'Локация',
    placeholder: 'Область, город...',
};

const SALE_POINT_FIELD = {
    name: 'salePoint',
    label: 'Точка продажи',
    placeholder: 'Отделение ВСП',
};

function AutocompleteLocationAndSalePoint({
    colClassName,
    locationPlaceholder = LOCATION_FIELD.placeholder,
    locationLabel = LOCATION_FIELD.label,
    locationLabelClassNames = '',
    salePointPlaceholder = SALE_POINT_FIELD.placeholder,
    salePointLabel = SALE_POINT_FIELD.label,
    salePointLabelClassNames = '',
    locationDisabled = false,
    salePointDisabled = false,
    highlightClassName = styles.highlight,
    onLocationChange,
    onSalePointChange,
    initialLocationValue = '',
    initialSalePointValue = '',
    autoFocusLocation = true,
    locationId,
    error = {},
}) {
    const [state, setState] = useState({
        searchLocation: {
            value: initialLocationValue,
            results: [],
        },
        searchSalePoint: {
            value: initialSalePointValue,
            results: [],
        },
    });

    /** @type {(searchValue: string, typeSearch: 'searchLocation' | 'searchSalePoint', newLocationId: number) => Promise<void>} */
    const getSearchResults = useCallback(async (searchValue, typeSearch = 'searchLocation', newLocationId = locationId) => {
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

    /** @type {(searchValue: string, typeSearch: 'searchLocation' | 'searchSalePoint') => void} */
    const search = useCallback((searchValue, typeSearch = 'searchLocation') => {
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
        },
        [getResultsDebounced, state.searchSalePoint.value]
    );

    const handleSearchLocation = useCallback((searchValue) => {
            if (!searchValue) {
                onLocationChange(null);
            }

            search(searchValue, 'searchLocation');
        },
        [onLocationChange, search]
    );

    const handleSearchSalePoint = useCallback((searchValue) => {
            if (!searchValue) {
                onSalePointChange(null);
            }

            search(searchValue, 'searchSalePoint');
        },
        [onSalePointChange, search]
    );

    const handleSelectLocationOption = useCallback((value, location) => {
            const { data } = location;

            if (!state.searchSalePoint.value) {
                getSearchResults('', 'searchSalePoint', data.id);
            }

            onLocationChange(data);
            setState((state) => ({
                ...state,
                searchLocation: { ...state.searchLocation, value },
            }));
        },
        [onLocationChange, state.searchSalePoint.value, getSearchResults]
    );

    const handleSelectSalePointOption = useCallback((value, { data: salePoint, data: { location } }) => {
            const { location: locationData, searchLocation } = createSearchDataAndPassLocation(location, locationId);

            if (locationData) {
                onLocationChange(locationData);
            }

            onSalePointChange(salePoint);
            setState((state) => ({
                ...state,
                searchSalePoint: { ...state.searchSalePoint, value },
                searchLocation: searchLocation ? searchLocation : state.searchLocation,
            }));
        },
        [onSalePointChange, onLocationChange, locationId]
    );

    /**
     * @param {'searchLocation' | 'searchSalePoint'} type
     */
    const renderOptionLabelByType = ({ name, parentName }, type) => (
        <AutocompleteOptionLabel
            name={ name }
            parentName={ parentName }
            highlightValue={ state[type]?.value }
            highlightClassName={ highlightClassName }
        />
    );

    const { searchLocation, searchSalePoint } = state;
    const locationOptions = searchLocation.results.map((el) => ({
        label: renderOptionLabelByType(el, 'searchLocation'),
        value: getStringOptionValue(el),
        data: el,
    }));

    const salePointOptions = searchSalePoint.results.map((el) => ({
        label: renderOptionLabelByType(el, 'searchSalePoint'),
        value: el.name,
        data: el,
    }));

    const colClassNames = cn(styles.formColumn, colClassName);

    return (
        <>
            <div className={ colClassNames }>
                <div className={ cn(styles.formLabel, locationLabelClassNames) }>
                    <label htmlFor="rc_select_0">{ locationLabel }</label>
                </div>
                <div className={ styles.inputWrapper }>
                    <AutoComplete
                        className={ cn(
                            styles.autocompleteInput,
                            { [styles.hasError]: error.location },
                            { [styles.hideSuffix]: !!searchLocation.value }
                        ) }
                        dropdownClassName={ styles.autocompleteDropdown }
                        dropdownMatchSelectWidth={ false }
                        options={ locationOptions }
                        filterOption={ false }
                        notFoundContent={ null }
                        autoFocus={ autoFocusLocation }
                        onSearch={ handleSearchLocation }
                        onSelect={ handleSelectLocationOption }
                        value={ searchLocation.value }
                        allowClear
                        clearIcon={ <Cross /> }
                        disabled={ locationDisabled }
                    >
                        <Input
                            placeholder={ locationPlaceholder }
                            name={ LOCATION_FIELD.name }
                            suffix={ <SearchOutlined className={ styles.suffix } /> }
                        />
                    </AutoComplete>
                    { !!error.location && <div className={ styles.formError }>{ error.location }</div> }
                </div>
            </div>
            <div className={ colClassNames }>
                <div className={ cn(styles.formLabel, salePointLabelClassNames) }>
                    <label htmlFor="rc_select_1">{ salePointLabel }</label>
                </div>
                <div>
                    <AutoComplete
                        className={ cn(
                            styles.autocompleteInput,
                            { [styles.hasError]: error.salePoint },
                            { [styles.hideSuffix]: !!searchSalePoint.value }
                        ) }
                        dropdownClassName={ styles.autocompleteDropdown }
                        dropdownMatchSelectWidth={ false }
                        options={ salePointOptions }
                        filterOption={ false }
                        notFoundContent={ null }
                        onSearch={ handleSearchSalePoint }
                        onSelect={ handleSelectSalePointOption }
                        value={ searchSalePoint.value }
                        allowClear
                        clearIcon={ <Cross /> }
                        disabled={ salePointDisabled }
                    >
                        <Input
                            placeholder={ salePointPlaceholder }
                            name={ SALE_POINT_FIELD.name }
                            suffix={ <SearchOutlined className={ styles.suffix } /> }
                        />
                    </AutoComplete>
                    { !!error.salePoint && <div className={ styles.formError }>{ error.salePoint }</div> }
                </div>
            </div>
        </>
    );
}

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
    onLocationChange: () => {},
    onSalePointChange: () => {},
};

export default AutocompleteLocationAndSalePoint;