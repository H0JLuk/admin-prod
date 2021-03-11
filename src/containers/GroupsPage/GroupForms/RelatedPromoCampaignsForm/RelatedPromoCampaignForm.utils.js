
export function getDataForAssociationCreate(groupValue) {
    const { type, name, mainCampaignId } = groupValue;

    return { type, name, mainCampaignId };
}

export function arrayToObject(array, keyForKey, keyForValue) {
    return array.reduce((result, item) => ({ ...result, [item[keyForKey]]: item[keyForValue] }), {});
}

export function normalizeAssociationData(associationData) {

    const { texts, banners, links } = associationData || {};

    const data = links.reduce(
        (prev, { banners, texts, id, campaignId }) => [
            ...prev,
            { banners: arrayToObject(banners, 'type', 'url'), texts: arrayToObject(texts, 'type', 'value'), id, campaignId },
        ],
        []
    );
    const link = links.find(({ mainCampaignId }) => mainCampaignId);

    return {
        texts: arrayToObject(texts, 'type', 'value'),
        banners: arrayToObject(banners, 'type', 'url'),
        campaignIdList: associationData.links.reduce((prev, { campaignId }) => ([...prev, campaignId]), []),
        name: associationData.name,
        type: associationData.type,
        deleted: associationData.deleted,
        mainCampaignId: link?.mainCampaignId || null,
        links: data,
    };
}