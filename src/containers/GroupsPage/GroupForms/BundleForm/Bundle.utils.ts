import { BundleDto, BundleLinksFormDto } from '@types';
import { arrayToObject } from '@utils/helper';
import { LinksCreateDto } from '..';
import { BundleGroupDto } from '../types';

export type normalizedBundleDto = {
    banners: { [key: string]: string; };
    texts: { [key: string]: string; };
    id: number;
    campaignId: number;
};


export function normalizeBundle(bundleData: BundleDto) {
    const { texts: bundleTexts, banners: bundleBanners, links } = bundleData || {};

    const data = links.reduce(
        (prev: normalizedBundleDto[], { banners, texts, id, campaignId, settings }) => [
            ...prev,
            {
                banners: arrayToObject(banners, 'type', 'url'),
                texts: arrayToObject(texts, 'type', 'value'),
                id,
                campaignId,
                displayLogoOnBundle: settings?.display_logo_on_bundle as boolean,
            },
        ],
        [],
    );

    return {
        active: bundleData.active,
        texts: arrayToObject(bundleTexts, 'type', 'value'),
        banners: arrayToObject(bundleBanners, 'type', 'url'),
        campaignIdList: bundleData.links.reduce((prev: number[], { campaignId }) => [...prev, campaignId], []),
        name: bundleData.name,
        type: bundleData.type,
        deleted: bundleData.deleted,
        links: data,
        externalId: bundleData.externalId,
    };
}

export function getDataForBundleCreate(groupValue: BundleGroupDto) {
    const { type, active, name, externalId } = groupValue;

    return { type, active, name, externalId };
}

export function getDataForBundleLinkCreate(linkValues: BundleLinksFormDto[]): LinksCreateDto[] {
    return linkValues.map((link) => {
        const { displayLogoOnBundle, ...rest } = link;
        const settings = { display_logo_on_bundle: displayLogoOnBundle };
        return { ...rest, settings };
    });
}
