import { customNotifications } from '@utils/notifications';
import { ArgsProps } from 'antd/lib/notification';
import { addSettings, updateSettingsList } from '@apiServices/settingsService';
import { designKeysForCheck, SETTINGS_TYPES } from './ClientAppFormConstants';
import { ISettingObject } from '@types';

export interface IChangedParam {
    clientAppCode: string;
    key: string;
    type: SETTINGS_TYPES;
    value: string;
}

export type IValueToServer = Omit<Partial<IChangedParam>, 'type'>;

export const showNotify = (message: React.ReactNode, isError?: boolean) => {
    const config: ArgsProps = {
        duration: 5,
        message,
    };

    if (isError) {
        customNotifications.error(config);
    } else {
        customNotifications.success(config);
    }

};

type UpdateAndAddSettings = {
    updateSettings: IValueToServer[];
    addSettingsArr: IValueToServer[];
};

export async function createOrUpdateKey(changedParams: IChangedParam[]) {
    const { updateSettings, addSettingsArr } = changedParams.reduce<UpdateAndAddSettings>((result, { type, ...params }) => {
        const key = type === SETTINGS_TYPES.EDIT ? 'updateSettings' : 'addSettingsArr';

        return {
            ...result,
            [key]: [...result[key], params],
        };
    }, { updateSettings: [], addSettingsArr: [] });

    updateSettings.length && (await updateSettingsList(updateSettings));
    addSettingsArr.length && (await addSettings(addSettingsArr));
}

export function checkExistDesignSettings(settings: ISettingObject) {
    return designKeysForCheck.some(key => !Object.prototype.hasOwnProperty.call(settings, key));
}

export function getImage(imageName: string) {
    return `${process.env.PUBLIC_URL}/images/clientAppDesign/${imageName}.png`;
}


