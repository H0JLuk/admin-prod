import React, { useCallback, useEffect, useRef, useState, memo } from 'react';
import { DownOutlined } from '@ant-design/icons';
import { Button, Tooltip } from 'antd';
import cn from 'classnames';
import { LOGIN_TYPES_ENUM } from '@constants/loginTypes';
import { UserInfo } from '@types';
import { ROLES_FOR_EXTERNAL_SALE_POINT } from '../../UserFormHelper';

import styles from './ActionsDropDown.module.css';

type ActionsDropDownProps = {
    selectedItems: {
        rowKeys: number[];
        rowValues: UserInfo[];
    };
    onClickResetPass(): Promise<void>;
    linkEdit(): void;
    generateQRDisabled: boolean;
    generateQR(): Promise<void>;
};

const BUTTON_CHANGE_PASSWORD = 'Сбросить пароль';
const BUTTON_GENERATE_QR = 'Сгенерировать QR-код';
const BUTTON_EDIT = 'Редактировать';
const CHOOSE_ACTION = 'Выбрать действие';

const ActionsDropDown: React.FC<ActionsDropDownProps> = ({
    selectedItems,
    onClickResetPass,
    linkEdit,
    generateQRDisabled,
    generateQR,
}) => {
    const [isOpen, setIsOpen] = useState(false);
    const ref = useRef<HTMLDivElement>(null);

    const toggleOpen = () => setIsOpen((state) => !state);

    const closeWhenClickOutside = useCallback((e) => {
        if (!ref.current?.contains(e.target)) {
            setIsOpen(false);
        }
    }, []);

    useEffect(() => {
        if (isOpen) {
            document.addEventListener('click', closeWhenClickOutside);
        } else {
            document.removeEventListener('click', closeWhenClickOutside);
        }

        return () => document.removeEventListener('click', closeWhenClickOutside);
    }, [isOpen, closeWhenClickOutside]);

    return (
        <div className={styles.dropdown} ref={ref}>
            <Button
                className={cn(styles.dropdownButton, { [styles.dropdownActive]: isOpen })}
                onClick={toggleOpen}
            >
                {CHOOSE_ACTION} <DownOutlined />
            </Button>
            <div className={cn(styles.dropdownMenu, { [styles.open]: isOpen })}>
                <div className={styles.dropdownButtonsWrapper}>
                    <ResetUsersPasswordBtn
                        onClick={onClickResetPass}
                        selectedUsers={selectedItems.rowValues}
                    />
                    <EditSomeUsersBtn
                        onClick={linkEdit}
                        selectedUsers={selectedItems.rowValues}
                    />
                    <Button
                        className={styles.buttons}
                        type="text"
                        disabled={generateQRDisabled || !selectedItems.rowKeys.length}
                        onClick={generateQR}
                    >
                        {BUTTON_GENERATE_QR}
                    </Button>
                </div>
            </div>
        </div>
    );
};

type EditSomeUsersBtnProps = {
    selectedUsers: UserInfo[];
    onClick(): void;
};

// eslint-disable-next-line react/display-name
const EditSomeUsersBtn: React.FC<EditSomeUsersBtnProps> = memo(({
    selectedUsers,
    onClick,
}) => {
    let tooltipTitle = '';
    const isExistRoleWithInternalSalePoint = selectedUsers.some(({ role }) => !ROLES_FOR_EXTERNAL_SALE_POINT.includes(role));
    const isExistRoleWithExternalSalePoint = selectedUsers.some(({ role }) => ROLES_FOR_EXTERNAL_SALE_POINT.includes(role));
    const isExistBothSalePointKind = isExistRoleWithInternalSalePoint && isExistRoleWithExternalSalePoint;

    if (isExistBothSalePointKind) {
        tooltipTitle = 'Нельзя редактировать несколько пользователей, когда выбраны пользователи с разными видами точек продаж';
    }

    return (
        <Tooltip
            title={tooltipTitle}
            placement="right"
            trigger={['hover', 'click']}
        >
            <Button
                className={styles.buttons}
                type="text"
                disabled={!selectedUsers.length || isExistBothSalePointKind}
                onClick={onClick}
            >
                {BUTTON_EDIT}
            </Button>
        </Tooltip>
    );
});

type ResetUsersPasswordBtnProps = {
    onClick: () => void;
    selectedUsers: UserInfo[];
};

// eslint-disable-next-line react/display-name
const ResetUsersPasswordBtn: React.FC<ResetUsersPasswordBtnProps> = memo(({
    onClick,
    selectedUsers,
}) => {
    let tooltipTitle: JSX.Element[] | string = '';
    const cantResetPassUsers = selectedUsers.filter(({ loginType }) => loginType !== LOGIN_TYPES_ENUM.PASSWORD);
    const { length } = cantResetPassUsers;

    if (length) {
        tooltipTitle = cantResetPassUsers.reduce((result, user, index, arr) => [
            ...result,
            <span key={user.id}>
                {user.personalNumber}
                {arr[index + 1] ? ', ' : ''}
            </span>,
        ],
        [
            <span key="startString">
                Нельзя сбросить пароль для
                {length > 1 ? ' пользователей ' : ' пользователя '}
                с логином:
                <br />
            </span>,
        ]);
    }

    return (
        <Tooltip
            title={tooltipTitle}
            placement="right"
        >
            <Button
                className={styles.buttons}
                type="text"
                disabled={!selectedUsers.length || !!length}
                onClick={onClick}
            >
                {BUTTON_CHANGE_PASSWORD}
            </Button>
        </Tooltip>
    );
});

export default ActionsDropDown;
