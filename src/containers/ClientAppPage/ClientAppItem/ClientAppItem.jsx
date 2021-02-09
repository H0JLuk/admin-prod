import React from 'react';
import { MenuOutlined } from '@ant-design/icons';
import ClientAppMenu from '../ClientAppMenu/ClientAppMenu';
import { getLinkForPromoCampaignPage } from '../../../utils/appNavigation';

import style from './ClientAppItem.module.css';
import { saveAppCode } from '../../../api/services/sessionService';

const LABEL = {
    CODE: 'Код',
};

const sortableIcon = <MenuOutlined className={ style.sortableIcon } />;

const ClientAppItem = ({ item, isSortable, matchUrl, forceUpdate, history, tooltipIsVisible }) => {
    const { code, displayName } = item ?? {};

    const onCardClick = () => {
        saveAppCode(code);
        history.push(getLinkForPromoCampaignPage());
    };

    return (
        <div className={ style.cardWrapper }>
            <div className={ style.cardInfo } onClick={ onCardClick }>
                <div className={ style.cardName }>
                    <h4>{ displayName }</h4>
                </div>
                <div className={ style.cardCode }>
                    <span className={ style.cardCodeLabel }>{ LABEL.CODE }</span>
                    <span className={ style.cardCodeValue }>{ code }</span>
                </div>
                {/* Empty div needed for correct `justify-content: space-between;` for `cardInfo` block */}
                <div />
            </div>
            { tooltipIsVisible && (
                <div className={ style.cardAction }>
                    <div className={ style.cardMenu }>
                        { isSortable ? sortableIcon : (
                            <ClientAppMenu
                                clientAppItem={ item }
                                matchUrl={ matchUrl }
                                forceUpdate={ forceUpdate }
                                history={ history }
                            />
                        )}
                    </div>
                </div>
            ) }
        </div>
    );
};

export default ClientAppItem;
