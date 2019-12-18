import React from 'react';
import Menu from '../../components/Menu/Menu';
import { navigation } from '../../constants/navigation';
import styles from './Header.module.css';

const Header = (props) => {
    return (
        <div className={styles.header}>
            <Menu items={navigation} />
            <div className={styles.logout} onClick={props.doLogout}>logout</div>
        </div>
    )
};

export default Header;