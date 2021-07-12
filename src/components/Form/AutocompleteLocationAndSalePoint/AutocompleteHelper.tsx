import { LocationDto, SalePointDto, SearchType } from '@types';
import { getSalePointsByText } from '@apiServices/promoCampaignService';
import { getStringOptionValue } from '@utils/utils';
import { getLocationsByText } from '@apiServices/locationService';

export function getResultsByTextAndType<T extends SearchType>(
    searchValue: string,
    typeSearch: T,
    locationId?: number
): T extends 'searchLocation' ? Promise<LocationDto[]> : Promise<SalePointDto[]>;
// eslint-disable-next-line no-redeclare
export function getResultsByTextAndType(
    searchValue: string,
    typeSearch: SearchType = 'searchLocation',
    locationId?: number,
) {
    switch (typeSearch) {
        case 'searchLocation':
            return getLocationsByText(searchValue);
        case 'searchSalePoint':
            return getSalePointsByText(searchValue, locationId);
        default:
            throw Error('Incorrect `typeSearch` param');
    }
}

export function createSearchDataAndPassLocation(location: LocationDto, locationExist = false) {
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
