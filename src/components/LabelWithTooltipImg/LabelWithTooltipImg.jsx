import React from 'react';
import { Tooltip } from 'antd';
import { ExclamationCircleFilled } from '@ant-design/icons';

import styles from './LabelWithTooltipImg.module.css';

const LabelWithTooltipImg = ({ tooltipImg, title }) => (
        <div className={ styles.titleBlock }>
            <div className={ styles.title } >
                { title }
            </div>
            <Tooltip
                placement="right"
                className={ styles.tooltipIcon }
                overlayClassName={ styles.tooltip }
                title={
                    <img
                        className={ styles.tooltipImg }
                        src={ tooltipImg }
                        alt='img'
                    />
                }
            >
                <ExclamationCircleFilled />
            </Tooltip>
        </div>
);

export function getLabel(title, tooltipImg) {
    return <LabelWithTooltipImg title={ title } tooltipImg={ tooltipImg } />;
}
