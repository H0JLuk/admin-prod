import React from 'react';
import { useHistory, useRouteMatch } from 'react-router-dom';
import { Button } from 'antd';
import Header from '@components/Header/Header';
import TemplateUploadButtonsWithModal from '@components/ButtonWithModal/TemplateUploadButtonsWithModal';
import { templateLink } from '@utils/helper';
import { USERS_PAGES } from '@constants/route';
import { BUTTON_TEXT } from '@constants/common';

import styles from './EmptyUsersPage.module.css';

const TITLE = 'Нет добавленных пользователей';
const DESCRIPTION = 'Начните добавлять прямо сейчас';
const PACKAGE_ADD_NEW_BUTTON_TEXT = 'Пакетная загрузка';
const GET_TEMPLATE_BUTTON_TEXT = 'Шаблон загрузки';

type EmptyUsersPageProps = {
    refreshTable: () => void;
};

const EmptyUsersPage: React.FC<EmptyUsersPageProps> = ({ refreshTable }) => {
    const history = useHistory();
    const { path } = useRouteMatch();

    const onAddUser = () => history.push(`${path}${USERS_PAGES.ADD_USER}`);

    return (
        <>
            <Header buttonBack={false} />
            <div className={styles.content}>
                <div className={styles.article}>
                    {TITLE}
                </div>
                <div className={styles.description}>
                    {DESCRIPTION}
                </div>
                <div className={styles.buttonsContainer}>
                    <Button
                        type="primary"
                        onClick={onAddUser}
                    >
                        {BUTTON_TEXT.ADD}
                    </Button>
                    <TemplateUploadButtonsWithModal
                        btnAddLabel={PACKAGE_ADD_NEW_BUTTON_TEXT}
                        btnDeleteShow={false}
                        onSuccess={refreshTable}
                    />
                    <a href={templateLink('user-upload.csv')}>
                        {GET_TEMPLATE_BUTTON_TEXT}
                    </a>
                </div>
            </div>
        </>
    );
};

export default EmptyUsersPage;
