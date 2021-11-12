import { BundleCreateDto, BundleDto } from '@types';
import { arrayToObject } from '@utils/helper';
import { normalizedBundleDto } from '../BundleForm/Bundle.utils';
import { BundleInitialValue } from '../types';

export function getDataForAssociationCreate(groupValue: BundleInitialValue & Partial<BundleDto>): BundleCreateDto {
    const { type, name, mainCampaignId } = groupValue;

    return { type: type!, name, mainCampaignId };
}

export function normalizeAssociationData(associationData: BundleDto) {
    const { texts, banners, links } = associationData || {};
    const data = links.reduce(
        (prev: normalizedBundleDto[], { banners, texts, id, campaignId }) => [
            ...prev,
            { banners: arrayToObject(banners, 'type', 'url'), texts: arrayToObject(texts, 'type', 'value'), id, campaignId },
        ],
        [],
    );
    const link = links.find(({ mainCampaignId }) => mainCampaignId);

    return {
        texts: arrayToObject(texts, 'type', 'value'),
        banners: arrayToObject(banners, 'type', 'url'),
        campaignIdList: associationData.links.reduce((prev: number[], { campaignId }) => ([...prev, campaignId]), []),
        name: associationData.name,
        type: associationData.type,
        deleted: associationData.deleted,
        mainCampaignId: link?.mainCampaignId || null,
        links: data,
    };
}
