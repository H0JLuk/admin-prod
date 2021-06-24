import React from 'react';
import Paragraph from 'antd/lib/typography/Paragraph';
import { customNotifications } from '@utils/notifications';
import ROLES from '@constants/roles';
import { LOGIN_TYPES_ENUM } from '@constants/loginTypes';
import { getPatternAndMessage } from '@utils/validators';
import { ClientAppDto, SalePointDto } from '@types';
import { SALE_POINT_TYPE } from '@constants/common';

const { pattern: patternLogin, message } = getPatternAndMessage('users', 'login');

export const validateMessages = {
    login: {
        require: 'Укажите логин пользователя',
        validate: message,
    },
    salePoint: {
        require: 'Выберите точку продажи',
        shouldExternal: 'Вид точки продажи должен быть внешним',
        notShouldExternal: 'Вид точки продажи не должен быть внешним',
    },
    partner: {
        require: 'Пользователь должен быть обязательно связан с партнером. Укажите партнера перед созданием пользователя.',
    },
};

export const MODE = {
    CREATE: 'CREATE',
    EDIT: 'EDIT',
    RESTORED: 'RESTORED',
    DELETE: 'DELETE',
    ERROR: 'ERROR',
    QR_DOWNLOAD: 'QR_DOWNLOAD',
} as const;

const USER_PASSWORD = 'Пароль пользователя';
const NEW_USER_PASSWORD = 'Новый пароль пользователя';
const COPY_TOOLTIPS = ['Копировать', 'Скопировано'];
export const ROLES_FOR_PARTNER_CONNECT = [
    ROLES.EXTERNAL_USER,
    ROLES.REFERAL_LINK,
];

export const ROLES_FOR_EXTERNAL_SALE_POINT = [
    ...ROLES_FOR_PARTNER_CONNECT,
    ROLES.PARTNER,
];

export function getLoginTypeByRole(role: ROLES) {
    switch (role) {
        case ROLES.PARTNER:
            return;
        case ROLES.REFERAL_LINK:
            return LOGIN_TYPES_ENUM.DIRECT_LINK;
        default:
            return LOGIN_TYPES_ENUM.PASSWORD;
    }
}

export type getUserAppsCheckboxesResult = Record<string, {id: number; label: string; disabled: boolean; checked: boolean;}>;

export const getUserAppsCheckboxes = (availableApps: ClientAppDto[] = [], checkedApps?: number[] | null) =>
    availableApps.reduce<getUserAppsCheckboxesResult>(
        (result, app) => ({
            ...result,
            [app.code]: {
                id: app.id,
                label: app.displayName,
                disabled: false,
                checked: checkedApps?.includes(app.id) ?? false,
            },
        }),
        {},
    );

export function validateLogin(login: string | null) {
    [
        { isInvalid: !login, message: validateMessages.login.require },
        { isInvalid: !patternLogin.test(login!), message: validateMessages.login.validate },
    ].forEach(validateCheck('login'));
}

export function validateSalePoint(salePoint: SalePointDto | null, shouldExternal: boolean) {
    [
        { isInvalid: typeof salePoint?.id !== 'number', message: validateMessages.salePoint.require },
        {
            isInvalid: shouldExternal && salePoint?.type.kind !== SALE_POINT_TYPE.EXTERNAL,
            message: validateMessages.salePoint.shouldExternal,
        },
        {
            isInvalid: !shouldExternal && salePoint?.type.kind === SALE_POINT_TYPE.EXTERNAL,
            message: validateMessages.salePoint.notShouldExternal,
        },
    ].forEach(validateCheck('salePoint'));
}

export function validatePartner(partnerPersonalNumber: string | null, isCorrectRoleForPartner: boolean) {
    [
        {
            isInvalid: isCorrectRoleForPartner && !partnerPersonalNumber,
            message: validateMessages.partner.require,
        },
    ].forEach(validateCheck('partner'));
}

export function validateCheck(name: string) {
    return ({ isInvalid, message }: { isInvalid: boolean; message: string; }) => {
        if (isInvalid) {
            const error = new Error(message);
            error.name = name;
            throw error;
        }
    };
}

const getCopyPassBlock = (
    password?: string,
    role?: ROLES,
    text = USER_PASSWORD,
) => password && [ROLES.USER, ROLES.EXTERNAL_USER].includes(role!) ? (
    <Paragraph
        copyable={{
            text: password,
            tooltips: COPY_TOOLTIPS,
        }}
    >
        {text}: {password}
    </Paragraph>
) : password || '';

type userMessageParams = {
    login?: string | number | null | React.ReactNode;
    pwd?: string;
    mode?: keyof typeof MODE;
    errorMessage?: React.ReactNode;
    role?: ROLES;
};

const userMessage = ({ mode, login, pwd, errorMessage, role }: userMessageParams) => {
    switch (mode) {
        case MODE.CREATE: {
            return {
                message: (
                    <span>
                        Пользователь с табельным номером <b>{login}</b> успешно создан
                        {role === ROLES.PARTNER && ', но не является пользователем Приложения Витрины'}
                    </span>
                ),
                description: getCopyPassBlock(pwd, role),
            };
        }
        case MODE.EDIT: {
            return {
                message: (
                    <span>
                        Данные пользователя с табельным номером <b>{login}</b> успешно обновлены
                    </span>
                ),
                description: getCopyPassBlock(pwd, role),
            };
        }
        case MODE.RESTORED: {
            return {
                message: (
                    <span>
                        Пароль пользователя с табельным номером <b>{login}</b> успешно сброшен
                    </span>
                ),
                description: getCopyPassBlock(pwd, role, NEW_USER_PASSWORD),
            };
        }
        case MODE.QR_DOWNLOAD: {
            return {
                message: (
                    <span>
                        QR-код для пользователя <b>{login}</b> успешно создан
                    </span>
                ),
                description: '',
            };
        }
        case MODE.DELETE: {
            return {
                message: (
                    <span>
                        Пользователь с табельным номером <b>{login}</b> успешно удален
                    </span>
                ),
            };
        }
        case MODE.ERROR: {
            return {
                message: errorMessage,
            };
        }
        default: {
            return {
                message: '',
            };
        }
    }
};

export const showNotify = (params: userMessageParams) => {
    const notifyConfig = userMessage(params);

    if (params.mode === MODE.ERROR) {
        return customNotifications.error(notifyConfig);
    }
    customNotifications.success(notifyConfig);
};

export const errorEditPermissions = (personalNumber: string) => (
    <span>
        У вас недостаточно полномочий чтобы редактировать пользователя с табельным номером
        <b> {personalNumber}</b>
    </span>
);
