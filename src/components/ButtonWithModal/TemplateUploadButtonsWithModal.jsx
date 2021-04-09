import React, { useRef, useState } from 'react';
import { UploadOutlined } from '@ant-design/icons';
import { Button, message, Select, Upload, Form, Modal } from 'antd';
import { getReqOptions } from '../../api/services';
import { getClientAppList } from '../../api/services/clientAppService';
import { addUsersWithTemplate, deleteUsersWithTemplate } from '../../api/services/usersService';
import { downloadFileFunc } from '../../utils/helper';
import { getUsersSettingsByLoginType } from '../../constants/usersSettings';

import styles from './TemplateUploadButtonsWithModal.module.css';

const DOWNLOAD_FILE_NAME = 'Результат загрузки пользователей';
const WRONG_FILE_ERROR_TITLE = 'Неверный формат файла';
const OK_BUTTON_TITLE = 'Отправить';
const CANCEL_BUTTON_TITLE = 'Отменить';
const ADD_BUTTON_LABEL = 'Добавить';
const DELETE_BUTTON_LABEL = 'Удалить';
const DOWNLOAD_BUTTON_TITLE = 'Загрузить файл';
const APP_LABEL_TITLE = 'Приложение';
const FILE_LABEL_TITLE = 'Файл';

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

const DEFAULT_ON_SUCCESS_FUNC = function() {};

const TemplateUploadButtonsWithModal = ({ onSuccess = DEFAULT_ON_SUCCESS_FUNC }) => {
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [fileList, setFileList] = useState([]);
    const [appList, setAppList] = useState([]);
    const [loading, setLoading] = useState(false);
    const type = useRef('');
    const [form] = Form.useForm();

    const { creation, deleting } = getUsersSettingsByLoginType();

    const showModal = async ({ currentTarget: { value: buttonType } }) => {
        type.current = buttonType;
        setIsModalVisible(true);
        if (!appList.length) {
            const { clientApplicationDtoList: clientAppList = [] } = await getClientAppList() ?? {};
            setAppList(clientAppList.map(({ displayName, code }) => ({ value: code, label: displayName })));
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

            downloadFileFunc(URL.createObjectURL(response), DOWNLOAD_FILE_NAME, 'xlsx');

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
            message.error(WRONG_FILE_ERROR_TITLE);
            return undefined;
        }

        setFileList([info.file]);

        return info && info.file;
    };

    const onOkModal = () => {
        form.submit();
    };

    return (
        <>
            { creation && (
                <Button
                    type="primary"
                    value="edit"
                    onClick={ showModal }
                >
                    { ADD_BUTTON_LABEL }
                </Button>
            ) }
            { deleting && (
                <Button value="delete" onClick={ showModal }>
                    { DELETE_BUTTON_LABEL }
                </Button>
            ) }
            <Modal
                title={ MODAL_TITLE[type.current] }
                visible={ isModalVisible }
                confirmLoading={ loading }
                onCancel={ handleCancel }
                onOk={ onOkModal }
                okText={ OK_BUTTON_TITLE }
                cancelText={ CANCEL_BUTTON_TITLE }
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
                        label={ FILE_LABEL_TITLE }
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
                                { DOWNLOAD_BUTTON_TITLE }
                            </Button>
                        </Upload>
                    </Form.Item>
                    <Form.Item
                        className={ styles.formItem }
                        label={ APP_LABEL_TITLE }
                        name="appCode"
                        rules={ [{ required: true, message: RULES.APP_CODE }] }
                    >
                        <Select options={ appList } />
                    </Form.Item>
                </Form>
            </Modal>
        </>
    );
};

export default TemplateUploadButtonsWithModal;
