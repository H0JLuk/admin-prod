
import { getLocationsByText } from '@apiServices/locationService';
import { getSalePointsByText } from '@apiServices/promoCampaignService';
import { getStringOptionValue } from '../../../utils/utils';
import {
    createSearchDataAndPassLocation,
    getResultsByTextAndType,
} from './AutocompleteHelper';


jest.mock('@apiServices/promoCampaignService', () => ({
    getSalePointsByText: jest.fn(),
}));

jest.mock('@apiServices/locationService', () => ({
    getLocationsByText: jest.fn(),
}));

jest.mock('../../../utils/utils', () => ({
    getStringOptionValue: jest.fn(),
}));

describe('AutocompleteLocationAndSalePoint helper test', () => {
    it('function getResultsByTextAndType should return location or salepoint', () => {
        const searchValue = 'searchValue';
        const typeSearch = {
            searchLocation: 'searchLocation',
            searchSalePoint: 'searchSalePoint',
        };
        const locationId = 1;

        getResultsByTextAndType(searchValue, typeSearch.searchLocation);

        expect(getLocationsByText).toBeCalled();
        expect(getLocationsByText).toBeCalledWith(searchValue);

        getResultsByTextAndType(
            searchValue,
            typeSearch.searchSalePoint,
            locationId
        );

        expect(getSalePointsByText).toBeCalled();
        expect(getSalePointsByText).toBeCalledWith(searchValue, locationId);

        expect(() =>
            getResultsByTextAndType(searchValue, 'error')
        ).toThrowError();
    });

    it('function createSearchDataAndPassLocation should correctly return dataObj ', () => {
        getStringOptionValue.mockImplementation((location) => [location]);

        const emptyObjectResult = createSearchDataAndPassLocation({}, true);
        expect(Object.keys(emptyObjectResult).length).toEqual(0);

        const location = 'location';

        const result = createSearchDataAndPassLocation(location, false);
        expect(result).toHaveProperty(location, location);
        expect(result.searchLocation).toHaveProperty('results', [location]);
        expect(result.searchLocation).toHaveProperty('value', [location]);
    });
});
