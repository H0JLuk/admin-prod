export const STEP = 'Шаг';
export const CANCEL = 'Отменить';
export const NEXT = 'Далее';
export const COMPLETE = 'Готово';
export const IMAGE = 'image';
export const BANNER_REQUEST = 'bannerRequest';
export const APPLICATION_JSON_TYPE = 'application/json';
export const allStep = 3;

export const modes = {
    create: 'create',
    edit: 'edit',
};

export const steps = {
    main_info: 1,
    textAndBanners: 2,
    visibility: 3
};

export const pageTypes = {
    present: 'PRESENT',
    normal: 'NORMAL',
};

export const modsTitle = {
    create: 'Новая промо-кампания',
    edit: 'Редактирование промо-кампании',
};

export const imgTypes = {
    card: 'CARD',
    logo_main: 'LOGO_MAIN',
    logo_icon: 'LOGO_ICON',
    screen: 'SCREEN',
    logo_secondary: 'LOGO_SECONDARY',
};

export const textTypes = {
    excursionConditions: 'excursionConditions',
    excursionTitleQR: 'excursionTitleQR',
    giftTextOption: 'giftTextOption',
    giftText: 'giftText',
    rules: 'RULES',
    header: 'HEADER',
    description: 'DESCRIPTION',
};

export const bannerTypes = {
    main_banner: 'main_banner',
    presents_main_banner: 'presents_main_banner',
    logo_on_screen_with_phone: 'logo_on_screen_with_phone',
    landing: 'landing',
    logo_on_screen_with_qr_code: 'logo_on_screen_with_qr_code',
    presents_scan_icon: 'presents_scan_icon',
    presents_main_logo_1: 'presents_main_logo_1',
};

export const promoCampaignTextTypes = {
    [textTypes.excursionConditions]: textTypes.rules,
    [textTypes.excursionTitleQR]: textTypes.header,
    [textTypes.giftText]: textTypes.header,
    [textTypes.giftTextOption]: textTypes.description,
};

export const promoCampaignBannerTypes = {
    [bannerTypes.main_banner]: imgTypes.card,
    [bannerTypes.presents_main_banner]: imgTypes.card,
    [bannerTypes.logo_on_screen_with_phone]: imgTypes.logo_secondary,
    [bannerTypes.landing]: imgTypes.screen,
    [bannerTypes.logo_on_screen_with_qr_code]: imgTypes.logo_main,
    [bannerTypes.presents_scan_icon]: imgTypes.logo_icon,
    [bannerTypes.presents_main_logo_1]: imgTypes.logo_main,
};

