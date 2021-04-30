import React from 'react';
import Template from './Templates/Template';

import styles from '../PromoCampaignInfo.module.css';

const TITLE_BY_TYPE = {
    NORMAL: 'Экскурсия',
    PRESENT: 'Подарок',
};

const StepTextAndImage = ({ banners, texts, type }) => (
    <div className={ styles.containerStep }>
        <div className={ styles.infoDetail }>
            <div className={ styles.title }>
                { TITLE_BY_TYPE[type] }
            </div>
            <div className={ styles.container }>
                <Template
                    banners={ banners }
                    texts={ texts }
                    type={ type }
                />
            </div>
        </div>
    </div>
);

export default StepTextAndImage;
