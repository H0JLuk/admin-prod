import { getLocationsByText, getSalePointsByText } from '../../../api/services/promoCampaignService';
import { getStringOptionValue } from '../../../utils/utils';

/**
 * @param {string} searchValue
 * @param {'searchLocation' | 'searchSalePoint'} typeSearch
 */
export function getResultsByTextAndType(searchValue, typeSearch = 'searchLocation', locationId) {
    switch (typeSearch) {
        case 'searchLocation':
            return getLocationsByText(searchValue);
        case 'searchSalePoint':
            return getSalePointsByText(searchValue, locationId);
        default:
            throw Error('Incorrect `typeSearch` param');
    }
}

export function createSearchDataAndPassLocation(location, locationExist = false) {
    if (!location || locationExist) {
        return {};
    }

    return {
        location,
        searchLocation: {
            value: getStringOptionValue(location),
            results: [location],
        },
    };
}
