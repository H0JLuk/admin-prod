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
                    [styles.icon]: type === 'icon',
                }) }
            >
                <img
                    className={ cn({
                        [styles.image]: type === 'image',
                        [styles.imageIcon]: type === 'icon',
                    }) }
                    src={ src }
                    alt=""
                />
            </div>
            <div className={ styles.footer }>
                <div className={ styles.fileName }>
                    { (src || '').split('/').pop() }
                </div>
                {/* TODO: Добавить размер файла, когда определимся откуда мы его будем брать (с бэка или из Blob?) */}
                <div className={ styles.fileSize }>{ size }</div>
            </div>
        </div>
    </>
);