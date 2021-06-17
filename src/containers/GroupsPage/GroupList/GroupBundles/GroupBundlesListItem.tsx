import React from 'react';
import cn from 'classnames';
import { useHistory } from 'react-router-dom';
import { Checkbox } from 'antd';
import { BUNDLE_LOCATION_KEY } from '../../groupPageConstants';
import { GroupPromoCampaignOrBundleListItemProps } from '../types';

import style from '../GroupListItem.module.css';

const TITLE = {
    SHOWCASES: 'Витрины',
    PROMO_CAMPAIGNS_NUMBER: 'Кол-во промо-кампаний'
};

const STATUS = {
    ACTIVE: 'Активная',
    INACTIVE: 'Неактивная',
};

const GroupListItem: React.FC<GroupPromoCampaignOrBundleListItemProps> = ({
    item,
    checked,
    matchPath,
    select,
    handleSelectItem,
}) => {
    const history = useHistory();
    const {
        id,
        name,
        clientApplicationDto: { displayName },
        links,
        active,
        type,
    } = item;

    const onClickItem = () => {
        if (select) {
            return handleSelectItem({ id, name, checked: !checked });
        }

        history.push(`${matchPath}/${id}/info?type=${type.toLowerCase()}`, { [BUNDLE_LOCATION_KEY]: item });
    };

    return (
        <div
            className={style.cardWrapper}
            onClick={onClickItem}
        >
            {select && (
                <div className={style.checkbox}>
                    <Checkbox checked={checked} />
                </div>
            )}
            <div className={style.cardInfo} >
                <div className={style.cardInfo__header}>
                    <div className={cn(style.cardName, style.center)}>
                        {name}
                    </div>
                    <div className={style.type}>
                        <div className={style.subInfo__label}>
                            {TITLE.SHOWCASES}
                        </div>
                        <div className={style.subInfo__value}>
                            {displayName}
                        </div>
                    </div>
                    <div className={style.promoCode}>
                        <div className={style.subInfo__label}>
                            {TITLE.PROMO_CAMPAIGNS_NUMBER}
                        </div>
                        <div className={style.subInfo__value}>
                            {links.length}
                        </div>
                    </div>
                </div>
                <div className={style.cardInfo__footer}>
                    <div className={cn(style.status, { [style.redStatus]: !active })}>
                        {active ? STATUS.ACTIVE : STATUS.INACTIVE}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default GroupListItem;
