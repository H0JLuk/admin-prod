import React from 'react';
import { Button } from 'antd';
import noop from 'lodash/noop';
import PropTypes from 'prop-types';
import UserGenerateQRModal from './UserGenerateQRModal';
import { LOGIN_TYPES_ENUM } from '@constants/loginTypes';
import { InteractionsCurrUserToOtherUser } from '@constants/permissions';
import { ClientAppDto, UserInfo } from '@types';

type UserFormButtonGroupProps = {
    type?: 'info' | 'new' | 'edit' | string;
    clientApps?: ClientAppDto[];
    onDelete?: () => void;
    onCancel?: () => void;
    onSubmit?: () => void;
    onResetPassword?: () => void;
    onEditUser?: () => void;
    disableAllButtons?: boolean;
    userData?: UserInfo | null;
    actionPermissions?: InteractionsCurrUserToOtherUser;
};

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
    QR_CODE_GEN_TEXT: 'Сгенерировать QR-код',
};

const UserFormButtonGroup: React.FC<UserFormButtonGroupProps> = ({
    type,
    clientApps,
    onDelete,
    onCancel,
    onSubmit,
    onResetPassword,
    onEditUser,
    disableAllButtons,
    userData,
    actionPermissions,
}) => {
    const { deleteUser, editUser, resetUserPassword, unlockUser, canGenerateQRCode } = actionPermissions || {};
    const { tmpBlocked, personalNumber, loginType, clientAppIds, id } = userData || {};

    const deleteButton = deleteUser && (
        <Button
            type="primary"
            onClick={onDelete}
            disabled={disableAllButtons}
            danger
        >
            {BUTTON.DELETE_TEXT}
        </Button>
    );

    const cancelButton = (
        <Button
            type="ghost"
            onClick={onCancel}
            disabled={disableAllButtons}
        >
            {BUTTON.CANCEL_TEXT}
        </Button>
    );

    switch (type) {
        case 'new': {
            return (
                <>
                    {cancelButton}
                    <Button
                        type="primary"
                        onClick={onSubmit}
                        disabled={disableAllButtons}
                    >
                        {BUTTON.ADD_USER_TEXT}
                    </Button>
                </>
            );
        }
        case 'edit': {
            return (
                <>
                    {cancelButton}
                    <Button
                        type="primary"
                        onClick={onSubmit}
                        disabled={disableAllButtons}
                    >
                        {BUTTON.SAVE_EDIT_USER_TEXT}
                    </Button>
                    {deleteButton}
                </>
            );
        }
        case 'info': {
            const showResetOrUnlockBtn =
                loginType === LOGIN_TYPES_ENUM.PASSWORD &&
                (
                    (tmpBlocked && unlockUser) ||
                    (!tmpBlocked && resetUserPassword)
                );
            const showQRCodeBtn = loginType === LOGIN_TYPES_ENUM.DIRECT_LINK && canGenerateQRCode;
            return (
                <>
                    {showQRCodeBtn && (
                        <UserGenerateQRModal
                            clientApps={clientApps}
                            personalNumber={personalNumber}
                            userId={id}
                            userClientAppIds={clientAppIds}
                            buttonDisabled={disableAllButtons}
                        />
                    )}
                    {showResetOrUnlockBtn && (
                        <Button
                            type="primary"
                            onClick={onResetPassword}
                            disabled={disableAllButtons}
                        >
                            {tmpBlocked ? INFO_USER_BUTTONS.UNBLOCK : INFO_USER_BUTTONS.RESET_PASSWORD}
                        </Button>
                    )}
                    {editUser && (
                        <Button
                            type="primary"
                            onClick={onEditUser}
                            disabled={disableAllButtons}
                        >
                            {INFO_USER_BUTTONS.EDIT}
                        </Button>
                    )}
                    {deleteButton}
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
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    clientApps: PropTypes.array,
    onDelete: PropTypes.func,
    onCancel: PropTypes.func,
    onSubmit: PropTypes.func,
    onResetPassword: PropTypes.func,
    onEditUser: PropTypes.func,
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    userData: PropTypes.object,
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    actionPermissions: PropTypes.object,
    disableAllButtons: PropTypes.bool,
};

UserFormButtonGroup.defaultProps = {
    type: 'info',
    onDelete: noop,
    onCancel: noop,
    onSubmit: noop,
    onResetPassword: noop,
    onEditUser: noop,
    disableAllButtons: false,
};

export default UserFormButtonGroup;
