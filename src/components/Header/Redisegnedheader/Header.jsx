import React from 'react';
import styles from './Header.module.css';
import { LeftOutlined } from '@ant-design/icons';
import { useHistory } from 'react-router-dom';

const BACK_BUTTON_TEXT = ' Назад';

const Header = () => {
    const history = useHistory();

    const onBackButton = () => {
        history.goBack();
    };

    return (
        <div className={ styles.container }>
            <div className={ styles.backButton } onClick={ onBackButton }><LeftOutlined />{ BACK_BUTTON_TEXT }</div>
        </div>
    );
};

export default Header;