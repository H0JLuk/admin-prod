import React from 'react';
import cn from 'classnames';

import styles from './Template.module.css';

interface ITextBlock {
    label: string;
    text: string;
}

type IImageBlockProps = {
    label?: string;
    type?: 'logo' | 'banner' | 'text';
    src?: string;
    size?: string | number;
};

export const TextBlock: React.FC<ITextBlock> = ({ label, text }) => (
    <>
        <div className={styles.title}>{label}</div>
        <div className={styles.text}>{text}</div>
    </>
);

export const ImageBlock: React.FC<IImageBlockProps> = ({ label, type, src, size }) => (
    <>
        <div className={styles.title}>
            {label}
        </div>
        <div className={styles.block}>
            <div
                className={cn({
                    [styles.logo]: type === 'logo',
                })}
            >
                <img
                    className={cn({
                        [styles.banner]: type === 'banner',
                        [styles.imageLogo]: type === 'logo',
                    })}
                    src={src}
                    alt=""
                />
            </div>
            <div className={styles.footer}>
                <div className={styles.fileName}>
                    {(src || '').split('/').pop()}
                </div>
                <div className={styles.fileSize}>{size}</div>
            </div>
        </div>
    </>
);
