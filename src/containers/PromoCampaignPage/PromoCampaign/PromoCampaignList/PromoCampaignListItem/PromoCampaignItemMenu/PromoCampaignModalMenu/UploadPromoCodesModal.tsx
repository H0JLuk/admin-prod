import React, { MouseEvent, useEffect, useState } from 'react';
import { InboxOutlined } from '@ant-design/icons';
import { Typography, Form, Modal, Upload, Button, UploadProps } from 'antd';
import { warnNotice } from '@components/toast/Notice';
import example from '@imgs/promoCodeUploadExample.png';
import { UploadChangeParam, UploadFile } from 'antd/lib/upload/interface';
import { BUTTON_TEXT } from '@constants/common';
import { PromoCampaignDto } from '@types';

import styles from './UploadPromoCodesModal.module.css';

const { Paragraph } = Typography;

const TITLE = 'Загрузить промо-коды';
const UPLOAD_TEXT = 'Загрузить файл';
const FORMAT_TEXT = 'Файл с промокодами должен быть в формате .csv.';
const REQUIRE_TEXT = 'Промокоды в файле должны быть перечислены в первом столбце (столбце "A") первого листа файла.';
const PROMO_CODES_TYPE_TEXT = 'Если тип промокода - COMMON (один промо код для всех), то в файле должен быть строго один промо код.';

const acceptedTypes = '.csv';

const initialState = {
    currentPromoCampaign: null,
    uploading: false,
    file: null,
    fileList: [],
};

type UploadPromoCodesModalProps = {
    title?: string;
    currentPromoCampaign?: PromoCampaignDto;
    open: boolean;
    onClose: () => void;
    onSave: (val: FormData) => Promise<void>;
};

type UploadPromoCodesModalState = {
    currentPromoCampaign: null;
    uploading: boolean;
    file: File | null;
    fileList: UploadFile[];
};

const UploadPromoCodesModal: React.FC<UploadPromoCodesModalProps> = ({ open, onClose, onSave }) => {
    const [state, setState] = useState<UploadPromoCodesModalState>(initialState);

    const handleSubmit = (e: MouseEvent) => {
        e?.preventDefault();
        handleUpload();
    };

    const handleUpload = async () => {
        const { file } = state;

        if (!state.file) {
            return warnNotice('Выберите файл для загрузки!');
        } else if (state.fileList.length > 1) {
            return warnNotice('Можно загрузить только один файл за раз!');
        }

        setState((prev) => ({ ...prev, uploading: false }));

        const formData = new FormData();
        formData.append('file', file as Blob, file?.name);
        await onSave(formData);
        clearState();
    };

    const customProps: UploadProps = {
        name: 'file',
        accept: acceptedTypes,
        fileList: state.fileList,
        onRemove: (file: UploadFile) => {
            setState((prev) => {
                const index = prev.fileList.indexOf(file);
                const newFileList = prev.fileList.slice();
                newFileList.splice(index, 1);
                return { ...prev, fileList: newFileList };
            });
        },
        beforeUpload: (file: File) => {
            setState((prev) => ({ ...prev, file }));
            return false;
        },
        onChange: (info: UploadChangeParam) => {
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

    useEffect(() => () => {
        clearState();
        onClose();
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return (
        <Modal
            title={TITLE}
            visible={open}
            onOk={handleSubmit}
            okButtonProps={{ loading: state.uploading }}
            okText={BUTTON_TEXT.SAVE}
            onCancel={handleClose}
            cancelText={BUTTON_TEXT.CANCEL}
            cancelButtonProps={{ className: styles.btn }}
            maskClosable={false}
            destroyOnClose
        >
            <Paragraph>{FORMAT_TEXT}</Paragraph>
            <Paragraph>{REQUIRE_TEXT}</Paragraph>
            <Paragraph>{PROMO_CODES_TYPE_TEXT}</Paragraph>
            <img src={example} alt="example" width="50%" />
            <Form
                layout="vertical"
                onFinish={handleSubmit}
            >
                <Form.Item required label="CSV файл">
                    <Upload.Dragger {...customProps} className={styles.dragContainer}>
                        <p className="ant-upload-drag-icon">
                            <InboxOutlined />
                        </p>
                        <Button className={styles.btn} loading={state.uploading}>{UPLOAD_TEXT}</Button>
                    </Upload.Dragger>
                </Form.Item>
            </Form>
        </Modal>
    );
};

export default UploadPromoCodesModal;
