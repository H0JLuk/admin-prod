import React from 'react';
import cn from 'classnames';
import { PromoCampaignReport } from '@types';

import styles from './DashboardItem.module.css';

interface IStatisticCard {
    value: number | string;
    label: string;
    isRed?: boolean;
}

interface IDashboardItem extends PromoCampaignReport {
    handleClick(clientApplicationCode: string, promoCampaignId: number): void;
}

const PROMO = {
    GIVE: 'Выдано промокодов',
    LOAD: 'Загружено промокодов',
    END: 'Осталось дней'
};

const StatisticCard: React.FC<IStatisticCard> = ({ value, label, isRed = true }) => (
    <div className={cn(styles.card, { [styles.red]: isRed })}>
        <div className={styles.textBlock}>
            <p className={styles.description}>{label}</p>
            <p className={styles.value}>{value}</p>
        </div>
    </div>
);

const DashboardItem: React.FC<IDashboardItem> = ({
    handleClick,
    active,
    clientApplicationCode,
    clientApplicationDisplayName,
    dzoName,
    expireInDays,
    issuedCodePercents,
    promoCampaignId,
    promoCampaignName,
    noCodes,
}) => {
    const onClick = () => handleClick(clientApplicationCode, promoCampaignId);

    return (
        <div className={styles.item} onClick={onClick}>
            <h3>{promoCampaignName}</h3>
            <div className={styles.tagsBlock}>
                <div className={styles.tag}>{clientApplicationDisplayName}</div>
                <div className={styles.tag}>{dzoName}</div>
                <div className={cn(styles.tag, { [styles.red]: !active })}>{active ? 'Активная' : 'Неактивная'}</div>
            </div>
            <div className={styles.statisticsBlock}>
                {issuedCodePercents !== null && (
                    <StatisticCard
                        value={`${issuedCodePercents}%`}
                        label={PROMO.GIVE}
                        isRed={issuedCodePercents >= 80}
                    />
                )}
                {noCodes && (
                    <StatisticCard
                        value={0}
                        label={PROMO.LOAD}
                    />
                )}
                {expireInDays != null && (
                    <StatisticCard
                        value={expireInDays}
                        label={PROMO.END}
                        isRed={expireInDays <= 14}
                    />
                )}
            </div>
        </div>
    );
};

export default DashboardItem;
