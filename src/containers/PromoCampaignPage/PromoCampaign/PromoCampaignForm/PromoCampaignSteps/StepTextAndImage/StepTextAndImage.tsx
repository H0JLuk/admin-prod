import React, { useCallback } from 'react';
import Template from './Templates/Template';
import PROMO_CAMPAIGNS from '@constants/promoCampaigns';
import { FormInstance, FormItemProps } from 'antd';
import { BannerCreateDto, BannerCreateTextDto } from '@types';
import { INFO_ROWS_KEYS } from './Templates/templateConstants';

import styles from './StepTextAndImage.module.css';

export type StepTextAndImageProps = {
    typePromoCampaign: INFO_ROWS_KEYS;
    addChangedImg: (name: FormItemProps['name']) => void;
    banners: BannerCreateDto;
    texts: BannerCreateTextDto;
    setFields: FormInstance['setFields'];
    isCopy: boolean | undefined;
};

const StepTextAndImage: React.FC<StepTextAndImageProps> = ({
    typePromoCampaign,
    addChangedImg,
    banners,
    texts,
    setFields,
    isCopy,
}) => {
    const onRemoveImg = useCallback((name) => {
        setFields([{ name, value: [] }]);
        addChangedImg(name[1]);
    }, [setFields, addChangedImg]);

    return (
        <div className={styles.containerStep}>
            <div>
                <div className={styles.title}>{PROMO_CAMPAIGNS[typePromoCampaign as INFO_ROWS_KEYS].label}</div>
                <div className={styles.container}>
                    <Template
                        banners={banners}
                        texts={texts}
                        isCopy={isCopy}
                        onRemoveImg={onRemoveImg}
                        type={typePromoCampaign}
                    />
                </div>
            </div>
        </div>
    );
};

export default StepTextAndImage;
