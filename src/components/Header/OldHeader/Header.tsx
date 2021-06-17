import React from 'react';
import { History } from 'history';
import Menu from '@components/Menu/Menu';
import { logout } from '@apiServices/authService';
import { ROUTE } from '@constants/route';
import ButtonLabels from '@components/Button/ButtonLables';

import styles from './Header.module.css';

interface IHeaderProps {
    history: History;
}

const Header: React.FC<IHeaderProps> = ({ history }) => {

    const doLogout = () => {
        logout().then(() => {
            history.push(ROUTE.LOGIN);
        });
    };

    return (
        <div className={styles.header}>
            <Menu />
            <div className={styles.logout} onClick={doLogout}>{ButtonLabels.LOGOUT} </div>
        </div>
    );
};

export default Header;
