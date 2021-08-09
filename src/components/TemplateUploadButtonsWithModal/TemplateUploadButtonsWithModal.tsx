import React, { MouseEvent, useRef, useState } from 'react';
import noop from 'lodash/noop';
import { UploadOutlined } from '@ant-design/icons';
import { Button, message, Select, Upload, Form, Modal, SelectProps } from 'antd';
import { UploadChangeParam, UploadFile } from 'antd/lib/upload/interface';
import { getReqOptions } from '@apiServices';
import { getActiveClientApps } from '@apiServices/clientAppService';
import { addUsersWithTemplate, deleteUsersWithTemplate } from '@apiServices/usersService';
import { downloadFileFunc } from '@utils/helper';
import { BUTTON_TEXT } from '@constants/common';

import styles from './TemplateUploadButtonsWithModal.module.css';

const DOWNLOAD_FILE_NAME = 'Результат обработки пользователей';
const BUTTON_OK_LABEL = 'Отправить';
const BUTTON_DOWNLOAD_LABEL = 'Загрузить файл';
const APP_LABEL_TEXT = 'Приложение';
const FILE_LABEL_TEXT = 'Файл';

enum UploadModalTypes {
    EDIT = 'edit',
    DELETE = 'delete',
}

const FETCH_ERRORS: Record<UploadModalTypes, string> = {
    edit: 'Не удалось загрузить пользователей.',
    delete: 'Не удалось удалить пользователей.',
};

const MODAL_TITLE: Record<UploadModalTypes, string> = {
    edit: 'Загрузка пользователей',
    delete: 'Удаление пользователей',
};

const fileTypes = ['csv'];
const UPLOAD_ACCEPT = `.${ fileTypes.join(', .') }`;

type TemplateUploadButtonsWithModalProps = {
    onSuccess?: () => void;
    btnAddShow?: boolean;
    btnAddLabel?: string;
    btnDeleteShow?: boolean;
    btnDeleteLabel?: string;
};

type HandleFinishParams = {
    file: File;
    appCode: string;
};

type AppListOptions = Exclude<SelectProps<string>['options'], undefined>;

const TemplateUploadButtonsWithModal: React.FC<TemplateUploadButtonsWithModalProps> = ({
    onSuccess = noop,
    btnAddShow = true,
    btnAddLabel = BUTTON_TEXT.ADD,
    btnDeleteShow = true,
    btnDeleteLabel = BUTTON_TEXT.DELETE,
}) => {
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [fileList, setFileList] = useState<UploadFile[]>([]);
    const [appsOptions, setAppsOptions] = useState<AppListOptions>([]);
    const [loading, setLoading] = useState(false);
    const type = useRef('' as UploadModalTypes);
    const [form] = Form.useForm();

    const showModal = async ({ currentTarget: { value: buttonType } }: MouseEvent<HTMLButtonElement>) => {
        type.current = buttonType as UploadModalTypes;
        setIsModalVisible(true);
        if (!appsOptions.length) {
            const clientAppList = await getActiveClientApps();
            const filteredAppOptions = clientAppList
                .map(({ code, displayName }) => ({ value: code, label: displayName }));
            setAppsOptions(filteredAppOptions);
        }
    };

    const clearStateAndForm = () => {
        setLoading(false);
        setFileList([]);
        form.resetFields();
    };

    const handleCancel = () => {
        setIsModalVisible(false);
        clearStateAndForm();
    };

    // function should always return `false` for in function `onChange` parameter file will be type `File`
    const onChangeFile = () => false;

    const handleFinish = async ({ file, appCode }: HandleFinishParams) => {
        setLoading(true);
        const options = getReqOptions();
        options.headers.clientAppCode = appCode;

        const data = new FormData();
        data.append('multipartUsersFile', file, file.name);

        try {
            const requestFunc = type.current === 'edit' ? addUsersWithTemplate : deleteUsersWithTemplate;
            const response = await requestFunc(appCode, data);

            downloadFileFunc(URL.createObjectURL(response), DOWNLOAD_FILE_NAME);

            setIsModalVisible(false);
            clearStateAndForm();
            onSuccess();
        } catch (e) {
            setLoading(false);
            message.error(`${FETCH_ERRORS[type.current as UploadModalTypes]} ${e.message}`);
        }
    };

    const onRemoveFile = () => setFileList([]);

    const normFile = (info: UploadChangeParam) => {
        if (info.file.status === 'removed' || !info.file) {
            return undefined;
        }

        setFileList([info.file]);

        return info?.file;
    };

    return (
        <>
            {btnAddShow && (
                <Button
                    type="primary"
                    value="edit"
                    onClick={showModal}
                >
                    {btnAddLabel}
                </Button>
            )}
            {btnDeleteShow && (
                <Button value="delete" onClick={showModal}>
                    {btnDeleteLabel}
                </Button>
            )}
            <Modal
                title={MODAL_TITLE[type.current]}
                visible={isModalVisible}
                confirmLoading={loading}
                onCancel={handleCancel}
                onOk={form.submit}
                okText={BUTTON_OK_LABEL}
                cancelText={BUTTON_TEXT.CANCEL}
                centered
            >
                <Form
                    className={styles.form}
                    id={type.current}
                    form={form}
                    onFinish={handleFinish}
                    layout="vertical"
                >
                    <Form.Item
                        className={styles.formItem}
                        rules={[{ required: true, message: 'Выберите файл' }]}
                        label={FILE_LABEL_TEXT}
                        name="file"
                        valuePropName="file"
                        getValueFromEvent={normFile}
                    >
                        <Upload
                            accept={UPLOAD_ACCEPT}
                            onRemove={onRemoveFile}
                            beforeUpload={onChangeFile}
                            fileList={fileList}
                        >
                            <Button
                                className={styles.uploadBtn}
                                disabled={!!fileList.length}
                                icon={<UploadOutlined />}
                            >
                                {BUTTON_DOWNLOAD_LABEL}
                            </Button>
                        </Upload>
                    </Form.Item>
                    <Form.Item
                        className={styles.formItem}
                        label={APP_LABEL_TEXT}
                        name="appCode"
                        rules={[{ required: true, message: 'Выберите приложение' }]}
                    >
                        <Select
                            placeholder="Выберите приложение"
                            options={appsOptions}
                        />
                    </Form.Item>
                </Form>
            </Modal>
        </>
    );
};

export default TemplateUploadButtonsWithModal;
