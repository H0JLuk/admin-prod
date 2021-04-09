import { getLoginType } from '../api/services/sessionService';
import { LOGIN_TYPE } from './auth.js';

const DEFAULT_SETTINGS = {
    creation: false,
    listCreation: false,
    editing: false,
    passwordReset: false,
    unlocked: false,
    deleting: false,
    viewGeneratePassword: false,
};

const USERS_SETTINGS_BY_LOGIN_TYPE = {
    [LOGIN_TYPE.PASSWORD]: {
        creation: true,
        listCreation: true,
        editing: true,
        passwordReset: true,
        unlocked: true,
        deleting: true,
        viewGeneratePassword: true,
    },
    // [LOGIN_TYPE.SBOL_PRO]: {
    //     creation: true,
    //     listCreation: true,
    //     editing: true,
    //     passwordReset: false,
    //     unlocked: false,
    //     deleting: true,
    //     viewGeneratePassword: false,
    // },
    [LOGIN_TYPE.SBER_USER_ID]: {
        creation: true,
        listCreation: true,
        editing: true,
        passwordReset: false,
        unlocked: false,
        deleting: true,
        viewGeneratePassword: false,
    },
};

export function getUsersSettingsByLoginType() {
    const loginType = getLoginType();
    return USERS_SETTINGS_BY_LOGIN_TYPE[loginType] || DEFAULT_SETTINGS;
}
