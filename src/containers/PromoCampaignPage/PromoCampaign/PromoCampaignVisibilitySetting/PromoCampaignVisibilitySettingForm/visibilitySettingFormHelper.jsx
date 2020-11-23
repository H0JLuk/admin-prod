import React from 'react';
import { getLocationsByText, getSalePointsByText } from '../../../../../api/services/promoCampaignService';
import styles from './PromoCampaignVisibilitySettingForm.module.css';

/**
 * @param {string} searchValue
 * @param {'searchLocation' | 'searchSalePoint'} typeSearch
 */
export function getResultsByTextAndType(searchValue, typeSearch = 'searchLocation') {
    switch (typeSearch) {
        case 'searchLocation':
            return getLocationsByText(searchValue);
        case 'searchSalePoint':
            return getSalePointsByText(searchValue);
        default:
            throw Error('Incorrect `typeSearch` param');
    }
}

export function highlightSearchingText(value = '', searchValue = '') {
    if (!searchValue || !value) {
        return <span>{value}</span>;
    }

    const newValue = [];
    const index = value
        .trim()
        .toLocaleUpperCase()
        .indexOf(
            searchValue
                .trim()
                .toLocaleUpperCase()
            );

    if (index + 1) {
        newValue.push(value.substring(0, index));
        newValue.push(
            <span
                key={ index }
                className={ styles.highlight }
            >
                {value.substring(index, index + searchValue.length)}
            </span>
        );
        newValue.push(value.substring(index + searchValue.length));
    } else {
        newValue.push(value);
    }

    return <span>{newValue}</span>;
}

export function createSearchDataAndPassLocation(location) {
    if (!location) {
        return {};
    }

    return {
        location,
        searchLocation: {
            value: getStringOptionValue(location),
            results: [location],
            error: '',
        }
    };
}

export function getStringOptionValue({ parentName = '', name = '' } = {}) {
    if (!parentName) {
        return name;
    }

    return [parentName, name].join(', ');
}
