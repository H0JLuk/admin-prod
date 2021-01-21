import React from 'react';
import { Modal } from 'antd';
import { ExclamationCircleOutlined } from '@ant-design/icons';

const CANCEL_TITLE = 'Отменить';
const OK_TITLE = 'Ок';
const CONFIRM_CHANGE_TITLE = 'Тип промокода был изменён';

const modalText = {
    firstPart: 'Изменение типа промокода повлияет на отчет "Выданные промокоды".',
    thirdPart: 'Вы точно хотите изменить тип промокода?',
    COMMON_TO_PERSONAL: 'Общий промокод будет деактивирован, требуется добавить персональные промокоды!',
    PERSONAL_TO_NONE: 'Оставшиеся не выданные персональные промокоды будут деактивированы.',
    PERSONAL_TO_COMMON:
        'Оставшиеся не выданные персональные промокоды будут деактивированы, требуется добавить общий промокод!',
};

const callConfirmModalForPromoCodeTypeChanging = (handleOk, text) =>
    Modal.confirm({
        title: CONFIRM_CHANGE_TITLE,
        icon: <ExclamationCircleOutlined />,
        content: `${modalText.firstPart} ${modalText[text] || ''} ${modalText.thirdPart}`,
        okText: OK_TITLE,
        onOk: handleOk,
        centered: true,
        cancelText: CANCEL_TITLE,
    });

export default callConfirmModalForPromoCodeTypeChanging;