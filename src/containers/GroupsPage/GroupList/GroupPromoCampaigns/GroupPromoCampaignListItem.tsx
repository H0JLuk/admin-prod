import React, { useState } from 'react';
import { useHistory } from 'react-router-dom';
import { Checkbox } from 'antd';
import { BUNDLE_LOCATION_KEY } from '../../groupPageConstants';
import { GroupPromoCampaignOrBundleListItemProps } from '../types';
import { BundleLink } from '@types';

import style from '../GroupListItem.module.css';

const TITLE = {
    MAIN_PROMO_CAMPAIGN: 'Основная промо-кампания',
    CHILD_PROMO_CAMPAIGNS: 'Связанная промо-кампания',
    NONE_PROMO_CAMPAIGNS: 'Нет связанных промо-кампаний'
};

const GroupPromoCampaignListItem: React.FC<GroupPromoCampaignOrBundleListItemProps> = ({
    item,
    checked,
    matchPath,
    select,
    handleSelectItem,
}) => {
    const [showItems, setShowItems] = useState(false);
    const history = useHistory();
    const {
        id,
        name,
        links,
        type,
    } = item;

    const handleShowItems: React.MouseEventHandler<HTMLDivElement> = (e) => {
        e.stopPropagation();
        setShowItems(!showItems);
    };

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
            <div className={style.cardSelector} onClick={handleShowItems}>
                <div className={style.squareOutline}>
                    {showItems ? '-' : '+'}
                </div>
            </div>
            <div className={style.cardPromoInfo}>
                <div className={style.cardPromo__header}>
                    <div className={style.cardName}>
                        <div className={style.subInfo__label}>
                            {TITLE.MAIN_PROMO_CAMPAIGN}
                        </div>
                        {name}
                    </div>
                    {showItems && (
                        links.length ? links.map((link: BundleLink) => (
                            <div key={link.id} className={style.cardChildName} >
                                <div className={style.subInfo__label}>
                                    {TITLE.CHILD_PROMO_CAMPAIGNS}
                                </div>
                                {link.name}
                            </div>
                        )) : (
                            <div className={style.cardChildName}>
                                {TITLE.NONE_PROMO_CAMPAIGNS}
                            </div>
                        )
                    )}
                </div>
            </div>
        </div>
    );
};

export default GroupPromoCampaignListItem;
