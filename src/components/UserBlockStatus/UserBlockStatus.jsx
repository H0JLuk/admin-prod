import React from 'react';
import cn from 'classnames';

import styles from './UserBlockStatus.module.css';

const STATUS_BLOCKED = 'Заблокирован';
const STATUS_ACTIVE = 'Активен';

const UserBlockStatus = ({ blocked, withText, className = '' }) => (
    <div className={ className }>
        {withText && (
            blocked ? STATUS_BLOCKED : STATUS_ACTIVE
        ) }
        <div
            className={ cn({
                [styles.statusOff]: blocked,
                [styles.statusOn]: !blocked,
            }) }
        />
    </div>
);

export default UserBlockStatus;
