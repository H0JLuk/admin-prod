import { notification } from 'antd';
import { addSettings, updateSettingsList } from '../../../api/services/settingsService';
import { designKeysForCheck, SETTINGS_TYPES } from './ClientAppFormConstants';

export const showNotify = (message, isError) => {
    const config = {
        duration: 5,
        placement: 'bottomRight',
    };

    if (isError) {
        notification.error({
            ...config,
            message,
        });
    } else {
        notification.success({
            ...config,
            message,
        });
    }

};

export async function createOrUpdateKey (changedParams) {
    const updateSettings = [];
    const addSettingsArr = [];

    changedParams.forEach(({ type, ...params }) => {
        type === SETTINGS_TYPES.EDIT
            ? updateSettings.push(params)
            : addSettingsArr.push(params);
    });

    updateSettings.length && (await updateSettingsList(updateSettings));
    addSettingsArr.length && (await addSettings(addSettingsArr));
}

export const checkExistDesignSettings = (settings) => {
    return designKeysForCheck.some(key => !Object.prototype.hasOwnProperty.call(settings, key));
};

export const getImage = (imageName) => {
    return `${process.env.PUBLIC_URL}/images/clientAppDesign/${imageName}.png`;
};


