import React from 'react';
import { LeftOutlined } from '@ant-design/icons';
import { useHistory } from 'react-router-dom';
import DropdownWithLogout from '../DropdownWithLogout/DropdownWithLogout';
import MenuLinks from './MenuLinks';

import styles from './Header.module.css';

const BACK_BUTTON_TEXT = ' Назад';

const Header = ({ menuMode = false, buttonBack = true, onClickFunc }) => {
    const history = useHistory();

    const onBackButton = () => {
        onClickFunc ? onClickFunc() : history.goBack();
    };

    return (
        <div className={ styles.container }>
            { buttonBack && (
                <div className={ styles.backButton } onClick={ onBackButton }>
                    <LeftOutlined /> { BACK_BUTTON_TEXT }
                </div>
            ) }
            { menuMode && <MenuLinks /> }
            <div className={ styles.avatar }>
                <DropdownWithLogout />
            </div>
        </div>
    );
};

export default Header;
