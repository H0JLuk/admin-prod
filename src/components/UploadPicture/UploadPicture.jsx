import React, { useCallback, useEffect, useState } from 'react';
import cn from 'classnames';
import { Form, Upload, message } from 'antd';
import { UploadOutlined } from '@ant-design/icons';
import { ReactComponent as Cross } from '../../static/images/cross.svg';
import ImagesBlock from '../ImagesBlock/ImagesBlock';

import { getBase64, getFileURL } from '../../utils/helper';

import styles from './UploadPicture.module.css';

const customProps = {
    name: 'file',
    listType: 'picture',
};

const UPLOAD_BUTTON_TEXT = 'Нажмите для загрузки';

const imagesMimeTypes = {
    '.jpeg': 'image/jpeg',
    '.jpg': 'image/jpeg',
    '.png': 'image/png',
    '.svg': 'image/svg+xml',
};

const checkFileType = (access_types) => (access_types || '').split(',').map((type) => imagesMimeTypes[type]);

const checkFileSize = (fileSize, maxFileSize, validateFileSize) => {
    return !validateFileSize ? false : fileSize > 1024 * 1024 * maxFileSize;
};

const UploadPicture = ({
    initialValue = [],
    description,
    setting,
    rules,
    type,
    name,
    label,
    accept,
    onRemoveImg,
    removeIconView = true,
    uploadButtonText = UPLOAD_BUTTON_TEXT,
    uploadFileClassName,
    maxFileSize = 2,
    validateFileSize = true,
    footer,
}) => {
    const [img, setImg] = useState('');
    const [fileList, setFileList] = useState([]);
    const [imgURL, setUrlFile] = useState(null);
    const [file] = fileList;
    const { originFileObj } = file || {};

    // function should always return `false` for in function `onChange` parameter file will be type `File`
    const onChangeFile = useCallback(() => false, []);

    useEffect(() => {
        (async () => {
            if (Array.isArray(initialValue) && initialValue[0]) {
                setImg(await getBase64(initialValue[0].originFileObj));
                setFileList(initialValue);
            }
            if (typeof initialValue === 'string') {
                const url = !initialValue.startsWith('http') ? getFileURL(initialValue) : initialValue;
                setUrlFile(url);
            }
        })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [initialValue]);

    const onChange = useCallback(async (info) => {
        if (info.fileList.length > 1) {
            info.fileList = info.fileList.slice(-1);
        }

        if (!checkFileType(accept).includes(info.file.type)) {
            message.error('Неверный формат картинки');
            return;
        }
        if (checkFileSize(info.file.size, maxFileSize, validateFileSize)) {
            message.error(`Размер файла должен быть меньше ${maxFileSize}MB!`);
            return;
        }
        setImg(await getBase64(info.file));
        setFileList(info.fileList);
        setUrlFile(null);
    }, [accept, maxFileSize, validateFileSize]);

    const removeImg = useCallback((e) => {
        e.stopPropagation();
        typeof onRemoveImg === 'function' && onRemoveImg(name);
        setFileList([]);
        setUrlFile(null);
    }, [onRemoveImg, name]);

    const normFile = useCallback(info => {
        if (Array.isArray(info)) {
            return info.slice(-1);
        }

        if (!checkFileType(accept).includes(info.file.type) || checkFileSize(info.file.size, maxFileSize, validateFileSize)) {
            typeof onRemoveImg === 'function' && onRemoveImg(name);
            setFileList([]);
            setUrlFile(null);
            return [];
        }

        return info && info.fileList.slice(-1);
    }, [accept, maxFileSize, validateFileSize, onRemoveImg, name]);

    const draggerClassName = cn(styles.dragContainer, {
        [styles.logo]: type === 'logo',
        [styles.banner]: type === 'banner',
    });

    return (
        <div className={ cn(styles.container) }>
            { (file || imgURL) && removeIconView && (
                <Cross className={ styles.cross } onClick={ removeImg } />
            ) }
            <Form.Item
                label={ label }
                name={ name }
                initialValue={ initialValue }
                valuePropName="file"
                rules={ rules || [] }
                getValueFromEvent={ normFile }
            >
                <Upload.Dragger
                    { ...customProps }
                    beforeUpload={ onChangeFile }
                    onChange={ onChange }
                    multiple={ false }
                    showUploadList={ false }
                    className={ cn(draggerClassName, uploadFileClassName) }
                    accept={ accept ?? '' }
                >
                    <ImagesBlock
                        originFileObj={ originFileObj }
                        description={ description }
                        setting={ setting }
                        imgURL={ imgURL }
                        base64URL={ img }
                        type={ type }
                        textButton={ uploadButtonText }
                        iconButton={ <UploadOutlined /> }
                        footer={ footer }
                    />
                </Upload.Dragger>
            </Form.Item>
        </div>
    );
};

export default UploadPicture;
