import React from 'react';
import cn from 'classnames';
import ButtonAddUser from '../ButtonUsers/ButtonAddUser';
import ButtonLoadUsers from '../ButtonUsers/ButtonLoadUsers';
import { templateLink } from '../../../utils/helper';
import styles from './EmptyUsersPage.module.css';
import btnStyles from '../ButtonUsers/ButtonUsers.module.css';

const ARTICLE_PAGE = 'Нет добавленных пользователей';
const DESCRIPTION_PAGE = 'Начните добавлять прямо сейчас';
const ADD_NEW_USER_BUTTON_TEXT = 'Добавить';
const PACKAGE_ADD_NEW_BUTTON_TEXT = 'Пакетная загрузка';
const GET_TEMPLATE_BUTTON_TEXT = 'Шаблон загрузки';

const EmptyUsersPage = () => (
    <div className={ styles.container }>
        <div className={ styles.userContainer }>
            <div className={ styles.content }>
                <div className={ styles.article }>
                    { ARTICLE_PAGE }
                </div>
                <div className={ styles.description }>
                    { DESCRIPTION_PAGE }
                </div>
                <div className={ styles.buttonsContainer }>
                    <ButtonAddUser title={ ADD_NEW_USER_BUTTON_TEXT } classNames={ btnStyles.btnMT } />
                    <ButtonLoadUsers
                        id="contained-button-upload-file-no-users"
                        classNames={ btnStyles.btnMT }
                        label={ PACKAGE_ADD_NEW_BUTTON_TEXT }
                    />
                    <a
                        href={ templateLink('user-upload.xlsx') }
                        className={ cn(btnStyles.addButton, btnStyles.greyButton, btnStyles.btnMT, btnStyles.Link) }
                    >
                        { GET_TEMPLATE_BUTTON_TEXT }
                    </a>
                </div>
            </div>
        </div>
    </div>
);

export default EmptyUsersPage;
