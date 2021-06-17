export type normalizedLinksDto<Dto = any> = Dto & {
    banners: Record<string, string>;
    texts: Record<string, string>;
    id: number;
    campaignId: number;
};
