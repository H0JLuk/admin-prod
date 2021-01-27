import React, { useCallback, useState } from 'react';
import { Modal } from 'antd';
import RemovedUsersList from './RemovedUsersList/RemovedUsersList';
import { removeUser } from '../../../../../api/services/adminService';

import styles from './ModalDeleteUsers.module.css';

const MODAL_TITLE = 'Вы уверены что хотите удалить этих пользователей?';
const MODAL_SUCCESS_TITLE = 'Результат удаления пользователей';
const SUCCESS_DELETE = 'Успешно удалено';
const ERRORS_DELETE = 'Ошибка удаления';
const CANCEL_TEXT = 'Отменить';

const modalBodyStyle = {
    overflowY: 'auto',
    maxHeight: 500,
};

const showErrorAmount = (requestErrors) => {
    const errorsAmount = `(${requestErrors.length})`;
    return `${ERRORS_DELETE}${errorsAmount}`;
};

const ModalDeleteUsers = ({
    userList,
    visible,
    selectedRowKeys,
    refreshTable,
    modalOpen,
}) => {
    const [loading, setLoading] = useState(false);
    const [loadData, setLoadData] = useState(false);
    const [requestData, setRequestData] = useState({
        errorsDelete: [],
        deletedUsers: [],
    });

    const handleOk = useCallback(async () => {
        const requestPromises = selectedRowKeys.map(removeUser);
        setLoading(true);

        try {
            const response = await Promise.allSettled(requestPromises);
            const { deletedUsers, errorsDelete } = response.reduce((requestInfoData, { status, reason =  {} }, index) => {
                const { personalNumber } = userList[index];
                const { message } = reason;
                if (status === 'rejected') {
                    requestInfoData.errorsDelete.push({ user: personalNumber, message });
                } else {
                    requestInfoData.deletedUsers.push({ user: personalNumber });
                }
                return requestInfoData;

            }, { deletedUsers:[], errorsDelete:[] });
            setRequestData((prev) => ({ ...prev, deletedUsers, errorsDelete }));
        } catch (e) {
            const { message } = e;
            setRequestData((prev) => ({ ...prev, errorsDelete: [{ message }] }));
            console.warn(e);
        }

        setLoadData(true);
        setLoading(false);
    }, [selectedRowKeys, userList]);

    const handleClose = useCallback(() => {
        modalOpen(false);
        setRequestData({ errorsDelete: [], deletedUsers: [] });
        setLoadData(false);
        refreshTable();
    }, [modalOpen, refreshTable]);

    const modalClose = useCallback(() => modalOpen(false), [modalOpen]);

    return (
        <Modal
            title={ loadData ? MODAL_SUCCESS_TITLE : MODAL_TITLE }
            visible={ visible }
            onOk={ loadData ? handleClose : handleOk }
            confirmLoading={ loading }
            onCancel={ modalClose }
            cancelText={ CANCEL_TEXT }
            bodyStyle={ modalBodyStyle }
            okButtonProps={ { className: styles.okButton } }
            cancelButtonProps={ { hidden: loadData, className: styles.cancelButton } }
            closable={ !loadData }
            maskClosable={ false }
            centered
            destroyOnClose
        >
            {!!userList.length && !loadData && (
                <ul className={ styles.list }>
                    {userList.map((el, index) => (
                        <li key={ index }>{ el.personalNumber }</li>
                    ))}
                </ul>
            )}
            {!!requestData.deletedUsers.length && (
                <RemovedUsersList
                    usersList={ requestData.deletedUsers }
                    message={ SUCCESS_DELETE }
                />
            )}
            {!!requestData.errorsDelete.length && (
                <ul className={ styles.list }>
                    <p className={ styles.failed }>
                        { showErrorAmount(requestData.errorsDelete) }
                    </p>
                    {requestData.errorsDelete.map(({ message }, index) => (
                        <li key={ index }>
                            {message}
                        </li>
                    ))}
                </ul>
            )}
        </Modal>
    );
};

export default ModalDeleteUsers;
