import React from 'react';
import { deletePromoCampaign } from '../../api/services/promoCampaignService';
import { customNotifications } from '../../utils/notifications';


export const getDeleteTitleConfirm = (promoCampaignName) => (
    <span>
        Вы уверены, что хотите удалить промо-кампанию <b>{ promoCampaignName }</b>?
    </span>
);

export const getSuccessDeleteMessage = (promoCampaignName) => (
    <span>
        Промо-кампания <b>{ promoCampaignName }</b> успешно удалена
    </span>
);

export async function onConfirmDeletePromoCampaign(id, name) {
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
