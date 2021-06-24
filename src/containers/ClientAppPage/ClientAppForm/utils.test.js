import * as notification from '../../../utils/notifications';
import * as settingsService from '../../../api/services/settingsService';
import { getImage, showNotify, createOrUpdateKey, checkExistDesignSettings } from './utils';
import { designKeysForCheck } from './ClientAppFormConstants';

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

    it('should return src to image', () => {
        process.env.PUBLIC_URL = 'sberbank.ru';
        expect(getImage('test')).toEqual(
            'sberbank.ru/images/clientAppDesign/test.png'
        );
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

    it('`checkExistDesignSettings` function should return `false`', () => {
        const settings = {
            test_key: 'test',
        };
        designKeysForCheck.forEach(key => settings[key] = `test_${key}`);

        expect(checkExistDesignSettings(settings)).toBe(false);
    });

    it('`checkExistDesignSettings` function should return `true`', () => {
        const settings = {
            test_key: 'test',
            home_page_header: 'test header',
        };

        expect(checkExistDesignSettings(settings)).toBe(true);
    });
});
