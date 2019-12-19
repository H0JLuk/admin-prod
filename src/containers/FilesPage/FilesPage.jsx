import React from 'react';
import styles from './FilesPage.module.css';
import Button from '../../components/Button/Button';
import { getOffers, getFeedback } from '../../api/services/adminService';
import { downloadFile } from '../../utils/helper';

const FilesPage = (props) => {
    const getData = (func, name) => () => {
        func().then((data) => {
            downloadFile(data, name);
        });
    };

    return (
        <div className={styles.container}>
            <Button
                label='Скачать предложения'
                onClick={getData(getOffers, 'offers')}
                className={styles.container__button}
                type='green'
                font='roboto'/>
            <Button
                label='Скачать фидбэк'
                onClick={getData(getFeedback, 'feedback')}
                className={styles.container__button}
                type='green'
                font='roboto'/>
        </div>
    )
};

export default FilesPage;