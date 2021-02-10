import React from 'react';
import { LeftOutlined } from '@ant-design/icons';
import { NavLink, useHistory } from 'react-router-dom';
import DropdownWithLogout from '../DropdownWithLogout/DropdownWithLogout';
import { getAppCode, getRole } from '../../api/services/sessionService';
import { resolveMenuItemsByRoleAndAppCode } from '../../constants/menuByRole';

import styles from './Header.module.css';

const BACK_BUTTON_TEXT = ' Назад';

const MenuLinks = () => {
    const appCode = getAppCode() || '';
    const role = getRole();
    const [, menuItems] = resolveMenuItemsByRoleAndAppCode(role, appCode);

    return (
        <div>
            {menuItems.map((item) => (
                <NavLink
                    key={ item.label }
                    to={ item.path }
                    className={ styles.menuItem }
                    activeClassName={ styles.active }
                >
                    { item.label }
                </NavLink>
            ))}
        </div>
    );
};

const Header = ({ menuMode = false, buttonBack = true, onClickFunc }) => {
    const history = useHistory();

    const onBackButton = () => {
        onClickFunc ? onClickFunc() : history.goBack();
    };

    return (
        <div className={ styles.container }>
            { buttonBack && (
                <div className={ styles.backButton } onClick={ onBackButton }>
                    <LeftOutlined /> { BACK_BUTTON_TEXT }
                </div>
            )}
            { menuMode && <MenuLinks /> }
            <div className={ styles.avatar }>
                <DropdownWithLogout />
            </div>
        </div>
    );
};

export default Header;
