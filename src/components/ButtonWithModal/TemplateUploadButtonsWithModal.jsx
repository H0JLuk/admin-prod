import React, { useRef, useState } from 'react';
import noop from 'lodash/noop';
import { UploadOutlined } from '@ant-design/icons';
import { Button, message, Select, Upload, Form, Modal } from 'antd';
import { getReqOptions } from '../../api/services';
import { getClientAppList } from '../../api/services/clientAppService';
import { addUsersWithTemplate, deleteUsersWithTemplate } from '../../api/services/usersService';
import { downloadFileFunc } from '../../utils/helper';

import styles from './TemplateUploadButtonsWithModal.module.css';

const DOWNLOAD_FILE_NAME = 'Результат обработки пользователей';
const ERROR_WRONG_FILE_TEXT = 'Неверный формат файла';
const BUTTON_OK_LABEL = 'Отправить';
const BUTTON_CANCEL_LABEL = 'Отменить';
const BUTTON_ADD_LABEL = 'Добавить';
const BUTTON_DELETE_LABEL = 'Удалить';
const BUTTON_DOWNLOAD_LABEL = 'Загрузить файл';
const APP_LABEL_TEXT = 'Приложение';
const FILE_LABEL_TEXT = 'Файл';

const FETCH_ERRORS = {
    edit: 'Не удалось загрузить пользователей.',
    delete: 'Не удалось удалить пользователей.',
};

const MODAL_TITLE = {
    edit: 'Загрузка пользователей',
    delete: 'Удаление пользователей',
};

const RULES = {
    FILE: 'Выберите файл',
    APP_CODE: 'Выберите приложение',
};

const fileTypes = ['csv'];
const UPLOAD_ACCEPT = `.${ fileTypes.join(', .') }`;

const TemplateUploadButtonsWithModal = ({
    onSuccess = noop,
    btnAddShow = true,
    btnAddLabel = BUTTON_ADD_LABEL,
    btnDeleteShow = true,
    btnDeleteLabel = BUTTON_DELETE_LABEL,
}) => {
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [fileList, setFileList] = useState([]);
    const [appsOptions, setAppsOptions] = useState([]);
    const [loading, setLoading] = useState(false);
    const type = useRef('');
    const [form] = Form.useForm();

    const showModal = async ({ currentTarget: { value: buttonType } }) => {
        type.current = buttonType;
        setIsModalVisible(true);
        if (!appsOptions.length) {
            const { clientApplicationDtoList: clientAppList = [] } = await getClientAppList() ?? {};
            const filteredAppOptions = clientAppList
                .filter(({ isDeleted }) => !isDeleted)
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

    const handleFinish = async ({ file, appCode }) => {
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
            message.error(`${FETCH_ERRORS[type.current]} ${e.message}`);
        }
    };

    const onRemoveFile = () => setFileList([]);

    const normFile = (info) => {
        if (Array.isArray(info)) {
            return info.slice(-1)[0];
        }

        if (info.file.status === 'removed' || !info.file) {
            return undefined;
        }

        const fileExtension = info.file.name.split('.').pop();
        if (!fileTypes.includes(fileExtension)) {
            message.error(ERROR_WRONG_FILE_TEXT);
            return undefined;
        }

        setFileList([info.file]);

        return info && info.file;
    };

    return (
        <>
            { btnAddShow && (
                <Button
                    type="primary"
                    value="edit"
                    onClick={ showModal }
                >
                    { btnAddLabel }
                </Button>
            ) }
            { btnDeleteShow && (
                <Button value="delete" onClick={ showModal }>
                    { btnDeleteLabel }
                </Button>
            ) }
            <Modal
                title={ MODAL_TITLE[type.current] }
                visible={ isModalVisible }
                confirmLoading={ loading }
                onCancel={ handleCancel }
                onOk={ form.submit }
                okText={ BUTTON_OK_LABEL }
                cancelText={ BUTTON_CANCEL_LABEL }
                centered
            >
                <Form
                    className={ styles.form }
                    id={ type.current }
                    form={ form }
                    onFinish={ handleFinish }
                    layout="vertical"
                >
                    <Form.Item
                        className={ styles.formItem }
                        rules={ [{ required: true, message: RULES.FILE }] }
                        label={ FILE_LABEL_TEXT }
                        name="file"
                        valuePropName="file"
                        getValueFromEvent={ normFile }
                    >
                        <Upload
                            accept={ UPLOAD_ACCEPT }
                            onRemove={ onRemoveFile }
                            beforeUpload={ onChangeFile }
                            fileList={ fileList }
                        >
                            <Button
                                className={ styles.uploadBtn }
                                disabled={ fileList.length }
                                icon={ <UploadOutlined /> }
                            >
                                { BUTTON_DOWNLOAD_LABEL }
                            </Button>
                        </Upload>
                    </Form.Item>
                    <Form.Item
                        className={ styles.formItem }
                        label={ APP_LABEL_TEXT }
                        name="appCode"
                        rules={ [{ required: true, message: RULES.APP_CODE }] }
                    >
                        <Select
                            placeholder="Выберите приложение"
                            options={ appsOptions }
                        />
                    </Form.Item>
                </Form>
            </Modal>
        </>
    );
};

export default TemplateUploadButtonsWithModal;
