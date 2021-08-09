export type KeysMatching<T, V> = {
    [K in keyof T]-?: T[K] extends V ? K : never;
}[keyof T];

export type KeysWithString<T> = KeysMatching<T, string | null>;

export * from './PromoCampaign';
export * from './Api';
export * from './Audit';
export * from './User';
export * from './LocationAndSalePoint';
export * from './VisibilitySettings';
export * from './Category';
export * from './Dzo';
export * from './ClientApp';
export * from './Bundle';
export * from './Banner';
export * from './BannerText';
export * from './PromoCode';
export * from './Presentation';
export * from './ClientAppSettings';
export * from './Consent';
export * from './BusinessRole';
