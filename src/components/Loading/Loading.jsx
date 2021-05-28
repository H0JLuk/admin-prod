import React from 'react';
import cn from 'classnames';
import { SyncOutlined } from '@ant-design/icons';

import styles from './Loading.module.css';

const Loading = ({ className }) => (
    <div className={ cn(styles.loadingContainer, className) }>
        <div className={ styles.loading }>
            <SyncOutlined spin />
        </div>
    </div>
);

export default React.memo(Loading);
