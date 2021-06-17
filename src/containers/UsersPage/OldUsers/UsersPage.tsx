import React, { ChangeEvent, useReducer, useState } from 'react';
import { DEFAULT_SLEEP_TIME } from '@constants/common';
import { useUpdateTokenLifetime } from '@hooks/useUpdateTokenLifetime';
import { sleep } from '@utils/utils';
import styles from './UsersPage.module.css';
import classNames from 'classnames';
import MultiActionForm, { ActionCallback } from '@components/Form/MultiActionForm';
import { CHANGE_USER_FORM } from '@components/Form/forms';
import { oldAddUser, oldRemoveUser, resetUser, unblockUser } from '@apiServices/usersService';
import Button from '@components/Button';
import { baseUrl } from '../../../api/apiClient';
import { getReqOptions } from '@apiServices';
import {
    hideMessage,
    onFileUploadInputChange,
    showErrorMessage,
    showSuccessMessage,
    unsetSent,
    usersPageInitialState,
    usersReducer,
    validateFile,
} from '../UserPage/uploadLogic';
import { NavLink } from 'react-router-dom';
import { getLinkForUsersPage } from '@utils/appNavigation';
import { UserDto } from '@types';

type InputData = ChangeEvent<HTMLInputElement>;
type InputCallback = (data: InputData) => Promise<void>;

const UsersPage = () => {
    const [{ sent, error, msg }, dispatch] = useReducer(usersReducer, usersPageInitialState);
    const [loading, setLoading] = useState(false);

    useUpdateTokenLifetime();

    const preventMultiplePressButton = async (callback: ActionCallback | InputCallback, data: Record<string, string> | InputData) => {
        setLoading(true);
        await callback(data as any);
        await sleep(DEFAULT_SLEEP_TIME);
        setLoading(false);
    };

    const onAddUser = async (data: Record<string, string>) => {
        const newUser = { ...data, password: data.personalNumber };
        try {
            const response = await oldAddUser(newUser as UserDto);
            const message = `Пользователь добавлен в приложение, пароль: ${response.generatedPassword}`;
            dispatch({ type: 'showSuccessMessage', payload: message });
        } catch (e) {
            dispatch({ type: showErrorMessage, payload: e.message });
        }
    };

    const onRemoveUser = async (data: Record<string, string>) => {
        const { personalNumber: pn } = data;
        try {
            await oldRemoveUser(pn);
            dispatch({ type: showSuccessMessage, payload: 'Пользователь удален' });
        } catch (e) {
            dispatch({ type: showErrorMessage, payload: e.message });
        }
    };

    const onResetUser = async (data: Record<string, string>) => {
        const { personalNumber: pn } = data;
        try {
            const response = await resetUser(pn);
            const message = `Пароль и блокировки пользователя сброшены. Новый пароль: ${response.generatedPassword}`;
            dispatch({ type: showSuccessMessage, payload: message });
        } catch (e) {
            dispatch({ type: showErrorMessage, payload: e.message });
        }
    };

    const onUnblockUser = async (data: Record<string, string>) => {
        const { personalNumber: pn } = data;
        try {
            await unblockUser(pn);
            dispatch({ type: showSuccessMessage, payload: 'Пользователь разблокирован' });
        } catch (e) {
            dispatch({ type: showErrorMessage, payload: e.message });
        }
    };

    const onDeleteFileUploadInputChange = async (e: ChangeEvent<HTMLInputElement>) => {
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        const file = e.target.files![0];
        e.preventDefault();
        dispatch({ type: hideMessage });
        if (validateFile(file)) {
            const data = new FormData();
            data.append('multipartUsersFile', file, file.name);
            const uploadUrl = new URL(`${baseUrl}/admin/user/delete/file`);
            let result, response;
            try {
                response = await fetch(uploadUrl.toString(), { ...getReqOptions(), method: 'POST', body: data });
                result = await response.json();
                dispatch({ type: response.ok ? showSuccessMessage : showErrorMessage, payload: result.message });
            } catch (e) {
                dispatch({ type: showErrorMessage, payload: e.message });
            }
        } else {
            dispatch({ type: showErrorMessage, payload: 'Файл не совпадает с шаблоном' });
        }
    };

    const uploadUsers = async (e: ChangeEvent<HTMLInputElement>) => {
        dispatch({ type: hideMessage });
        try {
            await onFileUploadInputChange(e);
        } catch (e) {
            dispatch({ type: showErrorMessage, payload: e.message });
        }
    };

    const renderBody = () => !sent ? (
        <MultiActionForm
            data={CHANGE_USER_FORM}
            actions={[{ handler: preventMultiplePressButton, callback: onAddUser, text: 'Добавить', buttonClassName: styles.userForm__button },
                { handler: preventMultiplePressButton, callback: onRemoveUser, text: 'Удалить', buttonClassName: styles.userForm__button, color: 'red' },
                { handler: preventMultiplePressButton, callback: onUnblockUser, text: 'Разблокировать', buttonClassName: styles.userForm__button },
                { handler: preventMultiplePressButton, callback: onResetUser, text: 'Сбросить пароль', buttonClassName: styles.userForm__button }]}
            formClassName={styles.userForm}
            fieldClassName={styles.userForm__field}
            actionsPanelClasses={styles.actionsPanelClasses}
            activeLabelClassName={styles.userForm__field__activeLabel}
            formError={error}
            errorText={msg || ''}
            errorClassName={styles.error}
            loading={loading}
        />
    ) : (
        <div className={styles.successBlock}>
            <p>{msg}</p>
            <Button
                onClick={() => dispatch({ type: unsetSent })}
                label="Еще"
                type="green"
                font="roboto"
                className={styles.successBlock__button}
                disabled={loading}
            />
        </div>
    );

    return (
        <div className={styles.container}>
            <div style={{ textAlign: 'center', marginBottom: '15px' }}>
                <NavLink to={getLinkForUsersPage()}>Редизайн</NavLink>
            </div>
            {renderBody()}
            <form id="uploadform" className={styles.userForm} style={{ 'marginTop': '20px' }}>
                <h3>Пакетная загрузка</h3>
                <input
                    style={{ display: 'none' }}
                    id="contained-button-file"
                    type="file"
                    onChange={data => preventMultiplePressButton(uploadUsers, data)}
                    accept="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
                    value=""
                    disabled={loading}
                />
                <label htmlFor="contained-button-file" className={styles.packetProcessing__block}>
                    <div className={classNames(styles.packetProcessing__block__button, loading
                        ? styles.disabled
                        : styles.packetProcessing__block__button_green)}
                    >
                        Загрузка пользователей
                    </div>
                </label>
                <input
                    style={{ display: 'none' }}
                    id="contained-button-delete-file"
                    type="file"
                    onChange={data => preventMultiplePressButton(onDeleteFileUploadInputChange, data)}
                    accept="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
                    value=""
                    disabled={loading}
                />
                <label htmlFor="contained-button-delete-file" className={styles.packetProcessing__block}>
                    <div className={classNames(styles.packetProcessing__block__button, loading
                        ? styles.disabled
                        : styles.packetProcessing__block__button_red)}
                    >
                        Удаление пользователей
                    </div>
                </label>
                <div className={styles.packetProcessing__block}>
                    <a href={templateLink('user-upload.csv')}>Шаблон на загрузку</a>
                    <a
                        href={templateLink('user-delete.csv')}
                        className={styles.template__link}
                    >
                        Шаблон на удаление
                    </a>
                </div>
            </form>
        </div>
    );
};

function templateLink(filename: string) {
    return `${process.env.PUBLIC_URL}/templates/${filename}`;
}

export default UsersPage;
