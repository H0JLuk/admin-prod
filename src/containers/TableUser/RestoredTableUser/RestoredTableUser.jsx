import React from 'react';
import { Button } from 'antd';
import styles from './RestoredTableUser.module.css';
import { generateCsvFile } from '../../../utils/helper';

const TITLE = 'Пароль успешно сброшен для:';
const EXPORT = 'Экспорт паролей';

const RestoredTableUser = ({ users }) => {

    const exportCSV = () => {
        generateCsvFile(users.reduce((prev, item) => ([...prev, Object.values(item)]), []));
    };
    return (
        <>
            <p className={ styles.titleRestored }>
                { TITLE }
            </p>
            <p className={ styles.usersList }>
                { users.map(({ personalNumber }) => personalNumber).join(', ') }
            </p>
            <div className={ styles.buttonWrapper }>
                <Button onClick={ exportCSV } className={ styles.button }>
                    { EXPORT }
                </Button>
            </div>
        </>
    );
};


export default RestoredTableUser;