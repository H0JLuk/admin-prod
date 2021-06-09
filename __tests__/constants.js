export const categoryListTestData = [
    {
        active: true,
        categoryDescription: null,
        categoryId: 0,
        categoryName: 'Test category Name 1',
        categoryUrl: 'www.test.categoryUrl.com',
    },
    {
        active: true,
        categoryDescription: null,
        categoryId: 1,
        categoryName: 'Test category Name 2',
        categoryUrl: 'www.test.categoryUrl2.com',
    },
];

export const promoCampaignBannerArray = [
    {
        id: 57,
        type: 'LOGO_MAIN',
        url: 'http://distributor-fs:8081/distributor-fs/file?path=greenday-presents/promocampaign/sberhealth/2/logo-main.svg',
    },
    {
        id: 61,
        type: 'CARD',
        url: 'http://distributor-fs:8081/distributor-fs/file?path=greenday-presents/promocampaign/sberhealth/2/card.jpg',
    }
];

export const promoCampaignTextsArray = [
    { id: 78, value: 'Скидка 300 ₽ при заказе от 500 ₽', type: 'HEADER' },
    { id: 79, value: 'Доставка забытого горошка для оливье за 15 мин', type: 'DESCRIPTION' },
];

export const promoCampaignTestData = {
    active: true,
    behaviorType: 'QrBehavior',
    clientApplicationDto: {
        code: 'greenday-presents',
        name: 'Витрина экосистемы с подарками',
        displayName: 'Витрина ВСП',
        id: 7,
        isDeleted: false,
    },
    id: 24,
    name: 'Промо-кампания Сбермаркет для витрины ВСП',
    dzoId: 3,
    dzoName: 'СберЗдоровье',
    externalId: null,
    startDate: '2021-02-12T21:00:00',
    finishDate: '2021-03-08T20:59:59.999',
    banners: promoCampaignBannerArray,
    links: [],
    offerDuration: 90,
    texts: promoCampaignTextsArray,
    categoryList: categoryListTestData,
    oneLinkAppUrl: null,
    settings: {
        priority_on_web_url: true,
        video_Url: 'http://localhost',
    },
    promoCodeType: 'PERSONAL',
    standalone: true,
    type: 'PRESENT',
    webUrl: 'https://www.promo.sberhealth.ru/vvo',
};

export const userTestData = {
    blocked: false,
    clientAppIds: [],
    id: 136,
    locationId: 137,
    locationName: 'Калининград',
    loginType: 'PASSWORD',
    personalNumber: '111111',
    role: 'User',
    salePointId: 887,
    salePointName: '055_8626_1236',
    tempPassword: true,
    tmpBlocked: false,
};

export const dzoApplicationsTestData = [
    {
        applicationId: 0,
        applicationType: 'IOS',
        applicationUrl: 'https://apps.apple.com/ru/app/id1369890634',
        deleted: false,
        dzoId: 0,
    },
    {
        applicationId: 1,
        applicationType: 'ANDROID',
        applicationUrl: 'https://play.google.com/store/apps/details/id1369890634',
        deleted: false,
        dzoId: 0,
    },
];

export const dzoListTestData = [
    {
        dzoId: 0,
        dzoName: 'Беру!',
        dzoCode: 'beru_code',
        dzoBannerList: [],
        applicationList: dzoApplicationsTestData,
        header: 'Скидки до -40% на покупку товаров.',
        logoUrl: 'http://distributor-fs:8081/distributor-fs/file?path=dzo/beru/beru@3x.png',
        screenUrl: 'http://distributor-fs:8081/distributor-fs/file?path=dzo/beru/invalid-name3x.jpg',
        webUrl: 'https://beru.ru',
        description: 'Простой поиск и дешевая покупка любых товаров онлайн у проверенных продавцов',
        deleted: true,
        cardUrl: 'http://distributor-fs:8081/distributor-fs/file?path=dzo/beru/card.png',
    },
    {
        dzoId: 3,
        dzoName: 'Сбермаркет',
        dzoCode: 'sbermarket_old',
        dzoBannerList: [],
        dzoApplicationsTestData: dzoApplicationsTestData.map(app => ({ ...app, dzoId: 3 })),
        header: 'Скидки до -40% на покупку продуктов онлайн с доставкой до двери.',
        logoUrl: 'http://distributor-fs:8081/distributor-fs/file?path=dzo/beru/beru@3x.png',
        screenUrl: 'http://distributor-fs:8081/distributor-fs/file?path=dzo/beru/invalid-name3x.jpg',
        webUrl: 'https://sbermarket.ru/',
        description: 'Простой поиск и дешевая покупка любых товаров онлайн у проверенных продавцов',
        deleted: false,
        cardUrl: 'http://distributor-fs:8081/distributor-fs/file?path=dzo/beru/card.png',
    },
    {
        dzoId: 70,
        dzoName: 'СберМобайл',
        dzoCode: 'sbermobile',
        dzoBannerList: [],
        dzoApplicationsTestData: dzoApplicationsTestData.map(app => ({ ...app, dzoId: 70 })),
        header: null,
        logoUrl: '',
        screenUrl: '',
        webUrl: 'https://sbermarket.ru/',
        description: null,
        deleted: false,
        cardUrl: '',
    },
];

export const clientAppTestData = {
    code: 'greenday-presents',
    displayName: 'Витрина ВСП',
    id: 6,
    isDeleted: false,
    name: 'Витрина экосистемы с подарками',
    orderNumber: 0,
};

export const clientAppListTestResponse = {
    list: [
        clientAppTestData,
        {
            code: 'greenday-presents',
            displayName: 'Витрина ВСП 2',
            id: 7,
            isDeleted: false,
            name: 'Витрина экосистемы с подарками 2',
            orderNumber: 1,
        }
    ],
};

export const settingDtoListTestData = {
    settingDtoList: [
        {
            key: 'tmp_block_time',
            value: '1800',
            clientAppCode: 'greenday-presents'
        },
        {
            key: 'ym_token',
            value: '55864828',
            clientAppCode: 'greenday-presents'
        },
        {
            key: 'promo_show_time',
            value: '10',
            clientAppCode: 'greenday-presents'
        },
        {
            key: 'privacy_policy',
            value: '64',
            clientAppCode: 'greenday-presents'
        },
    ],
};

export const doPropertiesSettingsTestData = {
    id: 6,
    code: 'greenday-presents',
    name: 'Витрина экосистемы с подарками',
    displayName: 'Витрина ВСП',

    tmp_block_time: '1800',
    ym_token: '55864828',
    promo_show_time: '10',
    privacy_policy: '64',
};

export const propertiesSettingsTestData = {
    doPropertiesSettingsTestData,
    name: 'Витрина экосистемы с подарками',
    mechanics: [
        'BUNDLE'
    ],
    login_types: [
        'PASSWORD',
        'SBOL_PRO'
    ],
    privacy_policy: 'Я, абонент номера мобильного телефона ${phoneNumber},  выражаю свое согласие ПАО Сбербанк (адрес: Российская Федерация, 117997, г. Москва, ул. Вавилова, д. 19) на обработку и хранение моих персональных данных (номера телефона, файлы cookie, сведения о действиях пользователя на сайте, сведения об оборудовании пользователя, дата и время сессии) в т.ч. с использованием метрических программ Яндекс.Метрика. В связи с предоставлением настоящего согласия Банк вправе без ограничения с использованием средств автоматизации осуществлять любые действия (операции) с моими персональными данными, включая сбор, запись, систематизацию, накопление, хранение, уточнение (обновление, изменение), извлечение, использование, обезличивание, блокирование, удаление, уничтожение, передачу (распространение, предоставление, доступ) персональных данных.',
    max_presents_number: '3',
    max_password_attempts: '3',
    home_page_header: 'Сбер изменился, чтобы стать еще ближе к вам',
    inactivity_time: '152',
    token_lifetime: '18001223',
    notification_types: undefined,
    tmp_block_time: '1800',
    id: 6,
    code: 'greenday-presents',
    displayName: 'Витрина ВСП',
};

export const settingsMapTestData = {
    tmp_block_time: '1800',
    mechanics: '["BUNDLE"]',
    login_types: '["PASSWORD", "SBOL_PRO"]',
    privacy_policy: 'Я, абонент номера мобильного телефона ${phoneNumber},  выражаю свое согласие ПАО Сбербанк (адрес: Российская Федерация, 117997, г. Москва, ул. Вавилова, д. 19) на обработку и хранение моих персональных данных (номера телефона, файлы cookie, сведения о действиях пользователя на сайте, сведения об оборудовании пользователя, дата и время сессии) в т.ч. с использованием метрических программ Яндекс.Метрика. В связи с предоставлением настоящего согласия Банк вправе без ограничения с использованием средств автоматизации осуществлять любые действия (операции) с моими персональными данными, включая сбор, запись, систематизацию, накопление, хранение, уточнение (обновление, изменение), извлечение, использование, обезличивание, блокирование, удаление, уничтожение, передачу (распространение, предоставление, доступ) персональных данных.',
    token_lifetime: '18001223',
    max_presents_number: '3',
    max_password_attempts: '3',
    home_page_header: 'Сбер изменился, чтобы стать еще ближе к вам',
    inactivity_time: '152',
};

export const visibilitySettingLocation = {
    id: 2046,
    name: 'Ростов',
    description: null,
    startDate: '2020-11-01',
    endDate: null,
    deleted: false,
    type: {
        id: 11,
        name: 'Город',
        description: null,
        startDate: '2020-01-01',
        endDate: null,
        priority: 6,
        deleted: false
    },
    parentName: 'Ярославская область'
};

export const visibilitySettingSalePoint = {
    id: 3163,
    name: '040_0017_0251',
    description: 'Доп.офис №0017/0251',
    startDate: '2020-01-12',
    endDate: null,
    deleted: false,
    type: {
        id: 3,
        name: 'ВСП',
        description: 'Внутреннее структурное подразделение',
        startDate: '2020-01-01',
        endDate: null,
        priority: 8,
        deleted: false
    },
    parentName: '0017',
    location: {
        id: 2046,
        name: 'Ростов',
        description: null,
        startDate: '2020-11-01',
        endDate: null,
        deleted: false,
        type: {
            id: 11,
            name: 'Город',
            description: null,
            startDate: '2020-01-01',
            endDate: null,
            priority: 6,
            deleted: false
        },
        parentName: 'Ярославская область'
    }
};

export const searchSalePointTestData = [
    {
        id: 886,
        name: '055_8626_1232',
        description: 'Доп.офис №8626/1232',
        startDate: '2020-01-11',
        endDate: null,
        deleted: false,
        type: {
            id: 3,
            name: 'ВСП',
            description: 'Внутреннее структурное подразделение',
            startDate: '2020-01-01',
            endDate: null,
            priority: 8,
            deleted: false,
        },
        parentName: '8626',
        location: {
            id: 137,
            name: 'Москва',
            description: null,
            startDate: '2020-11-01',
            endDate: null,
            deleted: false,
            type: {
                id: 11,
                name: 'Город',
                description: null,
                startDate: '2020-01-01',
                endDate: null,
                priority: 6,
                deleted: false,
            },
            parentName: 'Ханты-Мансийский автономный округ — Югра',
        },
    },
];

export const usersTestArray = [
    {
        id: 1,
        personalNumber: '000000',
        salePointName: '040_9040_2101',
        salePointId: 3649,
        locationName: 'Краснозаводск',
        locationId: 1001,
        blocked: false,
        tmpBlocked: false,
        role: 'Admin',
        clientAppIds: null,
        tempPassword: true,
        loginType: 'PASSWORD',
    },
    {
        id: 53,
        personalNumber: '123123',
        salePointName: '70',
        salePointId: 3,
        locationName: 'Дальневосточный банк',
        locationId: 4,
        blocked: false,
        tmpBlocked: false,
        role: 'Admin',
        clientAppIds: null,
        tempPassword: false,
        loginType: 'PASSWORD',
    },
    {
        id: 106,
        personalNumber: '21212121',
        salePointName: '040_8606_0044',
        salePointId: 3283,
        locationName: 'Спасск',
        locationId: 1628,
        blocked: false,
        tmpBlocked: false,
        role: 'User',
        clientAppIds: null,
        tempPassword: true,
        loginType: 'PASSWORD',
    },
    {
        id: 118,
        personalNumber: '20222121',
        salePointName: '077_8699_0044',
        salePointId: 3281,
        locationName: 'Спасский',
        locationId: 1128,
        blocked: true,
        tmpBlocked: false,
        role: 'User',
        clientAppIds: null,
        tempPassword: true,
        loginType: 'PASSWORD',
    },
    {
        id: 120,
        personalNumber: '20212121',
        salePointName: '041_8776_0044',
        salePointId: 3281,
        locationName: 'Спаский',
        locationId: 1778,
        blocked: false,
        tmpBlocked: false,
        role: 'User',
        clientAppIds: null,
        tempPassword: true,
        loginType: 'PASSWORD',
    },
    {
        id: 121,
        personalNumber: '20212121',
        salePointName: '041_8606_7744',
        salePointId: 3281,
        locationName: 'Спасский',
        locationId: 1128,
        blocked: false,
        tmpBlocked: false,
        role: 'User',
        clientAppIds: null,
        tempPassword: true,
        loginType: 'PASSWORD',
    },
    {
        id: 960,
        personalNumber: '20219621',
        salePointName: '041_8606_0077',
        salePointId: 7777,
        locationName: 'Пасский',
        locationId: 1128,
        blocked: false,
        tmpBlocked: false,
        role: 'User',
        clientAppIds: null,
        tempPassword: true,
        loginType: 'PASSWORD',
    },
    {
        id: 69,
        personalNumber: '20692121',
        salePointName: '041_6906_0044',
        salePointId: 3691,
        locationName: 'Масский',
        locationId: 1169,
        blocked: false,
        tmpBlocked: false,
        role: 'User',
        clientAppIds: null,
        tempPassword: true,
        loginType: 'PASSWORD',
    },
    {
        id: 99,
        personalNumber: '2111121',
        salePointName: '041_8616_0044',
        salePointId: 3281,
        locationName: 'Хутор',
        locationId: 1100,
        blocked: false,
        tmpBlocked: false,
        role: 'User',
        clientAppIds: null,
        tempPassword: true,
        loginType: 'PASSWORD',
    },
    {
        id: 2,
        personalNumber: '20202121',
        salePointName: '040_8606_0044',
        salePointId: 3801,
        locationName: 'Кий',
        locationId: 1528,
        blocked: false,
        tmpBlocked: false,
        role: 'User',
        clientAppIds: null,
        tempPassword: true,
        loginType: 'PASSWORD',
    },
    {
        id: 228,
        personalNumber: '20211121',
        salePointName: '041_8606_70044',
        salePointId: 3281,
        locationName: 'Шерон',
        locationId: 1128,
        blocked: false,
        tmpBlocked: false,
        role: 'User',
        clientAppIds: null,
        tempPassword: true,
        loginType: 'PASSWORD',
    },
    {
        id: 1110,
        personalNumber: '20218121',
        salePointName: '041_8306_0044',
        salePointId: 3271,
        locationName: 'Угловой',
        locationId: 9128,
        blocked: false,
        tmpBlocked: false,
        role: 'User',
        clientAppIds: null,
        tempPassword: true,
        loginType: 'PASSWORD',
    },
];

export const usersListTestData = {
    users: usersTestArray,
    pageNo: 0,
    totalPages: 2,
    totalElements: 12,
    status: 'Ok',
    message: 'Successful',
};

export const permissionsTestData = {
    Admin: {
        editUser: false,
        resetUserPassword: false,
        unlockUser: false,
        deleteUser: false,
        canSelectUserInTable: false,
    },
    Auditor: {
        editUser: false,
        resetUserPassword: false,
        unlockUser: false,
        deleteUser: false,
        canSelectUserInTable: false,
    },
    Owner: {
        editUser: false,
        resetUserPassword: false,
        unlockUser: false,
        deleteUser: false,
        canSelectUserInTable: false,
    },
    UserManager: {
        editUser: false,
        resetUserPassword: false,
        unlockUser: false,
        deleteUser: false,
        canSelectUserInTable: false,
    },
    User: {
        editUser: true,
        resetUserPassword: true,
        unlockUser: true,
        deleteUser: true,
        canSelectUserInTable: true,
    },
    Partner: {
        editUser: false,
        resetUserPassword: false,
        unlockUser: false,
        deleteUser: false,
        canSelectUserInTable: false,
    }
};

export const promoCampaignVisibilitySettingTestData = {
    promoCampaign: promoCampaignTestData,
};

export const visibilitySettingsTestArray = [
    {
        id: 4401,
        locationId: 139,
        locationName: 'Каменск-Уральский',
        salePointId: 1342,
        salePointName: '016_7003_0589',
        visible: false,
    },
    {
        id: 4409,
        locationId: 263,
        locationName: 'Ярославль',
        salePointId: 3140,
        salePointName: '040_0017_0031',
        visible: true,
    }
];

export const visibilitySettings = [
    {
        id: 4611,
        locationId: 6,
        locationName: 'Поволжский банк',
        salePointId: 5,
        salePointName: '54',
        visible: true,
    },
    {
        id: 4612,
        locationId: 248,
        locationName: 'Химки',
        salePointId: 1734,
        salePointName: '040_9040_2400',
        visible: true,
    },
    {
        id: 4613,
        locationId: 48,
        locationName: 'Ставропольский край',
        salePointId: 89,
        salePointName: '5230',
        visible: true,
    },
    {
        id: 4614,
        locationId: 61,
        locationName: 'Свердловская область',
        salePointId: 71,
        salePointName: '7003',
        visible: true,
    },
    {
        id: 4615,
        locationId: 81,
        locationName: 'Астраханская область',
        salePointId: 32,
        salePointName: '8625',
        visible: true,
    },
    {
        id: 4616,
        locationId: 163,
        locationName: 'Москва',
        salePointId: 410,
        salePointName: '038_9038_1129',
        visible: true,
    },
    {
        id: 4617,
        locationId: 139,
        locationName: 'Каменск-Уральский',
        salePointId: 1341,
        salePointName: '016_7003_0579',
        visible: true,
    },
    {
        id: 4618,
        locationId: 74,
        locationName: 'Ярославская область',
        salePointId: 66,
        salePointName: '0017',
        visible: true,
    },
    {
        id: 4619,
        locationId: 29,
        locationName: 'Самарская область',
        salePointId: 31,
        salePointName: '6991',
        visible: true,
    },
    {
        id: 4620,
        locationId: 163,
        locationName: 'Москва',
        salePointId: 551,
        salePointName: '038_9038_1317',
        visible: true,
    },
];


export const visibilitySettingTestData = {
    visibilitySettings: [
        {
            id: 3,
            locationId: 1,
            locationName: 'Российская Федерация',
            salePointId: 0,
            salePointName: 'Сбер',
            visible: true,
        },
        ...visibilitySettings,
    ],
    pageNo: 0,
    totalPages: 2,
    totalElements: 11,
    status: 'Ok',
    message: 'Successful',
};
export const searchLocation = [
    {
        deleted: false,
        description: null,
        endDate: null,
        id: 163,
        name: 'Москва',
        parentName: 'Ханты-Мансийский автономный округ — Югра',
        startDate: '2020-11-01',
    },
    {
        deleted: false,
        description: null,
        endDate: null,
        id: 164,
        name: 'НеМосква',
        parentName: 'НеЮгра',
        startDate: '2020-11-01',
    },
];

export const resolveMenuItemsByRoleAndAppCodeValue = [
    [
        {
            label: 'Промо-кампании',
            path: '/admin/promo-campaign'
        },
        {
            label: 'Настройки',
            path: '/admin/client-apps/app-properties'
        },
        {
            label: 'Группы',
            path: '/admin/groups'
        },
        {
            label: 'Отчеты',
            path: '/admin/reports'
        },
    ],
    [
        {
            label: 'Дашборд',
            path: '/admin/dashboard'
        },
        {
            label: 'Пользователи',
            path: '/admin/users'
        },
        {
            label: 'ДЗО',
            path: '/admin/dzo'
        },
        {
            label: 'Приложения',
            path: '/admin/client-apps'
        },
    ]
];

export const getTextsReturnValue = [
    {
        id: 473,
        type: 'HEADER',
        value: 'test',
    },
    {
        id: 474,
        type: 'RULES',
        value: 'test',
    },
    {
        id: 475,
        type: 'HEADER',
        value: 'test',
    },
    {
        id: 476,
        type: 'RULES',
        value: 'test',
    },
];

export const consentsTestData = {
    list: [
        {
            active: true,
            clientApplications: [
                {
                    id: 7,
                    name: 'Витрина экосистемы с подарками',
                    displayName: 'Витрина ВСП',
                    code: 'greenday-presents',
                    isDeleted: false,
                    orderNumber: 1,
                }, {
                    id: 8,
                    name: 'Сбер Премьер',
                    displayName: 'Сбер Премьер',
                    code: 'sber-premiere',
                    isDeleted: false,
                    orderNumber: 2,
                },
            ],
            createDate: '2021-05-17T14:54:28.479',
            id: 64,
            text: 'test',
            updateDate: null,
            version: '4',
        },
        {
            active: true,
            clientApplications: [
                {
                    id: 1,
                    name: 'Витрина экосистемы с подарками',
                    displayName: 'Витрина ВСП',
                    code: 'greenday-presents',
                    isDeleted: false,
                    orderNumber: 1,
                }, {
                    id: 2,
                    name: 'Сбер Премьер',
                    displayName: 'Сбер Премьер',
                    code: 'sber-premiere',
                    isDeleted: false,
                    orderNumber: 2,
                },
            ],
            createDate: '2021-05-17T14:54:28.479',
            id: 65,
            text: 'test',
            updateDate: null,
            version: '4',
        },
    ],
};

export const consentsTestDataWithAppsNames = consentsTestData.list.map((consent) => ({
    ...consent,
    clientApplicationsNames: consent.clientApplications
        .map((apps) => apps.displayName).join(', ')
}));
