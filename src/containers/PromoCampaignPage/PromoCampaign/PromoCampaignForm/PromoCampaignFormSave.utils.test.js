import {
    deleteText,
    filterBanner,
} from './PromoCampaignFormSave.utils';
import {
    promoCampaignBannerArray,
    promoCampaignTestData,
    promoCampaignTextsArray,
} from '../../../../../__tests__/constants';

describe('test `PromoCampaignFormSave.utils` functions', () => {

    it('test `filterBanner` function', () => {
        expect(
            filterBanner(promoCampaignTestData, [57, 61], promoCampaignTextsArray)
        ).toEqual({
            ...promoCampaignTestData,
            texts: [],
            banners: [],
        });

        expect(
            filterBanner(promoCampaignTestData, [57], [promoCampaignTextsArray[1]])
        ).toEqual({
            ...promoCampaignTestData,
            texts: [
                promoCampaignTextsArray[0],
            ],
            banners: [
                promoCampaignBannerArray[1],
            ],
        });
    });

    it('test `deleteText` function', () => {
        expect(
            deleteText(promoCampaignTestData, 79)
        ).toEqual({
            ...promoCampaignTestData,
            texts: [
                promoCampaignTextsArray[0],
            ],
        });
    });

});
