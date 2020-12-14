import React from 'react';
import cn from 'classnames';
import styles from './DashboardItem.module.css';

const DashboardItem = ({
                           handleClick,
                           active,
                           clientApplicationCode,
                           clientApplicationDisplayName,
                           dzoName,
                           expireInDays,
                           issuedCodePercents,
                           promoCampaignId,
                           promoCampaignName
}) => {
    const onClick = () => handleClick(clientApplicationCode, promoCampaignId);

    return (
        <div className={ styles.item } onClick={ onClick }>
            <h3>{promoCampaignName}</h3>
            <div className={ styles.tagsBlock }>
                <div className={ styles.tag }>{clientApplicationDisplayName}</div>
                <div className={ styles.tag }>{dzoName}</div>
                <div className={ cn(styles.tag, { [styles.red]: !active }) }>{active ? 'Активная' : 'Неактивная'}</div>
            </div>
            <div className={ styles.statisticsBlock }>
                {issuedCodePercents != null && (
                    <div className={ cn(styles.card, { [styles.red]: issuedCodePercents >= 80 }) }>
                        <div className={ styles.textBlock }>
                            <p className={ styles.description }>{'Выдано промокодов'}</p>
                            <p className={ styles.value }>{`${issuedCodePercents}%`}</p>
                        </div>
                    </div>
                )}
                {expireInDays != null && (
                    <div className={ cn(styles.card, { [styles.red]: expireInDays <= 14 }) }>
                        <div className={ styles.textBlock }>
                            <p className={ styles.description }>{'Осталось дней'}</p>
                            <p className={ styles.value }>{expireInDays}</p>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default DashboardItem;
