import React, { useCallback, useMemo } from 'react';
import { generatePath, useHistory } from 'react-router-dom';
import cn from 'classnames';
import { MenuOutlined } from '@ant-design/icons';
import PromoCampaignItemMenu from './PromoCampaignItemMenu/PromoCampaignItemMenu';
import PROMO_CAMPAIGNS from '../../../../../constants/promoCampaigns';
import promoCodeTypes from '../../../../../constants/promoCodeTypes';
import { PROMO_CAMPAIGN_PAGES } from '../../../../../constants/route';
import { getFormattedDate } from '../../../../../utils/helper';

import style from './PromoCampaignListItem.module.css';

const TITLE = {
    TYPE: 'Тип',
    PROMO_CODE: 'Промо-код',
    START_DATE: 'Создано',
    END_DATE: 'Окончание',
};

const STATUS = {
    ACTIVE: 'Активная',
    INACTIVE: 'Неактивная',
};

const sortableIcon = <MenuOutlined className={ style.sortableIcon } />;

const PromoCampaignItem = ({ promoCampaign, onDeleteItem, sortable, matchUrl }) => {
    const history = useHistory();
    const {
        id,
        name,
        type,
        promoCodeType,
        startDate,
        finishDate,
        dzoName,
        active,
    } = promoCampaign;

    const promoCampaignDuration = useMemo(() => ({
        startDate: getFormattedDate(startDate),
        finishDate: getFormattedDate(finishDate),
    }), [startDate, finishDate]);

    const onCardClick = useCallback(() => {
        const path = generatePath(`${matchUrl}${PROMO_CAMPAIGN_PAGES.PROMO_CAMPAIGN_INFO}`, { promoCampaignId: id });
        history.push(path, { promoCampaign });
    }, [history, id, promoCampaign, matchUrl]);

    return (
        <div className={ style.cardWrapper }>
            <div className={ style.cardInfo } onClick={ onCardClick }>
                <div className={ style.cardInfo__header }>
                    <div className={ style.cardName }>
                        { name }
                    </div>
                    <div className={ cn(style.subInfo, style.type) }>
                        <div className={ style.subInfo__label }>
                            { TITLE.TYPE }
                        </div>
                        <div className={ style.subInfo__value }>
                            { PROMO_CAMPAIGNS[type].label }
                        </div>
                    </div>
                    <div className={ cn(style.subInfo, style.promoCode) }>
                        <div className={ style.subInfo__label }>
                            { TITLE.PROMO_CODE }
                        </div>
                        <div className={ style.subInfo__value }>
                            { promoCodeTypes[promoCodeType].label }
                        </div>
                    </div>
                    <div className={ cn(style.subInfo, style.startDate) }>
                        <div className={ style.subInfo__label }>
                            { TITLE.START_DATE }
                        </div>
                        <div className={ style.subInfo__value }>
                            { promoCampaignDuration.startDate }
                        </div>
                    </div>
                    <div className={ cn(style.subInfo, style.endDate) }>
                        <div className={ style.subInfo__label }>
                            { TITLE.END_DATE }
                        </div>
                        <div className={ style.subInfo__value }>
                            { promoCampaignDuration.finishDate }
                        </div>
                    </div>
                </div>
                <div className={ style.cardInfo__footer }>
                    <div className={ style.status }>{ dzoName }</div>
                    <div className={ cn(style.status, { [style.redStatus]: !active }) }>
                        { active ? STATUS.ACTIVE : STATUS.INACTIVE }
                    </div>
                </div>
            </div>
            <div className={ style.cardAction }>
                <div className={ style.cardMenu }>
                    { sortable ? (
                        { sortableIcon }
                    ) : (
                        <PromoCampaignItemMenu
                            promoCampaign={ promoCampaign }
                            onDeleteItem={ onDeleteItem }
                            matchUrl={ matchUrl }
                        />
                    )}
                </div>
            </div>
        </div>
    );
};

export default PromoCampaignItem;
