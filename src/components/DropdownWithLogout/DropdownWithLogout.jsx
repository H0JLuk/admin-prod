import React, { useState, useCallback, useMemo } from 'react';
import { useHistory } from 'react-router-dom';
import { Dropdown } from 'antd';
import { UserOutlined } from '@ant-design/icons';
import { logout } from '../../api/services/authService';
import { ROUTE } from '../../constants/route';

import styles from './DropdownWithLogout.module.css';

const avatarStyle = {
    fontSize: '22px',
    color: '#FFF',
    backgroundColor: '#c1c8d1',
    borderRadius: '50px',
    width: '32px',
    height: '32px',
    padding: '3px',
};

const EXIT = 'Выйти';

const DropdownWithLogout = () => {
    const [visible, setVisible] = useState(false);
    const history = useHistory();

    const doLogout = useCallback(async () => {
        await logout();
        history.push(ROUTE.LOGIN);
    }, [history]);

    const logoutBtn = useMemo(() => (
        <div className={ styles.menuItem } onClick={ doLogout }>
            { EXIT }
        </div>
    ), [doLogout]);

    return (
        <Dropdown
            className={ styles.dropdown }
            overlayClassName={ styles.menu }
            overlay={ logoutBtn }
            trigger={ ['click'] }
            visible={ visible }
            onVisibleChange={ setVisible }
        >
            <UserOutlined style={ avatarStyle } />
        </Dropdown>
    );
};

export default DropdownWithLogout;
