import { getLabel } from '@components/LabelWithTooltip';
import { TOOLTIP_TEXT_FOR_URL_LABEL } from '@constants/jsxConstants';

const DATE_PICKER_PLACEHOLDER: [string, string] = ['дд.мм.гг', 'дд.мм.гг'];
const urlPlaceholder = 'URL';

export const PROMO_CAMPAIGN_NAME = {
    name: 'name',
    label: 'Название промо-кампании',
    placeholder: 'Например: Промо-кампания СберМаркет',
};

export const PROMO_CAMPAIGN_CATEGORY = {
    name: 'categoryIdList',
    label: 'Категории',
    placeholder: 'Выберите категорию',
};

export const SHOW_VIDEO_TOUR = {
    name: ['settings', 'disabled_banner_types'],
    label: 'Отображать видеоэкскурсию',
};

export const PROMO_CAMPAIGN_URL = {
    name: 'webUrl',
    label: getLabel('Ссылка на промо-кампанию', TOOLTIP_TEXT_FOR_URL_LABEL),
    placeholder: urlPlaceholder,
};

export const URL_SOURCE = {
    name: ['settings', 'priority_on_web_url'],
    label: 'Источник ссылки',
    buttonsLabel: {
        DZO: 'ДЗО',
        PROMO_CAMPAIGN: 'Промо-кампания',
    },
    buttonsValue: {
        DZO: 'DZO',
        PROMO_CAMPAIGN: 'PROMO_CAMPAIGN',
    },
};

export const SHOW_GO_TO_LINK = {
    name: ['settings', 'alternative_offer_mechanic'],
    label: 'Отображать кнопку "Перейти на сайт"',
};

export const DZO = {
    name: 'dzoId',
    label: 'ДЗО',
    placeholder: 'Выбрать',
};

export const ACTIVE_PERIOD = {
    name: 'datePicker',
    label: 'Период действия',
    placeholder: DATE_PICKER_PLACEHOLDER,
};

export const SHOW_ONLY_IN_BUNDLE = {
    name: 'standalone',
    label: 'Отображать только в составе бандла',
};

export const TYPE_PROMO_CODE = {
    name: 'promoCodeType',
    label: 'Тип промокода',
};

export const EXTERNAL_ID = {
    name: 'externalId',
    label: 'Внешний ID',
    placeholder: 'Введите внешний ID',
    duplicateError: 'Введенный внешний ID уже используется в другой промо-кампании',
};

export const STATUS = {
    name: 'active',
    label: {
        ON: 'Промо-кампания включена',
        OFF: 'Промо-кампания отключена',
    },
    description: {
        ON: 'Пользователи видят промо-кампанию',
        OFF: 'Пользователи не видят промо-кампанию',
    },
};

export const CHECKOUT_SALE = {
    name: 'saleEnabled',
    label: 'Оформить продажу',
};

export const PRODUCT_OFFER_ID = {
    name: 'productOfferingId',
    label: 'Идентификатор продуктового предложения',
    placeholder: 'Введите ID продуктового предложения',
    requiredError: 'Заполните поле идентификатор продуктового предложения, созданного в АС Продуктовый каталог.',
};

export const BEHAVIOR_TYPE = {
    name: 'behaviorType',
    label: 'Отображать QR-код',
};

export const DETAIL_BTN_TEXT = {
    name: ['settings', 'details_button_label'],
    label: 'Текст кнопки',
    placeholder: 'Детали',
};

export const DETAIL_BTN_URL = {
    name: ['settings', 'details_button_url'],
    label: 'Ссылка для кнопки',
    placeholder: urlPlaceholder,
};

export const PROMO_CAMPAIGN_SHOW = {
    name: 'appCode',
    label: 'Витрина, в которой показывать промо-кампанию',
    placeholder: 'Выберите витрину',
};

export const PROMO_CAMPAIGN_TYPE = {
    name: 'type',
    label: 'Тип промо-кампании',
};

export const OFFER_DURATION = {
    name: 'offerDuration',
};
