import React, { useCallback, useEffect, useState } from 'react';
import cn from 'classnames';
import { Form, Upload, message } from 'antd';
import { UploadChangeParam, UploadFile, UploadProps } from 'antd/lib/upload/interface';
import { FormItemProps } from 'antd/lib/form';
import { UploadOutlined } from '@ant-design/icons';
import { ReactComponent as Cross } from '@imgs/cross.svg';
import ImagesBlock from '../ImagesBlock';

import { getBase64, getFileURL } from '../../utils/helper';

import styles from './UploadPicture.module.css';

export type UploadPictureProps = {
    initialValue: UploadFile[] | string;
    description?: string;
    setting?: string;
    rules?: FormItemProps['rules'];
    type?: 'logo' | 'banner' | string;
    name: FormItemProps['name'];
    label: FormItemProps['label'];
    accept?: string;
    onRemoveImg?: (name: FormItemProps['name']) => void;
    removeIconView?: boolean;
    uploadButtonText?: string;
    uploadFileClassName?: string;
    maxFileSize?: number;
    validateFileSize?: boolean;
    footer?: boolean;
};

const customProps: UploadProps = {
    name: 'file',
    listType: 'picture',
};

const UPLOAD_BUTTON_TEXT = 'Нажмите для загрузки';

const checkFileSize = (fileSize: number, maxFileSize: number, validateFileSize: boolean): boolean =>
    !validateFileSize ? false : fileSize > 1024 * 1024 * maxFileSize;

const UploadPicture: React.FC<UploadPictureProps> = ({
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
    const [fileList, setFileList] = useState<UploadFile[]>([]);
    const [imgURL, setUrlFile] = useState<string | null>(null);
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

    const onChange = useCallback(async (info: UploadChangeParam) => {
        if (checkFileSize(info.file.size!, maxFileSize, validateFileSize)) {
            message.error(`Размер файла должен быть меньше ${maxFileSize}MB!`);
            return;
        }
        setImg(await getBase64(info.file));
        setFileList(info.fileList);
        setUrlFile(null);
    }, [maxFileSize, validateFileSize]);

    const removeImg = useCallback((e: React.MouseEvent<SVGSVGElement>) => {
        e.stopPropagation();
        typeof onRemoveImg === 'function' && onRemoveImg(name);
        setFileList([]);
        setUrlFile(null);
    }, [onRemoveImg, name]);

    const normFile = useCallback((info: UploadChangeParam) => {
        if (checkFileSize(info.file.size!, maxFileSize, validateFileSize)) {
            typeof onRemoveImg === 'function' && onRemoveImg(name);
            setFileList([]);
            setUrlFile(null);
            return [];
        }

        return info && info.fileList.slice(-1);
    }, [maxFileSize, validateFileSize, onRemoveImg, name]);

    const draggerClassName = cn(styles.dragContainer, {
        [styles.logo]: type === 'logo',
        [styles.banner]: type === 'banner',
    });

    return (
        <div className={cn(styles.container)}>
            {(file || imgURL) && removeIconView && (
                <Cross className={styles.cross} onClick={removeImg} />
            )}
            <Form.Item
                label={label}
                name={name}
                initialValue={initialValue}
                valuePropName="file"
                rules={rules || []}
                getValueFromEvent={normFile}
            >
                <Upload.Dragger
                    {...customProps}
                    beforeUpload={onChangeFile}
                    onChange={onChange}
                    showUploadList={false}
                    className={cn(draggerClassName, uploadFileClassName)}
                    accept={accept ?? ''}
                >
                    <ImagesBlock
                        originFileObj={originFileObj}
                        description={description}
                        setting={setting}
                        imgURL={imgURL}
                        base64URL={img}
                        type={type}
                        textButton={uploadButtonText}
                        iconButton={<UploadOutlined />}
                        footer={footer}
                    />
                </Upload.Dragger>
            </Form.Item>
        </div>
    );
};

export default UploadPicture;
