import React from 'react';
import Template from './Templates/Template';
import { PromoCampaignDto } from '@types';

import styles from '../PromoCampaignInfo.module.css';

type IStepTextAndImageProps = Pick<PromoCampaignDto, 'banners' | 'type' | 'texts' >;

const TITLE_BY_TYPE = {
    NORMAL: 'Экскурсия',
    PRESENT: 'Подарок',
};

const StepTextAndImage: React.FC<IStepTextAndImageProps> = ({ banners, texts, type }) => (
    <div className={styles.containerStep}>
        <div className={styles.infoDetail}>
            <div className={styles.title}>
                {TITLE_BY_TYPE[type as keyof typeof TITLE_BY_TYPE]}
            </div>
            <div className={styles.container}>
                <Template
                    banners={banners}
                    texts={texts}
                    type={type}
                />
            </div>
        </div>
    </div>
);

export default StepTextAndImage;
