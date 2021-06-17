import React from 'react';
import cn from 'classnames';
import { Tooltip } from 'antd';
import { ExclamationCircleFilled } from '@ant-design/icons';

import styles from './LabelWithTooltip.module.css';

type LabelWithTooltipProps = {
    title: React.ReactNode;
    tooltip: React.ReactNode;
    isImage?: boolean;
};

const LabelWithTooltip: React.FC<LabelWithTooltipProps> = ({ tooltip, title, isImage }) => {
    const tooltipTitle = isImage ? (
        <img
            className={styles.tooltipImg}
            src={typeof tooltip === 'string' ? tooltip : ''}
            alt="img"
        />
    ) : (
        <div className={styles.tooltipText}>
            {tooltip}
        </div>
    );

    return (
        <div className={styles.titleBlock}>
            <div className={styles.title} >
                {title}
            </div>
            <Tooltip
                placement={isImage ? 'right' : 'top'}
                className={styles.tooltipIcon}
                overlayClassName={cn(styles.tooltip, { [styles.text]: !isImage })}
                title={tooltipTitle}
            >
                <ExclamationCircleFilled />
            </Tooltip>
        </div>
    );
};

export function getLabel(title: React.ReactNode, tooltip: React.ReactNode, isImage?: boolean) {
    return <LabelWithTooltip title={title} tooltip={tooltip} isImage={isImage} />;
}
