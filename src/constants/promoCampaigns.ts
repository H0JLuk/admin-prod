const PROMO_CAMPAIGNS = {
    NORMAL: {
        value: 'NORMAL',
        label: 'Экскурсия',
    },
    PRESENT: {
        value: 'PRESENT',
        label: 'Подарки',
    },
    LANDING: {
        value: 'landing',
        label: 'Лендинг',
    },
};

export type PromoCampaignTypes = keyof typeof PROMO_CAMPAIGNS;

export default PROMO_CAMPAIGNS;

export const DEFAULT_OFFER_DURATION = 90;
