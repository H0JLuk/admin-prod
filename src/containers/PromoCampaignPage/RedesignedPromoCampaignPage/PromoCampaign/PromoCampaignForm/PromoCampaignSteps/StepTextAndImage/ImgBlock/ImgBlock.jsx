import React, { useCallback, useState, useEffect } from 'react';
import cn from 'classnames';
import { Button, Tooltip, message, Upload, Form } from 'antd';
import { getBase64 } from '../../../../../../../../utils/helper';
import { ExclamationCircleFilled } from '@ant-design/icons';

import { ReactComponent as Cross } from '../../../../../../../../static/images/cross.svg';

import styles from './ImgBlock.module.css';

const ADD = 'Добавить';

const customProps = {
    name: 'file',
    listType: 'picture',
};

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


const ImgBlock = ({
    initialValue = [],
    title,
    description,
    setting,
    tooltipImg,
    access_type,
    rules,
    type,
    name,
    onRemoveImg,
}) => {
    const [img, setImg] = useState('');
    const [fileList, setFileList] = useState([]);
    const [file] = fileList;
    const { originFileObj, name: filename } = file || {};

    useEffect(() => {
        (async () => {
            if (Array.isArray(initialValue) && initialValue[0]) {
                setImg(await getBase64(initialValue[0].originFileObj));
                setFileList(initialValue);
            }
        })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const onChange = useCallback(async (info) => {
        if (info.fileList.length > 1) {
            info.fileList = info.fileList.slice(-1);
        }

        if (!checkFileType(access_type).includes(info.file.type)) {
            message.error('Неверный формат картинки');
            return;
        }

        if (info.file.size / 1024 / 1024 > 1) {
            message.error('Размер файла должен быть меньше 1MB!');
            return;
        }

        setImg(await getBase64(info.file));
        setFileList(info.fileList);
    }, [access_type]);

    // function should always return `false` for in function `onChange` parameter file will be type `File`
    const onChangeFile = useCallback(() => false, []);

    const removeImg = useCallback((e) => {
        e.stopPropagation();
        onRemoveImg(name);
        setFileList([]);
    }, [onRemoveImg, name]);

    const normFile = useCallback(info => {
        if (Array.isArray(info)) {
            return info.slice(-1);
        }

        return info && info.fileList.slice(-1);
    }, []);

    const draggerClassName = cn(styles.dragContainer, {
        [styles.logo]: type === 'logo',
        [styles.banner]: type === 'banner'
    });

    return (
        <div className={ styles.container }>
            <div className={ styles.titleBlock }>
                <div className={ styles.title }>{ title }</div>
                <Tooltip
                    placement="right"
                    className={ styles.tooltipIcon }
                    overlayClassName={ styles.tooltip }
                    title={ <Img src={ tooltipImg } /> }
                >
                    <ExclamationCircleFilled />
                </Tooltip>
            </div>
            { file && <Cross className={ styles.cross } onClick={ removeImg } />}
            <Form.Item
                name={ name }
                rules={ rules }
                initialValue={ initialValue }
                valuePropName="fileList"
                getValueFromEvent={ normFile }
            >
                <Upload.Dragger
                    { ...customProps }
                    beforeUpload={ onChangeFile }
                    onChange={ onChange }
                    accept={ access_type }
                    multiple={ false }
                    showUploadList={ false }
                    className={ draggerClassName }
                >
                    {originFileObj ? (
                        <div className={ styles.imgPreviewWrap }>
                            <img className={ styles.previewImg } src={ img } alt="" />
                            <div className={ styles.footer }>
                                <div className={ styles.fileName }>
                                    { originFileObj.name || filename }
                                </div>
                                <div className={ styles.fileSize }>
                                    { (originFileObj.size / 1024).toFixed(2) }КБ
                                </div>
                            </div>
                        </div>
                    ) : (
                        <div className={ styles.noFile }>
                            <div>{ description }</div>
                            <p>{ setting }</p>
                            <Button className={ styles.btn }>{ ADD }</Button>
                        </div>
                    )}
                </Upload.Dragger>
            </Form.Item>
        </div>
    );
};

export default ImgBlock;

const Img = ({ src }) => (
    <img
        className={ styles.tooltipImg }
        src={ src }
        alt="img"
    />
);
