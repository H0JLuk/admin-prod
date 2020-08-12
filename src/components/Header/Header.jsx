import React from 'react';
import Menu from '../Menu/Menu';
import styles from './Header.module.css';
import { logout } from '../../api/services/authService';
import { ROUTE } from '../../constants/route';
import ButtonLabels from '../Button/ButtonLables';

const Header = ({ history }) => {

    const doLogout = () => {
        logout().then(() => {
            history.push(ROUTE.LOGIN);
        });
    };

    return (
        <div className={ styles.header }>
            <Menu />
            <div className={ styles.logout } onClick={ doLogout }>{ ButtonLabels.LOGOUT } </div>
        </div>
    );
};

export default Header;