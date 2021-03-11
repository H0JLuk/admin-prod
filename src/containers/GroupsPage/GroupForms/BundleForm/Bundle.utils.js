

export function arrayToObject(array, keyForKey, keyForValue) {
    return array.reduce((result, item) => ({ ...result, [item[keyForKey]]: item[keyForValue] }), {});
}

export function normalizeBundle(bundleData) {

    const { texts, banners, links } = bundleData || {};

    const data = links.reduce((prev, { banners, texts, id, campaignId }) => [
        ...prev,
        {
            banners: arrayToObject(banners, 'type', 'url'),
            texts: arrayToObject(texts, 'type', 'value'),
            id,
            campaignId,
        },
    ], []);

    return {
        active: bundleData.active,
        texts: arrayToObject(texts, 'type', 'value'),
        banners: arrayToObject(banners, 'type', 'url'),
        campaignIdList: bundleData.links.reduce((prev, { campaignId }) => ([...prev, campaignId]), []),
        name: bundleData.name,
        type: bundleData.type,
        deleted: bundleData.deleted,
        links: data,
    };
}

export function getDataForBundleCreate(groupValue) {
    const { type, active, name } = groupValue;

    return { type, active, name };
}