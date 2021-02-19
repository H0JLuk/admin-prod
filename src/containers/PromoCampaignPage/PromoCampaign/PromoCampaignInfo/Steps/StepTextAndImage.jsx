import React from 'react';
import Template from './Templates/Template';

import styles from '../PromoCampaignInfo.module.css';

const EXCURSION = 'Экскурсия';
const GIFT = 'Подарок';

const StepTextAndImage = ({ banners, texts, type }) => (
    <div className={ styles.containerStep }>
        { type === 'NORMAL' && (
            <div className={ styles.infoDetail }>
                <div className={ styles.title }>{ EXCURSION }</div>
                <div className={ styles.container }>
                    <Template
                        banners={ banners }
                        texts={ texts }
                        type="excursion"
                    />
                </div>
            </div>
        ) }
        { type === 'PRESENT' && (
            <div className={ styles.infoDetail }>
                <div className={ styles.title }>{ GIFT }</div>
                <div className={ styles.container }>
                    <Template
                        banners={ banners }
                        texts={ texts }
                        type="gift"
                    />
                </div>
            </div>
        ) }
    </div>
);

export default StepTextAndImage;