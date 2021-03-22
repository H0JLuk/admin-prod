import React from 'react';
import { SyncOutlined } from '@ant-design/icons';

import styles from './Loading.module.css';

const Loading = () => (
    <div className={ styles.loadingContainer }>
        <div className={ styles.loading }>
            <SyncOutlined spin />
        </div>
    </div>
);

export default Loading;
