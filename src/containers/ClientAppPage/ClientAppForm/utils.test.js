import * as notification from '../../../utils/notifications';
import * as settingsService from '../../../api/services/settingsService';
import { showNotify, createOrUpdateKey } from './utils';

describe('ClientAppForm utils test', () => {
    it('should call customNotifications', () => {
        notification.customNotifications.error = jest.fn();
        notification.customNotifications.success = jest.fn();

        const config = {
            duration: 5,
            message: 'message',
        };

        showNotify(config.message, true);

        expect(notification.customNotifications.error).toBeCalledTimes(1);
        expect(notification.customNotifications.error).toBeCalledWith(config);

        showNotify(config.message, false);

        expect(notification.customNotifications.success).toBeCalledTimes(1);
        expect(notification.customNotifications.success).toBeCalledWith(config);
    });

    it('should add or update settings on server', async () => {
        const changedParams = [
            {
                clientAppCode: 'mcdonalds-point',
                key: 'inactivity_time',
                type: 'edit',
                value: '22',
            },
            {
                clientAppCode: 'mcdonalds-point',
                key: 'max_presents_number',
                type: 'create',
                value: '4',
            },
        ];

        settingsService.updateSettingsList = jest.fn().mockResolvedValue('ready');
        settingsService.addSettings = jest.fn().mockResolvedValue('ready');

        await createOrUpdateKey(changedParams);

        expect(settingsService.updateSettingsList).toBeCalledTimes(1);
        delete changedParams[0].type;
        expect(settingsService.updateSettingsList).toBeCalledWith([changedParams[0]]);

        expect(settingsService.addSettings).toBeCalledTimes(1);
        delete changedParams[1].type;
        expect(settingsService.addSettings).toBeCalledWith([changedParams[1]]);
    });
});
