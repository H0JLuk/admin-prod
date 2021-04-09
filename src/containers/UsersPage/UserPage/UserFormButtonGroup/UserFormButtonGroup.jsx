import { Button } from 'antd';
import React from 'react';
import PropTypes from 'prop-types';
import { getUsersSettingsByLoginType } from '../../../../constants/usersSettings';

const BUTTON_DELETE_TEXT = 'Удалить';
const BUTTON_CANCEL_TEXT = 'Отменить';
const BUTTON_ADD_USER_TEXT = 'Добавить';
const BUTTON_SAVE_EDIT_USER_TEXT = 'Сохранить';
const INFO_USER_BUTTONS = {
    RESET_PASSWORD: 'Сбросить пароль',
    EDIT: 'Редактировать',
    UNBLOCK: 'Разблокировать',
};

const UserFormButtonGroup = ({
    type,
    onDelete,
    onCancel,
    onSubmit,
    onResetPassword,
    onEditUser,
    disableAllButtons,
    userBlocked,
}) => {
    const { creation, deleting, editing, unlocked, passwordReset } = getUsersSettingsByLoginType();

    const deleteButton = (
        <Button type="primary" danger onClick={ onDelete } disabled={ disableAllButtons }>
            { BUTTON_DELETE_TEXT }
        </Button>
    );

    const cancelButton = (
        <Button type="ghost" onClick={ onCancel } disabled={ disableAllButtons }>
            { BUTTON_CANCEL_TEXT }
        </Button>
    );

    switch (type) {
        case 'new': {
            return (
                <>
                    { cancelButton }
                    { creation && (
                        <Button type="primary" onClick={ onSubmit } disabled={ disableAllButtons }>
                            { BUTTON_ADD_USER_TEXT }
                        </Button>
                    ) }
                </>
            );
        }
        case 'edit': {
            return (
                <>
                    { cancelButton }
                    { editing && (
                        <Button type="primary" onClick={ onSubmit } disabled={ disableAllButtons }>
                            { BUTTON_SAVE_EDIT_USER_TEXT }
                        </Button>
                    ) }
                    { deleting && (
                        deleteButton
                    ) }
                </>
            );
        }
        case 'info': {
            return (
                <>
                    { (passwordReset || unlocked) && (
                        <Button type="primary" onClick={ onResetPassword } disabled={ disableAllButtons }>
                            { userBlocked ? INFO_USER_BUTTONS.UNBLOCK : INFO_USER_BUTTONS.RESET_PASSWORD }
                        </Button>
                    ) }
                    { editing && (
                        <Button type="primary" onClick={ onEditUser } disabled={ disableAllButtons }>
                            { INFO_USER_BUTTONS.EDIT }
                        </Button>
                    ) }
                    { deleting && (
                        deleteButton
                    ) }
                </>
            );
        }
        default: {
            return null;
        }
    }
};

UserFormButtonGroup.propTypes = {
    type: PropTypes.oneOf(['info', 'new', 'edit']),
    onDelete: PropTypes.func,
    onCancel: PropTypes.func,
    onSubmit: PropTypes.func,
    onResetPassword: PropTypes.func,
    onEditUser: PropTypes.func,
    disableAllButtons: PropTypes.bool,
    userBlocked: PropTypes.bool,
};

UserFormButtonGroup.defaultProps = {
    type: 'info',
    onDelete: () => {},
    onCancel: () => {},
    onSubmit: () => {},
    onResetPassword: () => {},
    onEditUser: () => {},
    disableAllButtons: false,
    userBlocked: false,
};

export default UserFormButtonGroup;
