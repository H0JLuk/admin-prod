import React, { memo, useEffect, /* useMemo, */ useState } from 'react';
import cn from 'classnames';
import { matchPath, NavLink, useHistory, useLocation } from 'react-router-dom';
import { Menu } from 'antd';
import { PROMO_CAMPAIGN_PAGES, ROUTE, ROUTE_ADMIN, ROUTE_OWNER } from '../../constants/route';
import { getClientAppList, setDefaultAppCode } from '../../api/services/clientAppService';
import { getAppCode, getRole, saveAppCode } from '../../api/services/sessionService';
import { goApp } from '../../utils/appNavigation';
import { resolveMenuItemsByRoleAndAppCode } from '../../constants/menuByRole';
import ROLES from '../../constants/roles';

import sberLogo from '../../static/images/sber-logo.png';

import styles from './Sidebar.module.css';

const routesForNonRender = [
    `${ ROUTE_ADMIN.PROMO_CAMPAIGN }${ PROMO_CAMPAIGN_PAGES.ADD_PROMO_CAMPAIGN }`,
    `${ ROUTE_ADMIN.PROMO_CAMPAIGN }${ PROMO_CAMPAIGN_PAGES.PROMO_CAMPAIGN_INFO }`,
    `${ ROUTE_ADMIN.PROMO_CAMPAIGN }${ PROMO_CAMPAIGN_PAGES.PROMO_CAMPAIGN_EDIT }`,
    `${ ROUTE_OWNER.PROMO_CAMPAIGN }${ PROMO_CAMPAIGN_PAGES.ADD_PROMO_CAMPAIGN }`,
    `${ ROUTE_OWNER.PROMO_CAMPAIGN }${ PROMO_CAMPAIGN_PAGES.PROMO_CAMPAIGN_INFO }`,
    `${ ROUTE_OWNER.PROMO_CAMPAIGN }${ PROMO_CAMPAIGN_PAGES.PROMO_CAMPAIGN_EDIT }`,
];

const APP = 'Приложения';
// const ADD_NEW = 'Добавить';
// const NEW_APP = 'Новое приложение';

const Sidebar = () => {
    const history = useHistory();
    const { pathname } = useLocation();
    const [appsList, setAppsList] = useState([]);

    /* const isNewAppPathName = useMemo(() =>
        // TODO: change `ROUTE_ADMIN_APPS` to array of path
        !!matchPath(location.pathname, { path: ROUTE_ADMIN_APPS.ADD_APP }
    ), [location.pathname]); */

    const appCode = getAppCode() || '';
    const role = getRole();
    const [menuItems] = resolveMenuItemsByRoleAndAppCode(role, appCode);

    useEffect(() => {
        if (role === ROLES.USER_MANAGER) {
            return;
        }

        (async () => {
            const { clientApplicationDtoList = [] } = await getClientAppList();
            const sortedDtoList = clientApplicationDtoList.filter(({ isDeleted }) => !isDeleted);
            /* Временный костыль чтобы можно было перемещаться по приложению без крашей */
            if (!getAppCode()) {
                setDefaultAppCode(sortedDtoList[0].code);
            }

            setAppsList(sortedDtoList);
        })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const handleAdministrate = (dzoItem) => {
        saveAppCode(dzoItem.code);
        goApp(history, role);
    };

    if (matchPath(pathname, { path: routesForNonRender })) {
        return null;
    }

    return (
        <div className={ styles.menu }>
            <div className={ styles.blockLogo }>
                <img className={ styles.logo } src={ sberLogo } alt="sberLogo" />
            </div>
            <Menu mode="inline">
                {menuItems.map((item) => (
                    <Menu.Item key={ item.label }>
                        <NavLink
                            key={ item.label }
                            to={ item.path }
                            className={ styles.menu__item }
                            activeClassName={ styles.active }
                        >
                            { item.label }
                        </NavLink>
                    </Menu.Item>
                ))}
                { (appsList || []).length > 0 && (
                    <div className={ cn(styles.menu__item, styles.app) }>
                        { APP }
                    </div>
                ) }
                {(appsList || []).map((dzoItem) => (
                    <Menu.Item key={ dzoItem.id }>
                        {/* TODO: change this to NavLink or add active className after we will know url for apps */}
                        <div
                            onClick={ () => handleAdministrate(dzoItem) }
                            className={ cn(styles.menu__item, { [styles.activeApp]: appCode === dzoItem.code }) }
                        >
                            { dzoItem.displayName }
                        </div>
                    </Menu.Item>
                ))}
                {/* <Menu.Item key="Create">
                    <NavLink
                        to={ ROUTE_ADMIN_APPS.ADD_APP }
                        className={
                            cn(styles.menu__item, {
                                [styles.addButton]: !isNewAppPathName
                            })
                        }
                        activeClassName={ styles.active }
                    >
                        { isNewAppPathName ? NEW_APP : ADD_NEW }
                    </NavLink>
                </Menu.Item> */}
                { role !== ROLES.USER_MANAGER && (
                    <Menu.Item key="oldDesign">
                        <NavLink to={ `${ ROUTE.OLD_DESIGN }${ pathname }` } className={ styles.oldDesignLink }>
                            Старый дизайн
                        </NavLink>
                    </Menu.Item>
                ) }
            </Menu>
        </div>
    );
};

export default memo(Sidebar);