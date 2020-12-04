import React, { useState, useCallback } from 'react';
import PropTypes from 'prop-types';
import cn from 'classnames';
import debounce from 'lodash/debounce';
import { AutoComplete, Input } from 'antd';
import AutocompleteOptionLabel from './AutocompleteOptionLabel';
import {
    createSearchDataAndPassLocation,
    getResultsByTextAndType,
} from './AutocompleteHelper';
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

const DEFAULT_LAYOUT = {
    labelCol: { span: 6 },
    wrapperCol: { span: 12 },
};

function AutocompleteLocationAndSalePoint({
    rowClassName,
    layout = DEFAULT_LAYOUT,
    locationPlaceholder = LOCATION_FIELD.placeholder,
    locationLabel = LOCATION_FIELD.label,
    salePointPlaceholder = SALE_POINT_FIELD.placeholder,
    salePointLabel = SALE_POINT_FIELD.label,
    locationHasError = false,
    salePointHasError = false,
    locationDisabled = false,
    salePointDisabled = false,
    highlightClassName = styles.highlight,
    onLocationChange,
    onSalePointChange,
    initialLocationValue = '',
    initialSalePointValue = '',
    autoFocusLocation = true,
    locationId,
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

    /**
     * @param {string} searchValue
     * @param {'searchLocation' | 'searchSalePoint'} typeSearch
     */
    const getSearchResults = useCallback(async (searchValue, typeSearch = 'searchLocation') => {
        try {
            const searchResult = await getResultsByTextAndType(searchValue, typeSearch, locationId);

            setState(state => ({
                ...state,
                [typeSearch]: {
                    ...state[typeSearch],
                    results: searchResult,
                }
            }));
        } catch (e) {
            console.error(e);
        }
    }, [locationId]);

    // eslint-disable-next-line react-hooks/exhaustive-deps
    const getResultsDebounced = useCallback(debounce(getSearchResults, 500), [getSearchResults]);

    /**
     * @param {string} searchValue
     * @param {'searchLocation' | 'searchSalePoint'} typeSearch
     */
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

        if (!searchValue || (searchValue.length < 2 && typeSearch === 'searchLocation')) {
            setState(state => ({
                ...state,
                [typeSearch]: {
                    value: searchValue,
                    results: [],
                }
            }));
            return;
        }

        getResultsDebounced(searchValue, typeSearch);
    }, [getResultsDebounced]);

    const handleSearchLocation = useCallback((searchValue) => {
        if (!searchValue) {
            onLocationChange(null);
        }

        search(searchValue, 'searchLocation');
    }, [onLocationChange, search]);

    const handleSearchSalePoint = useCallback((searchValue) => {
        if (!searchValue) {
            onSalePointChange(null);
        }

        search(searchValue, 'searchSalePoint');
    }, [onSalePointChange, search]);

    const handleSelectLocationOption = useCallback((value, location) => {
        const { data } = location;

        onLocationChange(data);
        setState((state) => ({
            ...state,
            searchLocation: { ...state.searchLocation, value },
        }));
    }, [onLocationChange]);

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
    }, [onSalePointChange, onLocationChange, locationId]);

    /**
     * @param {'searchLocation' | 'searchSalePoint'} type
     */
    const renderOptionLabelByType = ({ name, parentName }, type) => {
        return <AutocompleteOptionLabel
            name={ name }
            parentName={ parentName }
            highlightValue={ state[type]?.value }
            highlightClassName={ highlightClassName }
        />;
    };


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

    const rowClassNames = cn(styles.formRow, rowClassName);
    const leftColClassNames = cn(styles.formLeftCol, `ant-col ant-col-${layout.labelCol.span}`);

    return (
        <>
            <div className={ rowClassNames }>
                <div className={ leftColClassNames }>
                    <label htmlFor="rc_select_0">
                        { locationLabel }
                    </label>
                </div>
                <div className={ `ant-col ant-col-${layout.wrapperCol.span}` }>
                    <AutoComplete
                        className={ cn(styles.autocompleteInput, { [styles.hasError]: locationHasError }) }
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
                            size="large"
                        />
                    </AutoComplete>
                </div>
            </div>
            <div className={ rowClassNames }>
                <div className={ leftColClassNames }>
                    <label htmlFor="rc_select_1">
                        { salePointLabel }
                    </label>
                </div>
                <div className={ `ant-col ant-col-${layout.wrapperCol.span}` }>
                    <AutoComplete
                        className={ cn(styles.autocompleteInput, { [styles.hasError]: salePointHasError }) }
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
                            size="large"
                        />
                    </AutoComplete>
                </div>
            </div>
        </>
    );
}

AutocompleteLocationAndSalePoint.propTypes = {
    rowClassName: PropTypes.string,
    layout: PropTypes.shape({
        labelCol: PropTypes.shape({ span: PropTypes.number, offset: PropTypes.number }),
        wrapperCol: PropTypes.shape({ span: PropTypes.number, offset: PropTypes.number }),
    }),
    locationPlaceholder: PropTypes.string,
    locationLabel: PropTypes.string,
    salePointPlaceholder: PropTypes.string,
    salePointLabel: PropTypes.string,
    locationHasError: PropTypes.bool,
    salePointHasError: PropTypes.bool,
    locationDisabled: PropTypes.bool,
    salePointDisabled: PropTypes.bool,
    highlightClassName: PropTypes.string,
    onLocationChange: PropTypes.func.isRequired,
    onSalePointChange: PropTypes.func.isRequired,
    initialLocationValue: PropTypes.string,
    initialSalePointValue: PropTypes.string,
    autoFocusLocation: PropTypes.bool,
    locationId: PropTypes.number,
};

AutocompleteLocationAndSalePoint.defaultProps = {
    onLocationChange: () => {},
    onSalePointChange: () => {},
};

export default AutocompleteLocationAndSalePoint;
