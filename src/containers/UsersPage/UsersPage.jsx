import React, { useReducer } from 'react';
import { useUpdateTokenLifetime } from '../../hooks/useUpdateTokenLifetime';
import styles from './UsersPage.module.css';
import classNames from 'classnames';
import MultiActionForm from '../../components/Form/MultiActionForm';
import { CHANGE_USER_FORM } from '../../components/Form/forms';
import { oldAddUser, oldRemoveUser, resetUser, unblockUser } from '../../api/services/adminService';
import Button from '../../components/Button/Button';
import { baseUrl } from '../../api/apiClient';
import { getReqOptions } from '../../api/services';
import {
    hideMessage,
    onFileUploadInputChange,
    showErrorMessage,
    showSuccessMessage,
    unsetSent,
    usersPageInitialState,
    usersReducer,
    validateFile
} from './uploadLogic';
import { NavLink } from 'react-router-dom';
import { getLinkForRedesignUsers } from '../../utils/appNavigation';

const UsersPage = () => {
    const [{ sent, error, msg }, dispatch] = useReducer(usersReducer, usersPageInitialState);

    useUpdateTokenLifetime();

    const onAddUser = async data => {
        const newUser = { ...data, password: data.personalNumber };
        try {
            const response = await oldAddUser(newUser);
            dispatch({ type: 'showSuccessMessage', payload: `Пользователь добавлен в приложение, пароль: ${response.generatedPassword}` });
        } catch (e) {
            dispatch({ type: showErrorMessage, payload: e.message });
        }
    };

    const onRemoveUser = async data => {
        const { personalNumber: pn } = data;
        try {
            await oldRemoveUser(pn);
            dispatch({ type: showSuccessMessage, payload: 'Пользователь удален' });
        } catch (e) {
            dispatch({ type: showErrorMessage, payload: e.message });
        }
    };

    const onResetUser = async data => {
        const { personalNumber: pn } = data;
        try {
            const response = await resetUser(pn);
            const message = `Пароль и блокировки пользователя сброшены. Новый пароль: ${response.generatedPassword}`;
            dispatch({ type: showSuccessMessage, payload: message });
        } catch (e) {
            dispatch({ type: showErrorMessage, payload: e.message });
        }
    };

    const onUnblockUser = async data => {
        const { personalNumber: pn } = data;
        try {
            await unblockUser(pn);
            dispatch({ type: showSuccessMessage, payload: 'Пользователь разблокирован' });
        } catch (e) {
            dispatch({ type: showErrorMessage, payload: e.message });
        }
    };

    const onDeleteFileUploadInputChange = async e => {
        const { target: { files: [file] } } = e;
        e.preventDefault();
        dispatch({ type: hideMessage });
        if (validateFile(file)) {
            const data = new FormData();
            data.append('multipartUsersFile', file, file.name);
            const uploadUrl = new URL(`${baseUrl}/admin/user/delete/file`);
            let result, response;
            try {
                response = await fetch(uploadUrl, { ...getReqOptions(), method: 'POST', body: data });
                result = await response.json();
                dispatch({ type: response.ok ? showSuccessMessage : showErrorMessage, payload: result.message });
            } catch (e) {
                dispatch({ type: showErrorMessage, payload: e.message });
            }
        } else {
            dispatch({ type: showErrorMessage, payload: 'Файл не совпадает с шаблоном' });
        }
    };

    const uploadUsers = async e => {
        dispatch({ type: hideMessage });
        try {
            await onFileUploadInputChange(e);
        } catch (e) {
            dispatch({ type: showErrorMessage, payload: e.message });
        }
    };

    const renderBody = () => {
        return !sent ? <MultiActionForm
            data={ CHANGE_USER_FORM }
            actions={ [{ handler: onAddUser, text: 'Добавить', buttonClassName: styles.userForm__button },
                { handler: onRemoveUser, text: 'Удалить', buttonClassName: styles.userForm__button, color: 'red' },
                { handler: onUnblockUser, text: 'Разблокировать', buttonClassName: styles.userForm__button },
                { handler: onResetUser, text: 'Сбросить пароль', buttonClassName: styles.userForm__button }] }
            formClassName={ styles.userForm }
            fieldClassName={ styles.userForm__field }
            actionsPanelClasses={ styles.actionsPanelClasses }
            activeLabelClassName={ styles.userForm__field__activeLabel }
            formError={ error }
            errorText={ msg }
            errorClassName={ styles.error } /> :
            <div className={ styles.successBlock }>
                <p>{msg}</p>
                <Button
                    onClick={ () => dispatch({ type: unsetSent }) }
                    label='Еще'
                    type='green'
                    font='roboto'
                    className={ styles.successBlock__button } />
            </div>;
    };

    return (
        <div className={ styles.container }>
            <div style={ { textAlign: 'center', marginBottom: '15px' } }>
                <NavLink to={ getLinkForRedesignUsers() }>Редизайн</NavLink>
            </div>
            {renderBody()}
            <form id='uploadform' className={ styles.userForm } style={ { 'marginTop': '20px' } }>
                <h3>Пакетная загрузка</h3>
                <input
                    style={ { display: 'none' } }
                    id='contained-button-file'
                    type='file'
                    onChange={ uploadUsers }
                    accept='application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
                    value=''
                />
                <label htmlFor='contained-button-file' className={ styles.packetProcessing__block }>
                    <div className={ classNames(styles.packetProcessing__block__button, styles.packetProcessing__block__button_green) }>
                        Загрузка пользователей
                    </div>
                </label>
                <input
                    style={ { display: 'none' } }
                    id='contained-button-delete-file'
                    type='file'
                    onChange={ onDeleteFileUploadInputChange }
                    accept='application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
                    value=''
                />
                <label htmlFor='contained-button-delete-file' className={ styles.packetProcessing__block }>
                    <div className={ classNames(styles.packetProcessing__block__button, styles.packetProcessing__block__button_red) }>
                        Удаление пользователей
                    </div>
                </label>
                <div className={ styles.packetProcessing__block }>
                    <a href={ templateLink('user-upload.xlsx') } >Шаблон на загрузку</a>
                    <a href={ templateLink('user-delete.xlsx') }
                       className={ styles.template__link }
                    >Шаблон на удаление</a>
                </div>
            </form>
        </div>
    );
};

function templateLink(filename) {
    return `${process.env.PUBLIC_URL}/templates/${filename}`;
}

export default UsersPage;