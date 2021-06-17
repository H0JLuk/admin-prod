import React from 'react';
import { MenuOutlined } from '@ant-design/icons';
import ClientAppMenu from '../ClientAppMenu/ClientAppMenu';
import { getLinkForPromoCampaignPage } from '../../../utils/appNavigation';
import { saveAppCode } from '../../../api/services/sessionService';
import { History } from 'history';
import { ClientAppDto } from '@types';

import style from './ClientAppItem.module.css';

const LABEL = {
    CODE: 'Код',
};

const sortableIcon = <MenuOutlined className={style.sortableIcon} />;

type ClientAppItemProps = {
    item: ClientAppDto;
    isSortable: boolean;
    matchPath: string;
    forceUpdate: () => void;
    history: History;
    tooltipIsVisible: boolean;
};

const ClientAppItem: React.FC<ClientAppItemProps> = ({
    item,
    isSortable,
    matchPath,
    forceUpdate,
    history,
    tooltipIsVisible,
}) => {
    const { code, displayName } = item ?? {};

    const onCardClick = () => {
        saveAppCode(code);
        history.push(getLinkForPromoCampaignPage());
    };

    return (
        <div className={style.cardWrapper}>
            <div className={style.cardInfo} onClick={onCardClick}>
                <div className={style.cardName}>
                    <h4>{displayName}</h4>
                </div>
                <div className={style.cardCode}>
                    <span className={style.cardCodeLabel}>{LABEL.CODE}</span>
                    <span className={style.cardCodeValue}>{code}</span>
                </div>
                {/* Empty div needed for correct `justify-content: space-between;` for `cardInfo` block */}
                <div />
            </div>
            {tooltipIsVisible && (
                <div className={style.cardAction}>
                    <div className={style.cardMenu}>
                        {isSortable ? sortableIcon : (
                            <ClientAppMenu
                                clientAppItem={item}
                                matchPath={matchPath}
                                forceUpdate={forceUpdate}
                                history={history}
                            />
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};

export default ClientAppItem;
