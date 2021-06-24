import React, { useEffect, useState } from 'react';
import Modal, { ModalProps } from 'antd/lib/modal/Modal';
import PropTypes from 'prop-types';
import { DefaultApiResponse } from '@types';

import styles from './TableDeleteModal.module.css';

const CANCEL_TEXT = 'Отменить';
const OK_TEXT_DELETE = 'Удалить';
const OK_TEXT_SUCCESS = 'Хорошо';
const SUCCESSFULLY_DELETED = 'Успешно удалено';
const FAILED_DELETE = 'Ошибка удаления';

type ResponseResult = {
    reason?: Error;
    status: string;
};

type TableDeleteModalProps<DataType> = {
    sourceForRemove: DataType[];
    listIdForRemove: number[];
    listNameKey: keyof DataType;
    deleteFunction: (id: number) => Promise<DefaultApiResponse>;
    refreshTable: () => void;
    modalTitle?: string;
    modalSuccessTitle?: string;
    okTextSuccess?: string;
    okTextDelete?: string;
    cancelText?: string;
    children: React.ReactElement;
};

const defaultOptions: ModalProps = {
    maskClosable: false,
    bodyStyle: { overflowY: 'auto', maxHeight: 500 },
    centered: true,
    destroyOnClose: true,
};

type TableDeleteModalState = {
    deleted: { item: any; message: string; }[];
    errors: { item: any; message: string; }[];
};

const initialRequestState: TableDeleteModalState = { deleted: [], errors: [] };

function TableDeleteModal<DataType extends { id: number; } | { dzoId: number; }>({
    sourceForRemove,
    listIdForRemove,
    listNameKey,
    deleteFunction,
    refreshTable,
    modalTitle = 'Вы точно хотите удалить эти данные?',
    modalSuccessTitle = 'Результат удаления',
    okTextSuccess = OK_TEXT_SUCCESS,
    okTextDelete = OK_TEXT_DELETE,
    cancelText = CANCEL_TEXT,
    children,
}: TableDeleteModalProps<DataType>) {
    const [isModalRender, setIsModalRender] = useState(false);
    const [isVisible, setIsVisible] = useState(false);
    const [loading, setLoading] = useState(false);
    const [request, setRequest] = useState(initialRequestState);

    useEffect(() => {
        // setTimeout need for save close animation modal
        setTimeout(() => {
            setIsModalRender(isVisible);
        }, 500);
    }, [isVisible]);

    try {
        React.Children.only(children);
    } catch (e) {
        console.error('Warning: `children` of `TableDeleteModal` must be single reactNode');
        return null;
    }

    const openModal = () => setIsVisible(true);
    const closeModal = () => setIsVisible(false);

    const triggerElem = React.cloneElement(children, { onClick: openModal });

    if (!isVisible && !isModalRender) {
        return triggerElem;
    }

    const handleDelete = async () => {
        const requestPromises = listIdForRemove.map(deleteFunction);
        setLoading(true);
        try {
            const response = await Promise.allSettled(requestPromises);
            const { deleted, errors } = response.reduce((prev, result: ResponseResult, index) => {
                const key = result.status === 'rejected' ? 'errors' : 'deleted';
                return {
                    ...prev,
                    [key]: [...prev[key], { item: sourceForRemove[index][listNameKey], message: result.reason?.message }],
                };
            }, initialRequestState);
            setRequest({ deleted, errors });
        } catch (e) {
            const { message } = e;
            setRequest((prev) => ({ ...prev, errors: [{ message, item: undefined }] }));
        }
        setLoading(false);
    };

    const handleClose = () => {
        closeModal();
        setRequest(initialRequestState);
        refreshTable();
    };

    const hasErrors = !!request.errors.length;
    const hasDeleted = !!request.deleted.length;
    const dataIsLoaded = hasErrors || hasDeleted;

    return (
        <>
            {triggerElem}
            <Modal
                cancelText={cancelText}
                title={dataIsLoaded ? modalSuccessTitle : modalTitle}
                okText={dataIsLoaded ? okTextSuccess : okTextDelete}
                cancelButtonProps={{ hidden: dataIsLoaded }}
                okButtonProps={{ type: 'primary', danger: !dataIsLoaded }}
                closable={!dataIsLoaded}
                onOk={dataIsLoaded ? handleClose : handleDelete}
                onCancel={closeModal}
                visible={isVisible}
                confirmLoading={loading}
                {...defaultOptions}
            >
                {!dataIsLoaded && (
                    <ul className={styles.list}>
                        {sourceForRemove.map((item, index) => (
                            <li key={index}>{item[listNameKey]}</li>
                        ))}
                    </ul>
                )}
                {hasDeleted && (
                    <ul className={styles.list}>
                        <span className={styles.success}>{SUCCESSFULLY_DELETED}</span>
                        <span>({request.deleted.length})</span>
                        {request.deleted.map(({ item }, index) => (
                            <li key={index}>{item}</li>
                        ))}
                    </ul>
                )}
                {hasErrors && (
                    <ul className={styles.list}>
                        <span className={styles.failed}>{FAILED_DELETE}</span>
                        <span>({request.errors.length})</span>
                        {request.errors.map(({ message, item }, index) => (
                            <li key={index}><b>{item}</b> - {message}</li>
                        ))}
                    </ul>
                )}
            </Modal>
        </>
    );
}

TableDeleteModal.propTypes = {
    sourceForRemove: PropTypes.array.isRequired,
    listIdForRemove: PropTypes.array.isRequired,
    listNameKey: PropTypes.string.isRequired,
    deleteFunction: PropTypes.func.isRequired,
    refreshTable: PropTypes.func.isRequired,
    modalTitle: PropTypes.string,
    modalSuccessTitle: PropTypes.string,
    okTextSuccess: PropTypes.string,
    okTextDelete: PropTypes.string,
    cancelText: PropTypes.string,
    children: PropTypes.node.isRequired,
};

export default TableDeleteModal;
