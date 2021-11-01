import { customNotifications } from '@utils/notifications';
import { ArgsProps } from 'antd/lib/notification';
import { addSettings, updateSettingsList } from '@apiServices/settingsService';
import { SETTINGS_TYPES } from './ClientAppFormConstants';
import { SettingDto } from '@types';
import ROLES from '@constants/roles';

export interface IChangedParam extends Pick<SettingDto, 'clientAppCode' | 'key' | 'value' | 'userRole'> {
    type: SETTINGS_TYPES;
}

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
    updateSettings: SettingDto[];
    addSettingsArr: SettingDto[];
};

export async function createOrUpdateKey(changedParams: IChangedParam[]) {
    const { updateSettings, addSettingsArr } = changedParams.reduce<UpdateAndAddSettings>((result, { type, ...params }) => {
        const key = type === SETTINGS_TYPES.EDIT ? 'updateSettings' : 'addSettingsArr';

        if (params.key === 'referralTokenLifetime') {
            delete params.clientAppCode;
            params.key = 'token_lifetime';
            params.userRole = ROLES.REFERAL_LINK;
        }

        return {
            ...result,
            [key]: [...result[key], params],
        };
    }, { updateSettings: [], addSettingsArr: [] });

    updateSettings.length && (await updateSettingsList(updateSettings));
    addSettingsArr.length && (await addSettings(addSettingsArr));
}
