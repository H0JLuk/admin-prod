import React from 'react';
import PropTypes from 'prop-types';
import CustomButton from '../../../../../components/CustomButton/CustomButton';

import styles from './UserFormButtonGroup.module.css';

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
    const deleteButton = (
        <CustomButton
            className={ styles.deleteButton }
            onClick={ onDelete }
            disabled={ disableAllButtons }
        >
            { BUTTON_DELETE_TEXT }
        </CustomButton>
    );

    const cancelButton = (
        <CustomButton
            className={ styles.cancelButton }
            onClick={ onCancel }
            disabled={ disableAllButtons }
        >
            { BUTTON_CANCEL_TEXT }
        </CustomButton>
    );

    switch (type) {
        case 'new': {
            return (
                <>
                    { cancelButton }
                    <CustomButton
                        className={ styles.submitButton }
                        onClick={ onSubmit }
                        disabled={ disableAllButtons }
                    >
                        { BUTTON_ADD_USER_TEXT }
                    </CustomButton>
                </>
            );
        }
        case 'edit': {
            return (
                <>
                    { cancelButton }
                    <CustomButton
                        className={ styles.submitButton }
                        onClick={ onSubmit }
                        disabled={ disableAllButtons }
                    >
                        { BUTTON_SAVE_EDIT_USER_TEXT }
                    </CustomButton>
                    { deleteButton }
                </>
            );
        }
        case 'info': {
            return (
                <>
                    <CustomButton
                        className={ styles.submitButton }
                        onClick={ onResetPassword }
                        disabled = { disableAllButtons }
                    >
                        {userBlocked ? INFO_USER_BUTTONS.UNBLOCK : INFO_USER_BUTTONS.RESET_PASSWORD }
                    </CustomButton>
                    <CustomButton
                        className={ styles.submitButton }
                        onClick={ onEditUser }
                        disabled = { disableAllButtons }
                    >
                        { INFO_USER_BUTTONS.EDIT }
                    </CustomButton>
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
