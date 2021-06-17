import { BundleDto } from '@types';
import { arrayToObject } from '@utils/helper';
import { BundleGroupDto } from '../types';

export type normalizedBundleDto = {
    banners: { [key: string]: string; };
    texts: { [key: string]: string; };
    id: number;
    campaignId: number;
};


export function normalizeBundle(bundleData: BundleDto) {
    const { texts, banners, links } = bundleData || {};

    const data = links.reduce(
        (prev: normalizedBundleDto[], { banners, texts, id, campaignId }) => [
            ...prev,
            {
                banners: arrayToObject(banners, 'type', 'url'),
                texts: arrayToObject(texts, 'type', 'value'),
                id,
                campaignId,
            },
        ],
        []
    );

    return {
        active: bundleData.active,
        texts: arrayToObject(texts, 'type', 'value'),
        banners: arrayToObject(banners, 'type', 'url'),
        campaignIdList: bundleData.links.reduce((prev: number[], { campaignId }) => [...prev, campaignId], []),
        name: bundleData.name,
        type: bundleData.type,
        deleted: bundleData.deleted,
        links: data,
    };
}

export function getDataForBundleCreate(groupValue: BundleGroupDto) {
    const { type, active, name } = groupValue;

    return { type, active, name };
}
