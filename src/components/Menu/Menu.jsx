import React, { memo } from 'react';
import { getAppCode, getRole } from '../../api/services/sessionService';
import { resolveMenuItemsByRoleAndAppCode } from '../../constants/menuByRole';
import { ROUTE } from '../../constants/route';
import styles from './Menu.module.css';
import { NavLink } from 'react-router-dom';

const Menu = () => {

    const role = getRole();
    const appCode = getAppCode();
    const menuItems = resolveMenuItemsByRoleAndAppCode(role, appCode);

    return (
        <div className={ styles.menu }>
            { menuItems.map((item, index) =>
                <NavLink
                    key={ `li${index}` }
                    to={ item.path }
                    className={ styles.menu__item }
                    activeClassName={ styles.active }
                >
                    { item.label }
                </NavLink>) }
            <NavLink
                to={ ROUTE.CLIENT_APPS }
                className={ styles.clientAppItem }
            >
                { appCode }
            </NavLink>
        </div>
    );
};

export default memo(Menu);