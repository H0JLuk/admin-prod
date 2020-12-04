import React, { memo, useEffect, useState } from 'react';
import { Menu } from 'antd';
import { ROUTE, ROUTE_ADMIN } from '../../constants/route';
import styles from './Sidebar.module.css';
import { NavLink, useHistory } from 'react-router-dom';
import { logout } from '../../api/services/authService';
import { getClientAppList } from '../../api/services/clientAppService';
import ButtonLabels from '../Button/ButtonLables';
import { MenuOutlined, BarChartOutlined, LogoutOutlined, UserOutlined } from '@ant-design/icons';
import { getRole, saveAppCode } from '../../api/services/sessionService';
import { goApp } from '../../utils/appNavigation';

import sberLogo from '../../static/images/sber-logo.png';

const MENU_STATEMENT_TEXT = 'Текущее';
const MENU_USERS_TEXT = 'Пользователи';
const MENU_DZO_TEXT = 'ДЗО';

const Sidebar = () => {
    const { SubMenu } = Menu;
    const history = useHistory();
    const rootSubmenuKeys = ['sub1'];
    const [openKeys, setOpenKeys] = useState(['sub1']);
    const [subMenu, setSubMenu] = useState([]);

    const onOpenChange = keys => {
        const latestOpenKey = keys.find(key => openKeys.indexOf(key) === -1);
        if (rootSubmenuKeys.indexOf(latestOpenKey) === -1) {
            setOpenKeys(keys);
        } else {
            setOpenKeys(latestOpenKey ? [latestOpenKey] : []);
        }
    };

    useEffect(() => {
        (async () => {
            const response = await getClientAppList();
            const sortedDtoList = response.clientApplicationDtoList.filter((dzoItem) => !dzoItem.isDeleted);
            setSubMenu(sortedDtoList);
        })();
    }, []);

    const doLogout = () => {
        logout().then(() => {
            history.push(ROUTE.LOGIN);
        });
    };

    const handleAdministrate = (dzoItem) => {
        const role = getRole();
        saveAppCode(dzoItem.code);
        goApp(history, role);
    };

    return (
        <div className={ styles.menu }>
            <img className={ styles.logo } src={ sberLogo } alt="" />
            <Menu mode="inline" theme="dark">
                <Menu.Item key="1">
                    <NavLink
                        to={ `${ROUTE_ADMIN.USERS}` } //TODO: Добавить роут когда он будет известен
                        className={ styles.menu__item }
                        activeClassName={ styles.active }
                    >
                        <BarChartOutlined />{ MENU_STATEMENT_TEXT }
                    </NavLink>
                </Menu.Item>
                <Menu.Item key="2">
                    <NavLink
                        to={ ROUTE_ADMIN.REDESIGNED_USERS }
                        className={ styles.menu__item }
                        activeClassName={ styles.active }
                    >
                        <UserOutlined />{ MENU_USERS_TEXT }
                    </NavLink>
                </Menu.Item>
                <Menu.Item key="3">
                    <NavLink
                        to={ `${ROUTE_ADMIN.DZO}` } //TODO: Добавить роут когда он будет известен
                        className={ styles.menu__item }
                        activeClassName={ styles.active }
                    >
                        { MENU_DZO_TEXT }
                    </NavLink>
                </Menu.Item>
                <SubMenu key="sub1" openKeys={ openKeys } onOpenChange={ onOpenChange } icon={ <MenuOutlined /> } title="Приложения">
                    {
                        subMenu.length !== 0 && subMenu.map((dzoItem) => (
                            <Menu.Item key={ dzoItem.id }>
                                <div
                                    onClick={ () => handleAdministrate(dzoItem) }
                                    className={ styles.menu__item }
                                >
                                    { dzoItem.displayName }
                                </div>
                            </Menu.Item>
                        ))
                    }
                </SubMenu>
            </Menu>
            <div className={ styles.menu__item } onClick={ doLogout }><LogoutOutlined />{ ButtonLabels.LOGOUT } </div>
        </div>
    );
};

export default memo(Sidebar);