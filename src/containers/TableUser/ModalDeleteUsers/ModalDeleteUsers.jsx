import React, { useCallback, useState } from 'react';
import { Modal } from 'antd';
import RemovedUsersList from './RemovedUsersList/RemovedUsersList';
import { removeUser } from '../../../api/services/adminService';

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
        errors: { message: '' },
        users: [],
    });

    const handleOk = useCallback(async () => {
        const requestPromises = selectedRowKeys.map(removeUser);
        setLoading(true);

        try {
            const response = await Promise.all(requestPromises);
            const requestUsersResult = response.reduce((requestInfoData, { status }, index) => {
                const { personalNumber } = userList[index];
                requestInfoData.push({ user: personalNumber, status });
                return requestInfoData;
            }, []);
            setRequestData((prev) => ({ ...prev, users: requestUsersResult }));
        } catch (e) {
            const { message } = e;
            setRequestData((prev) => ({ ...prev, errors:{ message } }));
            console.warn(e);
        }

        setLoadData(true);
        setLoading(false);
    }, [selectedRowKeys, userList]);

    const handleClose = useCallback(() => {
        modalOpen(false);
        setRequestData({ errors: { message: '' }, users: [] });
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
            {Boolean(userList.length) && !loadData && (
                <ul className={ styles.list }>
                    {userList.map((el, index) => (
                        <li key={ index }>{ el.personalNumber }</li>
                    ))}
                </ul>
            )}
            {Boolean(requestData.users.length) && (
                <RemovedUsersList
                    usersList={ requestData.users }
                    message={ SUCCESS_DELETE }
                />
            )}
            {requestData.errors.message && (
                <div>
                    <p className={ styles.failed }>{ ERRORS_DELETE }</p>
                    <span>{ requestData.errors.message }</span>
                </div>
            )}
        </Modal>
    );
};

export default ModalDeleteUsers;
