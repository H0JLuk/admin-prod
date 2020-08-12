import React, { memo, useCallback } from 'react';
import { getAppCode, getRole } from '../../api/services/sessionService';
import { resolveMenuItemsByRole } from '../../constants/menuByRole';
import { ROUTE } from '../../constants/route';
import styles from './Menu.module.css';
import { Link, useLocation } from 'react-router-dom';
import classnames from 'classnames';

const Menu = () => {

    const role = getRole();
    const menuItems = resolveMenuItemsByRole(role);
    const appCode = getAppCode();
    const { pathname } = useLocation();
    const checkActive = useCallback( (path) => pathname.includes(path), [pathname]);

    return (
        <div className={ styles.menu }>
            { menuItems.map( (item, index) =>
                <Link key={ `li${index}` }
                    className={ classnames(styles.menu__item, {
                        [styles.active]: checkActive(item.path)
                    }) }
                    to={ item.path }
                >
                    { item.label }
                </Link>) }
            <Link to={ ROUTE.CLIENT_APPS } className={ styles.clientAppItem }>
                { appCode }
            </Link>
        </div>
    );
};

export default memo(Menu);