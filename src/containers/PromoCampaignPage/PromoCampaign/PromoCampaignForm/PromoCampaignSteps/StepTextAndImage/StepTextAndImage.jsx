import React, { useCallback } from 'react';
import Template from './Templates/Template';
import PROMO_CAMPAIGNS from '../../../../../../constants/promoCampaigns';

import styles from './StepTextAndImage.module.css';

const StepTextAndImage = ({
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
        <div className={ styles.containerStep }>
            <div>
                <div className={ styles.title }>{ PROMO_CAMPAIGNS[typePromoCampaign].label }</div>
                <div className={ styles.container }>
                    <Template
                        banners={ banners }
                        texts={ texts }
                        isCopy={ isCopy }
                        onRemoveImg={ onRemoveImg }
                        type={ typePromoCampaign }
                    />
                </div>
            </div>
        </div>
    );
};

export default StepTextAndImage;
