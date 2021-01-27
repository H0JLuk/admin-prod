import React, { useEffect, useState } from 'react';
import { InboxOutlined } from '@ant-design/icons';
import { Typography, Form, Modal, Upload, Button } from 'antd';
import { warnNotice } from '../../../../../../../components/toast/Notice';
import example from '../../../../../../../static/images/promoCodeUploadExample.png';

import styles from './UploadPromoCodesModal.module.css';

const { Paragraph } = Typography;

const TITLE = 'Загрузить промо-коды';
const CANCEL_TEXT = 'Отменить';
const OK_TEXT = 'Сохранить';
const UPLOAD_TEXT = 'Загрузить файл';
const FORMAT_TEXT = 'Файл с промокодами должен быть в формат .xls или .xlsx.';
const REQUIRE_TEXT = 'Промокоды в файле должны быть перечислены в первом столбце (столбце "A") первого листа файла.';
const PROMO_CODES_TYPE_TEXT = 'Если тип промокода - COMMON (один промо код для всех), то в файле должен быть строго один промо код.';

const acceptedTypes = '.xls,.xlsx';

const initialState = {
    currentPromoCampaign: null,
    uploading: false,
    file: null,
    fileList: [],
};

const UploadPromoCodesModal = ({ open, onClose, onSave }) => {
    const [state, setState] = useState(initialState);

    const handleSubmit = (e) => {
        e && e.preventDefault();
        handleUpload();
    };

    const handleUpload = () => {
        const { file } = state;
        setState((prev) => ({ ...prev, uploading: true }));
        if (!state.file) {
            return warnNotice('Выберите файл для загрузки!');
        } else if (state.fileList.length > 1) {
            return warnNotice('Можно загрузить только один файл за раз!');
        }
        let formData = new FormData();
        formData.append('file', file, file.name);
        onSave(formData);
        clearState();
    };

    const customProps = {
        name: 'file',
        multiple: false,
        uploading: false,
        accept: acceptedTypes,
        fileList: state.fileList,
        onRemove: (file) => {
            setState((state) => {
                const index = state.fileList.indexOf(file);
                const newFileList = state.fileList.slice();
                newFileList.splice(index, 1);
                return { ...state, fileList: newFileList };
            });
        },
        beforeUpload: (file) => {
            setState((prev) => ({ ...prev, file }));
            return false;
        },
        onChange: (info) => {
            if (info.fileList.length > 1) {
                info.fileList = info.fileList.slice(-1);
            }
            setState((prev) => ({ ...prev, fileList: info.fileList }));
        },
    };

    const clearState = () => {
        setState(initialState);
    };

    const handleClose = () => {
        clearState();
        onClose();
    };

    useEffect(() => {
        return () => {
            clearState();
            onClose();
        };
    }, []);

    return (
        <Modal
            title={ TITLE }
            visible={ open }
            onOk={ handleSubmit }
            okText={ OK_TEXT }
            onCancel={ handleClose }
            cancelText={ CANCEL_TEXT }
            cancelButtonProps={ { className: styles.btn } }
            maskClosable={ false }
            destroyOnClose
        >
            <Paragraph>{ FORMAT_TEXT }</Paragraph>
            <Paragraph>{ REQUIRE_TEXT }</Paragraph>
            <Paragraph>{ PROMO_CODES_TYPE_TEXT }</Paragraph>
            <img src={ example } alt='example' width='50%' />
            <Form layout='vertical' onSubmit={ handleSubmit }>
                <Form.Item required label='Excel файл'>
                    <Upload.Dragger uploading={ state.uploading } { ...customProps } className={ styles.dragContainer }>
                        <p className='ant-upload-drag-icon'>
                            <InboxOutlined />
                        </p>
                        <Button className={ styles.btn }>{ UPLOAD_TEXT }</Button>
                    </Upload.Dragger>
                </Form.Item>
            </Form>
        </Modal>
    );
};

export default UploadPromoCodesModal;
