import React from 'react';
import cn from 'classnames';
import { Button } from 'antd';

import styles from './ImagesBlock.module.css';

function getFileName(file) {
    return file.split('/').pop() || '';
}

const ImagesBlock = ({
    textButton,
    base64URL,
    imgURL,
    originFileObj,
    setting,
    description,
    iconButton,
    footer,
    type,
}) => {
    if (!originFileObj && !imgURL) {
        return (
            <div className={ styles.noFile }>
                { description && <div>{ description }</div> }
                { setting && <p>{ setting }</p> }
                <Button className={ styles.uploadButton } icon={ iconButton ?? null }>
                    { textButton }
                </Button>
            </div>
        );
    }

    return (
        <div className={ cn(styles.imgPreviewWrap, { [styles.logo]: type === 'logo' }) }>
            <img
                className={ cn(styles.previewImg, {
                    [styles.banner]: type === 'banner',
                    [styles.imageLogo]: type === 'logo',
                }) }
                src={ base64URL ? base64URL : imgURL }
                alt=""
            />
            { footer && (
                <div className={ styles.footer }>
                    { !imgURL ? (
                        <>
                            <div>{ originFileObj.name }</div>
                            <div>{ (originFileObj.size / 1024).toFixed(2) }КБ</div>
                        </>
                    ) : (
                        <div>{ getFileName(imgURL) }</div>
                    ) }
                </div>
            ) }
        </div>
    );
};

export default ImagesBlock;
