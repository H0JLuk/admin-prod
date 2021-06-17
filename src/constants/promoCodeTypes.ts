const promoCodeTypes = {
    NONE: {
        value: 'NONE',
        label: 'Нет промокодов',
        description: '',
        disabled: false,
    },
    PERSONAL: {
        value: 'PERSONAL',
        label: 'Персональный',
        description: '(для всех)',
        disabled: false,
    },
    COMMON: {
        value: 'COMMON',
        label: 'Общий',
        description: '(один для всех)',
        disabled: false,
    },
    PERSONAL_CLIENT_POOL: {
        value: 'PERSONAL_CLIENT_POOL',
        label: 'Персональный',
        description: '(для определенного списка клиентов)',
        disabled: true,
    },
    COMMON_CLIENT_POOL: {
        value: 'COMMON_CLIENT_POOL',
        label: 'Общий',
        description: '(для определенного списка клиентов)',
        disabled: true,
    },
};

export default promoCodeTypes;
