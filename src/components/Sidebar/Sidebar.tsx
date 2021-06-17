import React, { memo, useEffect, useState } from 'react';
import { matchPath, NavLink, useHistory, useLocation } from 'react-router-dom';
import cn from 'classnames';
import { PROMO_CAMPAIGN_PAGES, ROUTE_ADMIN, ROUTE_OWNER } from '@constants/route';
import { getActiveClientApps, setDefaultAppCode } from '@apiServices/clientAppService';
import { getAppCode, getRole, saveAppCode } from '@apiServices/sessionService';
import { goApp } from '@utils/appNavigation';
import { resolveMenuItemsByRoleAndAppCode } from '@constants/menuByRole';
import ROLES from '@constants/roles';
import { ClientAppDto } from '@types';

import sberLogo from '@imgs/sber-logo.png';

import styles from './Sidebar.module.css';

const routesForNonRender = [
    `${ ROUTE_ADMIN.PROMO_CAMPAIGN }${ PROMO_CAMPAIGN_PAGES.ADD_PROMO_CAMPAIGN }`,
    `${ ROUTE_ADMIN.PROMO_CAMPAIGN }${ PROMO_CAMPAIGN_PAGES.PROMO_CAMPAIGN_INFO }`,
    `${ ROUTE_ADMIN.PROMO_CAMPAIGN }${ PROMO_CAMPAIGN_PAGES.PROMO_CAMPAIGN_EDIT }`,
    `${ ROUTE_ADMIN.PROMO_CAMPAIGN }${ PROMO_CAMPAIGN_PAGES.PROMO_CAMPAIGN_COPY }`,
    `${ ROUTE_OWNER.PROMO_CAMPAIGN }${ PROMO_CAMPAIGN_PAGES.ADD_PROMO_CAMPAIGN }`,
    `${ ROUTE_OWNER.PROMO_CAMPAIGN }${ PROMO_CAMPAIGN_PAGES.PROMO_CAMPAIGN_INFO }`,
    `${ ROUTE_OWNER.PROMO_CAMPAIGN }${ PROMO_CAMPAIGN_PAGES.PROMO_CAMPAIGN_EDIT }`,
    `${ ROUTE_OWNER.PROMO_CAMPAIGN }${ PROMO_CAMPAIGN_PAGES.PROMO_CAMPAIGN_COPY }`,
];

const routesForApps = [
    `${ROUTE_ADMIN.APPS}`,
    `${ROUTE_OWNER.APPS}`,
];

const rolesWithoutClientApps = [
    ROLES.USER_MANAGER,
    ROLES.PARTNER,
];

const Sidebar = () => {
    const history = useHistory();
    const { pathname } = useLocation();
    const [appsList, setAppsList] = useState<ClientAppDto[]>([]);

    const appCode = getAppCode() || '';
    const role = getRole();
    const [menuItems] = resolveMenuItemsByRoleAndAppCode(role, appCode);

    useEffect(() => {
        if (rolesWithoutClientApps.includes(role)) {
            return;
        }

        (async () => {
            const clientAppList = await getActiveClientApps();
            /* Временный костыль чтобы можно было перемещаться по приложению без крашей */
            if (!getAppCode()) {
                setDefaultAppCode(clientAppList[0].code);
            }

            setAppsList(clientAppList);
        })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const handleAdministrate = (dzoItem: ClientAppDto) => {
        saveAppCode(dzoItem.code);
        goApp(history, role);
    };

    if (matchPath(pathname, { path: routesForNonRender })) {
        return null;
    }

    return (
        <div className={styles.menu}>
            <div className={styles.blockLogo}>
                <img className={styles.logo} src={sberLogo} alt="sberLogo" />
            </div>
            <ul className={styles.menuLinks}>
                {menuItems.map((item) => (
                    <li key={item.label}>
                        <NavLink
                            key={item.label}
                            to={item.path}
                            className={styles.menu__item}
                            activeClassName={styles.active}
                        >
                            {item.label}
                        </NavLink>
                    </li>
                ))}
                {!(matchPath(pathname, { path: routesForApps })) && (appsList || []).map((dzoItem, index) => (
                    <li key={dzoItem.id} className={cn(styles.appLink, { [styles.firstApp]: !index })}>
                        {/* TODO: change this to NavLink or add active className after we will know url for apps */}
                        <div
                            onClick={() => handleAdministrate(dzoItem)}
                            className={cn(styles.menu__item, { [styles.activeApp]: appCode === dzoItem.code })}
                        >
                            {dzoItem.displayName}
                        </div>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default memo(Sidebar);
