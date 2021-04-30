import { Button } from 'antd';
import React from 'react';
import PropTypes from 'prop-types';
import { LOGIN_TYPES_ENUM } from '../../../../constants/loginTypes';

export const BUTTON = {
    DELETE_TEXT: 'Удалить',
    CANCEL_TEXT: 'Отменить',
    ADD_USER_TEXT: 'Добавить',
    SAVE_EDIT_USER_TEXT: 'Сохранить',
};

export const INFO_USER_BUTTONS = {
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
    userLoginType,
    actionPermissions = {},
}) => {
    const { deleteUser, editUser, resetUserPassword, unlockUser } = actionPermissions;

    const deleteButton = deleteUser && (
        <Button type="primary" danger onClick={ onDelete } disabled={ disableAllButtons }>
            { BUTTON.DELETE_TEXT }
        </Button>
    );

    const cancelButton = (
        <Button type="ghost" onClick={ onCancel } disabled={ disableAllButtons }>
            { BUTTON.CANCEL_TEXT }
        </Button>
    );

    switch (type) {
        case 'new': {
            return (
                <>
                    { cancelButton }
                    <Button type="primary" onClick={ onSubmit } disabled={ disableAllButtons }>
                        { BUTTON.ADD_USER_TEXT }
                    </Button>
                </>
            );
        }
        case 'edit': {
            return (
                <>
                    { cancelButton }
                    <Button type="primary" onClick={ onSubmit } disabled={ disableAllButtons }>
                        { BUTTON.SAVE_EDIT_USER_TEXT }
                    </Button>
                    { deleteButton }
                </>
            );
        }
        case 'info': {
            const showResetOrUnlockBtn =
                userLoginType === LOGIN_TYPES_ENUM.PASSWORD &&
                (
                    (userBlocked && unlockUser) ||
                    (!userBlocked && resetUserPassword)
                );
            return (
                <>
                    { showResetOrUnlockBtn && (
                        <Button type="primary" onClick={ onResetPassword } disabled={ disableAllButtons }>
                            { userBlocked ? INFO_USER_BUTTONS.UNBLOCK : INFO_USER_BUTTONS.RESET_PASSWORD }
                        </Button>
                    ) }
                    { editUser && (
                        <Button type="primary" onClick={ onEditUser } disabled={ disableAllButtons }>
                            { INFO_USER_BUTTONS.EDIT }
                        </Button>
                    ) }
                    { deleteButton }
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
