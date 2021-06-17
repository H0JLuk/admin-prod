import React from 'react';
import { deletePromoCampaign } from '../../api/services/promoCampaignService';
import { customNotifications } from '../../utils/notifications';

export const getDeleteTitleConfirm = (promoCampaignName: string) => (
    <span>
        Вы уверены, что хотите удалить промо-кампанию <b>{promoCampaignName}</b>?
    </span>
);

export const getSuccessDeleteMessage = (promoCampaignName: string) => (
    <span>
        Промо-кампания <b>{promoCampaignName}</b> успешно удалена
    </span>
);

export async function onConfirmDeletePromoCampaign(id: number, name: string) {
    try {
        await deletePromoCampaign(id);
        customNotifications.success({
            duration: 10,
            message: getSuccessDeleteMessage(name),
        });
    } catch ({ message }) {
        customNotifications.error({
            message,
        });
        throw new Error(message);
    }
}
