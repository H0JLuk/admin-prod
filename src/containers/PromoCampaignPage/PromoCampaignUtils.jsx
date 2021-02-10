import React from 'react';
import { notification } from 'antd';
import { deletePromoCampaign } from '../../api/services/promoCampaignService';


export const getDeleteTitleConfirm = (promoCampaignName) => (
    <span>
        Вы уверены, что хотите удалить промо-кампанию <b>{promoCampaignName}</b>?
    </span>
);

export const getSuccessDeleteMessage = (promoCampaignName) => (
    <span>
        Промо-кампания <b>{promoCampaignName}</b> успешно удалена
    </span>
);

export async function onConfirmDeletePromoCampaign(id, name) {
    try {
        await deletePromoCampaign(id);
        notification.success({
            duration: 10,
            message: getSuccessDeleteMessage(name),
            placement: 'bottomRight',
        });
    } catch ({ message }) {
        notification.error({
            message,
            duration: 0,
            placement: 'bottomRight',
        });
        throw new Error(message);
    }
}
