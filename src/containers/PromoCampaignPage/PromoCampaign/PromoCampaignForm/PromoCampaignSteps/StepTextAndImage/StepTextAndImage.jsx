import React, { useCallback } from 'react';
import Template from './Templates/Template';
import PROMO_CAMPAIGNS from '../../../../../../constants/promoCampaigns';

import styles from './StepTextAndImage.module.css';

const templateTypes = {
    excursion: 'excursion',
    gift: 'gift',
};

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

    const templateProps = {
        banners,
        texts,
        isCopy,
        onRemoveImg,
    };

    return (
        <div className={ styles.containerStep }>
            { typePromoCampaign === PROMO_CAMPAIGNS.NORMAL.value && (
                <div>
                    <div className={ styles.title }>{ PROMO_CAMPAIGNS.NORMAL.label }</div>
                    <div className={ styles.container }>
                        <Template { ...templateProps } type={ templateTypes.excursion } />
                    </div>
                </div>
            ) }
            { typePromoCampaign === PROMO_CAMPAIGNS.PRESENT.value && (
                <div>
                    <div className={ styles.title }>{ PROMO_CAMPAIGNS.PRESENT.label }</div>
                    <div className={ styles.container }>
                        <Template { ...templateProps } type={ templateTypes.gift } />
                    </div>
                </div>
            ) }
        </div>
    );
};

export default StepTextAndImage;
