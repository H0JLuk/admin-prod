import React, { useCallback, useEffect, useState } from 'react';
import cn from 'classnames';
import { Form, Upload, message } from 'antd';
import { UploadOutlined } from '@ant-design/icons';
import ImagesBlock from '../../../../../../../../../components/ImagesBlock/ImagesBlock';
import { getBase64 } from '../../../../../../../../../utils/helper';
import { getFileURL } from '../../../../PromoCampaignFormUtils';
import { ReactComponent as Cross } from '../../../../../../../../../static/images/cross.svg';

import styles from './UploadFile.module.css';

const customProps = {
    name: 'file',
    listType: 'picture',
};

const UPLOAD_BUTTON_TEXT = 'Нажмите для загрузки';

const imageTypes = ['.jpg', '.jpeg', '.png'];
const svgTypes = ['.svg'];

const checkFileType = (access_types) => {
    const types = (access_types || '').split(',');
    const result = [];

    if (types.some((type) => imageTypes.includes(type))) {
        result.push('image/jpeg', 'image/png');
    }
    if (types.some((type) => svgTypes.includes(type))) {
        result.push('image/svg+xml');
    }

    return result;
};

const UploadFile = ({
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
    }, []);

    const onChange = useCallback(async (info) => {
        if (info.fileList.length > 1) {
            info.fileList = info.fileList.slice(-1);
        }
        if (!checkFileType(accept).includes(info.file.type)) {
            message.error('Неверный формат картинки');
            return;
        }

        if (info.file.size / 1024 / 1024 > 1) {
            message.error('Размер файла должен быть меньше 1MB!');
            return;
        }
        setImg(await getBase64(info.file));
        setFileList(info.fileList);
        setUrlFile(null);
    }, [accept]);

    const removeImg = useCallback((e) => {
        e.stopPropagation();
        onRemoveImg(name);
        setFileList([]);
        setUrlFile(null);
    }, [onRemoveImg, name]);

    const normFile = useCallback(info => {
        if (Array.isArray(info)) {
            return info.slice(-1);
        }

        return info && info.fileList.slice(-1);
    }, []);

    const draggerClassName = cn(styles.dragContainer, {
        [styles.logo]: type === 'logo',
        [styles.banner]: type === 'banner',
    });

    return (
        <div className={ cn(styles.container) }>
            {(file || imgURL) && removeIconView && (
                <Cross className={ styles.cross } onClick={ removeImg } />
            )}
            <Form.Item
                label={ label }
                name={ name }
                initialValue={ initialValue }
                valuePropName='file'
                rules={ rules || [] }
                getValueFromEvent={ normFile }
            >
                <Upload.Dragger
                    { ...customProps }
                    beforeUpload={ onChangeFile }
                    onChange={ onChange }
                    multiple={ false }
                    showUploadList={ false }
                    className={ draggerClassName }
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

export default UploadFile;