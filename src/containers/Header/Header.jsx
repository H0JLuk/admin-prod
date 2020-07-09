import React from 'react';
import Menu from '../../components/Menu/Menu';
import { navigation } from '../../constants/navigation';
import styles from './Header.module.css';

const Header = (props) => {
    return (
        <div className={styles.header}>
            <Menu items={navigation} code={props.code}/>
            <div className={styles.logout} onClick={props.doLogout}>Выход</div>
        </div>
    )
};

export default Header;