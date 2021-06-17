import { confirmModal } from '@utils/utils';

const OK_TITLE = 'Ок';
const CONFIRM_CHANGE_TITLE = 'Тип промокода был изменён';

const modalText: Record<string, string> = {
    firstPart: 'Изменение типа промокода повлияет на отчет "Выданные промокоды".',
    thirdPart: 'Вы точно хотите изменить тип промокода?',
    COMMON_TO_PERSONAL: 'Общий промокод будет деактивирован, требуется добавить персональные промокоды!',
    PERSONAL_TO_NONE: 'Оставшиеся не выданные персональные промокоды будут деактивированы.',
    PERSONAL_TO_COMMON:
        'Оставшиеся не выданные персональные промокоды будут деактивированы, требуется добавить общий промокод!',
};

const callConfirmModalForPromoCodeTypeChanging = (handleOk: () => Promise<void>, text: string) =>
    new Promise((resolve) => {
        const onOk = async () => {
            await handleOk();
            resolve(true);
        };
        const onCancel = () => resolve(false);
        confirmModal({
            title: CONFIRM_CHANGE_TITLE,
            content: `${modalText.firstPart} ${modalText[text] || ''} ${modalText.thirdPart}`,
            okText: OK_TITLE,
            onOk,
            onCancel,
        });
    });

export default callConfirmModalForPromoCodeTypeChanging;
