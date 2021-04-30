import React, { useEffect, useState } from 'react';
import Modal from 'antd/lib/modal/Modal';
import PropTypes from 'prop-types';

import styles from './TableDeleteModal.module.css';

const CANCEL_TEXT = 'Отменить';
const OK_TEXT_DELETE = 'Удалить';
const OK_TEXT_SUCCESS = 'Хорошо';
const SUCCESSFULLY_DELETED = 'Успешно удалено';
const FAILED_DELETE = 'Ошибка удаления';

const defaultOptions = {
    maskClosable: false,
    bodyStyle: { overflowY: 'auto', maxHeight: 500 },
    centered: true,
    destroyOnClose: true,
};

const TableDeleteModal = ({
    sourceForRemove,
    listIdForRemove,
    listNameKey,
    modalClose,
    deleteFunction,
    refreshTable,
    modalTitle = 'Вы точно хотите удалить эти данные?',
    modalSuccessTitle = 'Результат удаления',
    okTextSuccess = OK_TEXT_SUCCESS,
    okTextDelete = OK_TEXT_DELETE,
    cancelText = CANCEL_TEXT,
    visible,
}) => {
    const [isModalRender, setIsModalRender] = useState(false);
    const [loading, setLoading] = useState(false);
    const [request, setRequest] = useState({ deleted: [], errors: [] });

    useEffect(() => {
        // setTimeout need for save close animation modal
        setTimeout(() => {
            setIsModalRender(visible);
        }, 500);
    }, [visible]);

    if (!visible && !isModalRender) return null;

    const handleDelete = async () => {
        const requestPromises = listIdForRemove.map(deleteFunction);
        setLoading(true);
        try {
            const response = await Promise.allSettled(requestPromises);
            const { deleted, errors } = response.reduce((prev, result, index) => {
                const key = result.status === 'rejected' ? 'errors' : 'deleted';
                return {
                    ...prev,
                    [key]: [...prev[key], { item: sourceForRemove[index][listNameKey], message: result.reason?.message }],
                };
            }, { deleted: [], errors: [] });
            setRequest({ deleted, errors });
        } catch (e) {
            const { message } = e;
            setRequest((prev) => ({ ...prev, errors: [{ message }] }));
        }
        setLoading(false);
    };

    const handleClose = () => {
        modalClose();
        setRequest({ deleted: [], errors: [] });
        refreshTable();
    };

    const hasErrors = !!request.errors.length;
    const hasDeleted = !!request.deleted.length;
    const dataIsLoaded = hasErrors || hasDeleted;

    return (
        <Modal
            cancelText={ cancelText }
            title={ dataIsLoaded ? modalSuccessTitle : modalTitle }
            okText={ dataIsLoaded ? okTextSuccess : okTextDelete }
            cancelButtonProps={ { hidden: dataIsLoaded } }
            okButtonProps={ { type: 'primary', danger: !dataIsLoaded } }
            closable={ !dataIsLoaded }
            onOk={ dataIsLoaded ? handleClose : handleDelete }
            onCancel={ modalClose }
            visible={ visible }
            confirmLoading={ loading }
            { ...defaultOptions }
        >
            { !dataIsLoaded && (
                <ul className={ styles.list }>
                    { sourceForRemove.map((item = {}, index) => (
                        <li key={ index }>{ item[listNameKey] }</li>
                    )) }
                </ul>
            ) }
            { hasDeleted && (
                <ul className={ styles.list }>
                    <span className={ styles.success }>{ SUCCESSFULLY_DELETED }</span>
                    <span>({ request.deleted.length })</span>
                    { request.deleted.map(({ item }, index) => (
                        <li key={ index }>{ item }</li>
                    )) }
                </ul>
            ) }
            { hasErrors && (
                <ul className={ styles.list }>
                    <span className={ styles.failed }>{ FAILED_DELETE }</span>
                    <span>({ request.errors.length })</span>
                    { request.errors.map(({ message, item }, index) => (
                        <li key={ index }><b>{ item }</b> - { message }</li>
                    )) }
                </ul>
            ) }
        </Modal>
    );
};

TableDeleteModal.propTypes = {
    sourceForRemove: PropTypes.array.isRequired,
    listIdForRemove: PropTypes.array.isRequired,
    listNameKey: PropTypes.string.isRequired,
    modalClose: PropTypes.func.isRequired,
    deleteFunction: PropTypes.func.isRequired,
    refreshTable: PropTypes.func.isRequired,
    visible: PropTypes.bool.isRequired,
    modalTitle: PropTypes.string,
    modalSuccessTitle: PropTypes.string,
    okTextSuccess: PropTypes.string,
    okTextDelete: PropTypes.string,
    cancelText: PropTypes.string,
};

export default TableDeleteModal;
