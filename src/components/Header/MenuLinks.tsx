import React from 'react';
import { NavLink } from 'react-router-dom';
import { getAppCode, getRole } from '@apiServices/sessionService';
import { resolveMenuItemsByRoleAndAppCode } from '@constants/menuByRole';

import styles from './Header.module.css';

const MenuLinks = () => {
    const appCode = getAppCode() || '';
    const role = getRole();
    const [, menuItems] = resolveMenuItemsByRoleAndAppCode(role, appCode);

    return (
        <div>
            {menuItems.map((item) => (
                <NavLink
                    key={item.label}
                    to={item.path}
                    className={styles.menuItem}
                    activeClassName={styles.active}
                >
                    {item.label}
                </NavLink>
            ))}
        </div>
    );
};

export default MenuLinks;
