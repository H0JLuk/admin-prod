import React from 'react';
import cn from 'classnames';
import { SyncOutlined } from '@ant-design/icons';

import styles from './Loading.module.css';

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const Loading: React.FC<React.HTMLProps<HTMLDivElement>> = ({ className, children, ...rest }) => (
    <div className={cn(styles.loadingContainer, className)} {...rest} data-testid="loader">
        <div className={styles.loading}>
            <SyncOutlined spin />
        </div>
    </div>
);

export default React.memo(Loading);
