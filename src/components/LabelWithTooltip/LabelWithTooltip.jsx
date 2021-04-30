import React from 'react';
import cn from 'classnames';
import { Tooltip } from 'antd';
import { ExclamationCircleFilled } from '@ant-design/icons';

import styles from './LabelWithTooltip.module.css';

const LabelWithTooltip = ({ tooltip, title, isImage }) => {
    const tooltipTitle = isImage ? (
        <img
            className={ styles.tooltipImg }
            src={ tooltip }
            alt="img"
        />
    ) : (
        <div className={ styles.tooltipText }>
            { tooltip }
        </div>
    );

    return (
        <div className={ styles.titleBlock }>
            <div className={ styles.title } >
                { title }
            </div>
            <Tooltip
                placement={ isImage ? 'right' : 'top' }
                className={ styles.tooltipIcon }
                overlayClassName={ cn(styles.tooltip, { [styles.text]: !isImage }) }
                title={ tooltipTitle }
            >
                <ExclamationCircleFilled />
            </Tooltip>
        </div>
    );
};

/**
 * @param {React.ReactNode} title
 * @param {React.ReactNode} tooltip
 * @param {boolean} isImage
 */
export function getLabel(title, tooltip, isImage) {
    return <LabelWithTooltip title={ title } tooltip={ tooltip } isImage={ isImage } />;
}
