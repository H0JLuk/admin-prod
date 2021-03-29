
export const TYPES = {
    IDEA: 'IDEA',
    ASSOCIATION: 'ASSOCIATION',
};

export const TITLE = {
    BUNDLE: 'Бандлы',
    PROMO_CAMPAIGNS: 'Связанные промо-кампании',
    MODAL_TITLE: 'Вы уверены что хотите удалить эти группы ?',
    MODAL_SUCCESS_TITLE: 'Результат удаления групп',
    EMPTY_BUNDLES: 'Нет созданных бандлов',
    EMPTY_PROMO_CAMPAIGNS: 'Нет созданных связанных промо-кампаний',
};

export const PRE_TITLE = {
    CREATE_BUNDLE: 'Создайте первый бандл прямо сейчас',
    CREATE_PROMO_CAMPAIGN: 'Создайте первую связанную промо-кампанию прямо сейчас',
};

export const BUTTON = {
    ADD: 'Добавить',
    CANCEL: 'Отменить',
    CREATE: 'Создать',
    CHOOSE: 'Выбрать',
    CHOOSE_ALL: 'Выбрать все',
    CHOOSE_ALL_REMOVE: 'Отменить выбор',
    DELETE: 'Удалить',
};

export const SEARCH_INPUT = {
    PROMO_SEARCH: 'Поиск промо-кампании',
    BUNDLE_SEARCH: 'Поиск бандла',
};

export const RESET_LABEL = 'По умолчанию';
export const DROPDOWN_SORT_MENU = [
    { name: 'name', label: 'По имени' },
    { name: 'linksLength', label: 'По кол-ву промо-кампаний' },
];

export const GROUP_OPTIONS = [
    { label: TITLE.BUNDLE, value: TYPES.IDEA },
    { label: TITLE.PROMO_CAMPAIGNS, value: TYPES.ASSOCIATION }
];

export const EMPTY_TABLE = {
    firstMessagePart: 'Мы ничего не нашли.',
    secondMessagePart: 'Измените значение поиска и попробуйте еще раз',
};

export const DIRECTION = {
    ASC: 'ASC',
    DESC: 'DESC',
};

export const sortByFieldKey = {
    NAME: 'name',
};

export const groupTypes = {
    BUNDLE: 'bundles',
    RELATED_CAMPAIGN: 'relatedCampaigns',
};