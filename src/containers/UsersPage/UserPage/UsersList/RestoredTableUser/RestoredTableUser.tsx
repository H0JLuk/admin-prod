import React from 'react';
import { UserInfo } from '@types';
import { Button } from 'antd';
import { generateCsvFile } from '../../../../../utils/helper';

import styles from './RestoredTableUser.module.css';

type RestoredUser = {
    personalNumber: UserInfo['personalNumber'];
    generatedPassword: string;
};

export type RestoredTableUserProps = {
    users: RestoredUser[];
};

const TITLE = 'Пароль успешно сброшен для:';
const EXPORT = 'Экспорт паролей';


const RestoredTableUser: React.FC<RestoredTableUserProps> = ({ users }) => {

    const exportCSV = () => {
        generateCsvFile(users.reduce((prev: string[][], item) => ([...prev, Object.values(item)]), []));
    };
    return (
        <>
            <p className={styles.titleRestored}>
                {TITLE}
            </p>
            <p className={styles.usersList}>
                {users.map(({ personalNumber }) => personalNumber).join(', ')}
            </p>
            <div className={styles.buttonWrapper}>
                <Button
                    type="primary"
                    onClick={exportCSV}
                >
                    {EXPORT}
                </Button>
            </div>
        </>
    );
};

export default RestoredTableUser;
