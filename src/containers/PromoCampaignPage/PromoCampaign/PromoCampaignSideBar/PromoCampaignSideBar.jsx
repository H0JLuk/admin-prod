import React from 'react';
import cn from 'classnames';

import sberLogo from '../../../../static/images/sber-logo.png';

import styles from './PromoCampaignSideBar.module.css';

const NEW_PROMO_CAMPAIGN_STEPS = ['Новая промо-кампания', 'Добавление контента', 'Настройки видимости'];
const PROMO_CAMPAIGN_STEPS = ['Промо-кампания', 'Контент промо-кампании', 'Настройки видимости'];

const IMG_ALT = 'sberLogo';

const PromoCampaignSideBar = ({ active, onClick, validStep, newPromoCampaign, hideLastStep }) => {
    const currentSteps = newPromoCampaign
        ? NEW_PROMO_CAMPAIGN_STEPS
        : !hideLastStep ? PROMO_CAMPAIGN_STEPS : PROMO_CAMPAIGN_STEPS.slice(0, PROMO_CAMPAIGN_STEPS.length - 1);

    return (
        <div className={ styles.menu }>
            <div className={ styles.blockLogo }>
                <img className={ styles.logo } src={ sberLogo } alt={ IMG_ALT } />
            </div>
            { currentSteps.map((step, index) => (
                <MenuItem
                    key={ step }
                    disabled={ validStep < index + 1 }
                    onClick={ onClick }
                    title={ step }
                    active={ index === active - 1 }
                    index={ index }
                />
            )) }
        </div>
        );
};

export default PromoCampaignSideBar;


const MenuItem = ({ title, active, onClick, disabled, index }) => {
    const onClickHandler = () => {
        if (!disabled) {
            onClick(index + 1);
        }
    };

    return (
        <div
            className={ cn(
                styles.menuItem,
                {
                    [styles.active]: active,
                    [styles.disabled]: disabled,
                })
            }
            onClick={ onClickHandler }
        >
            { title }
        </div>
    );
};
