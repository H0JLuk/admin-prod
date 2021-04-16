import React from 'react';
import cn from 'classnames';
import ButtonAddUser from '../ButtonUsers/ButtonAddUser';
import ButtonLoadUsers from '../ButtonUsers/ButtonLoadUsers';
import Header from '../../../../../components/Header/Header';
import { templateLink } from '../../../../../utils/helper';

import styles from './EmptyUsersPage.module.css';
import btnStyles from '../ButtonUsers/ButtonUsers.module.css';

const TITLE = 'Нет добавленных пользователей';
const DESCRIPTION = 'Начните добавлять прямо сейчас';
const ADD_NEW_USER_BUTTON_TEXT = 'Добавить';
const PACKAGE_ADD_NEW_BUTTON_TEXT = 'Пакетная загрузка';
const GET_TEMPLATE_BUTTON_TEXT = 'Шаблон загрузки';

const EmptyUsersPage = () => (
    <>
        <Header buttonBack={ false } />
        <div className={ styles.content }>
            <div className={ styles.article }>
                { TITLE }
            </div>
            <div className={ styles.description }>
                { DESCRIPTION }
            </div>
            <div className={ styles.buttonsContainer }>
                <ButtonAddUser title={ ADD_NEW_USER_BUTTON_TEXT } classNames={ cn(btnStyles.btnMT, btnStyles.firstButton) } />
                <ButtonLoadUsers
                    id="contained-button-upload-file-no-users"
                    classNames={ btnStyles.btnMT }
                    label={ PACKAGE_ADD_NEW_BUTTON_TEXT }
                />
                <a
                    href={ templateLink('user-upload.csv') }
                    className={ cn(btnStyles.addButton, btnStyles.greyButton, btnStyles.btnMT, btnStyles.link) }
                >
                    { GET_TEMPLATE_BUTTON_TEXT }
                </a>
            </div>
        </div>
    </>
);

export default EmptyUsersPage;
