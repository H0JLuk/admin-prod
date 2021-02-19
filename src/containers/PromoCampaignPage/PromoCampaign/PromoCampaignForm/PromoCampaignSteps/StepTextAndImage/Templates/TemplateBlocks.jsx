import React from 'react';
import cn from 'classnames';
import styles from './Template.module.css';

export const TextBlock = ({ label, text }) => (
    <>
        <div className={ styles.title }>{ label }</div>
        <div>{ text }</div>
    </>
);

export const ImageBlock = ({ label, type, src, size }) => (
    <>
        <div className={ styles.title }>
            { label }
        </div>
        <div className={ styles.block }>
            <div
                className={ cn({
                    [styles.logo]: type === 'logo',
                }) }
            >
                <img
                    className={ cn({
                        [styles.banner]: type === 'banner',
                        [styles.imageLogo]: type === 'logo',
                    }) }
                    src={ src }
                    alt=""
                />
            </div>
            <div className={ styles.footer }>
                <div className={ styles.fileName }>
                    { (src || '').split('/').pop() }
                </div>
                { /* FIXME: Добавить размер файла, когда определимся откуда мы его будем брать (с бэка или из Blob?) */ }
                <div className={ styles.fileSize }>{ size }</div>
            </div>
        </div>
    </>
);