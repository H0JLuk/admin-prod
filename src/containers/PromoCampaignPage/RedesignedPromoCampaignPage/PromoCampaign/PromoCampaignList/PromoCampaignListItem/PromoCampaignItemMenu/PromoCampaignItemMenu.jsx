import React, { useCallback, useState } from 'react';
import { generatePath, Link } from 'react-router-dom';
import { Menu, Dropdown } from 'antd';
import { EllipsisOutlined } from '@ant-design/icons';
import { deletePromoCampaign } from '../../../../../../../api/services/promoCampaignService';
import { PROMO_CAMPAIGN_PAGES } from '../../../../../../../constants/route';

import styles from './PromoCampaignItemMenu.module.css';

const PromoCampaignItemMenu = ({ onDeleteItem, promoCampaign, matchUrl }) => {
    const [dropdownVisible, setDropdownVisible] = useState(false);

    const onDeletePromoCampaign = useCallback(async (e) => {
        e.stopPropagation();
        try {
            await deletePromoCampaign(promoCampaign.id);
            onDeleteItem();
        } catch (e) {
            // TODO: add error handler
            console.error(e);
        }

        setDropdownVisible(false);
    }, [promoCampaign.id, onDeleteItem]);

    const onMenuClick = useCallback((e) => e.stopPropagation(), []);

    return (
        <Dropdown
            className={ styles.dropdown }
            overlayClassName={ styles.dropdownMenu }
            overlay={
                <DropdownMenu
                    promoCampaign={ promoCampaign }
                    onDelete={ onDeletePromoCampaign }
                    onClickItem={ onMenuClick }
                    matchUrl={ matchUrl }
                />
            }
            trigger={ ['click'] }
            visible={ dropdownVisible }
            onVisibleChange={ setDropdownVisible }
        >
            <div className={ styles.menuButton } onClick={ onMenuClick }>
                <EllipsisOutlined />
            </div>
        </Dropdown>
    );
};


export default PromoCampaignItemMenu;


const MENU = {
    LOAD_PROMO_CODE: 'Загрузить промо-коды',
    STATISTICS: 'Статистика использования промо-кодов',
    VISIBILITY_SETTINGS: 'Настроить видимость промо-кампании',
    EDIT_PROMO_CAMPAIGN: 'Редактировать промо-кампанию',
    DELETE: 'Удалить',
};

const DropdownMenu = ({ onDelete, onClickItem, promoCampaign, matchUrl }) => (
    <Menu>
        <Menu.Item key="0">
            <Link
                onClick={ onClickItem }
                to={ generatePath(
                    `${ matchUrl }${PROMO_CAMPAIGN_PAGES.LOAD_PROMO_CODES}`,
                    { promoCampaignId: promoCampaign.id }
                ) }
            >
                { MENU.LOAD_PROMO_CODE }
            </Link>
        </Menu.Item>
        <Menu.Item key="1">
            <Link
                onClick={ onClickItem }
                to={ generatePath(
                    `${ matchUrl }${PROMO_CAMPAIGN_PAGES.PROMO_CODES_STATISTIC}`,
                    { promoCampaignId: promoCampaign.id }
                ) }
            >
                { MENU.STATISTICS }
            </Link>
        </Menu.Item>
        <Menu.Item key="2">
            <Link
                onClick={ onClickItem }
                to={ generatePath(
                    `${ matchUrl }${PROMO_CAMPAIGN_PAGES.VISIBILITY_SETTINGS}`,
                    { promoCampaignId: promoCampaign.id }
                ) }
            >
                { MENU.VISIBILITY_SETTINGS }
            </Link>
        </Menu.Item>
        <Menu.Item key="3">
            <Link
                onClick={ onClickItem }
                to={ {
                    pathname: generatePath(
                        `${ matchUrl }${PROMO_CAMPAIGN_PAGES.PROMO_CAMPAIGN_EDIT}`,
                        { promoCampaignId: promoCampaign.id }
                    ),
                    state: { promoCampaign },
                } }
            >
                { MENU.EDIT_PROMO_CAMPAIGN }
            </Link>
        </Menu.Item>
        <Menu.Item key="4">
            <div className={ styles.menuItem } onClick={ onDelete }>
                { MENU.DELETE }
            </div>
        </Menu.Item>
    </Menu>
);
