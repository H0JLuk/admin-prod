import React from 'react';
import { NavLink, matchPath, useLocation } from 'react-router-dom';
import { getAppCode, getRole } from '@apiServices/sessionService';
import { resolveMenuItemsByRoleAndAppCode } from '@constants/menuByRole';
import { ROUTE_ADMIN } from '@constants/route';

import styles from './Header.module.css';

const routesForReferenceBooksMenu = [
    ROUTE_ADMIN.REFERENCE_BOOKS,
];

const MenuLinks = () => {
    const { pathname } = useLocation();
    const appCode = getAppCode() || '';
    const role = getRole();
    const [, menuItems] = resolveMenuItemsByRoleAndAppCode(role, appCode, !!matchPath(pathname, routesForReferenceBooksMenu));

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
