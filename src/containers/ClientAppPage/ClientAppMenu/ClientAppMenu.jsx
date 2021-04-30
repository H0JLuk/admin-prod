import React, { useCallback, useState } from 'react';
import { Dropdown, Menu } from 'antd';
import { EllipsisOutlined } from '@ant-design/icons';
import { confirmModal } from '../../../utils/utils';
import { deleteClientApp } from '../../../api/services/clientAppService';
import { saveAppCode } from '../../../api/services/sessionService';
import { CLIENT_APPS_PAGES } from '../../../constants/route';

import style from './ClientAppMenu.module.css';

const MENU = {
    PROPERTIES: 'Свойства',
    DELETE: 'Удалить',
};

const getDeleteTitleConfirm = (appName) => (
    <span>
        Вы уверены, что хотите удалить приложение <b>{ appName }</b>?
    </span>
);

const ClientAppMenu = ({ matchUrl, clientAppItem, forceUpdate, history }) => {
    const [dropdownVisible, setDropdownVisible] = useState(false);

    const redirectToEditPage = () => {
        saveAppCode(clientAppItem.code);
        history.push(`${ matchUrl }${CLIENT_APPS_PAGES.EDIT_APP}`, { appState: clientAppItem });
    };

    const onConfirmDelete = useCallback(async () => {

        try {
            await deleteClientApp(clientAppItem.id);
            forceUpdate();
        } catch (error) {
            console.warn(error);
        }
    }, [clientAppItem, forceUpdate]);

    const onDeleteClick = useCallback(() => {
        confirmModal({
            onOk: onConfirmDelete,
            title: getDeleteTitleConfirm(clientAppItem.displayName),
        });

        setDropdownVisible(false);
    }, [clientAppItem, onConfirmDelete ]);

    return (
        <Dropdown
            className={ style.dropdown }
            overlayClassName={ style.dropdownMenu }
            overlay={
                <DropdownMenu
                    onDelete={ onDeleteClick }
                    redirectToEditPage={ redirectToEditPage }
                />
            }
            trigger={ ['click'] }
            visible={ dropdownVisible }
            onVisibleChange={ setDropdownVisible }
        >
            <div className={ style.menuButton }>
                <EllipsisOutlined />
            </div>
        </Dropdown>
    );
};

export default ClientAppMenu;

export const DropdownMenu = ({
    onDelete,
    redirectToEditPage,
}) => (
    <Menu>
        <Menu.Item key="0">
            <div
                onClick={ redirectToEditPage }
            >
                { MENU.PROPERTIES }
            </div>
        </Menu.Item>
        <Menu.Item key="1" >
            <div className={ style.menuItem } onClick={ onDelete }>
                { MENU.DELETE }
            </div>
        </Menu.Item>
    </Menu>
);
