import React, { useReducer } from 'react';
import styles from './UsersPage.module.css';
import MultiActionForm from '../../components/Form/MultiActionForm';
import { CHANGE_USER_FORM } from '../../components/Form/forms';
import { addUser, removeUser } from '../../api/services/adminService';
import Button from '../../components/Button/Button';
import MaterialButton from '@material-ui/core/Button';
import { baseUrl } from '../../api/apiClient';
import { getReqOptions } from '../../api/services';
import { onFileUploadInputChange, usersPageInitialState, usersReducer, validateFile } from './uploadLogic';

const UsersPage = () => {
    const [{ sent, error, msg }, dispatch] = useReducer(usersReducer, usersPageInitialState);
    const onAddUser = async data => {
        const newUser = { ...data, password: data.personalNumber };
        try {
            const response = await addUser(newUser);
            dispatch({ type: 'showSuccessMessage', payload: `Пользователь добавлен в приложение, пароль: ${response.generatedPassword}` });
        } catch (e) {
            dispatch({ type: 'hideMessage' });
        }
    };

    const onRemoveUser = async data => {
        const { personalNumber: pn } = data;
        try {
            await removeUser(pn);
            dispatch({ type: 'showSuccessMessage', payload: 'Пользователь удален' });
        } catch (e) {
            dispatch({ type: 'showError' });
        }
    };

    const onDeleteFileUploadInputChange = async e => {
        const { target: { files: [file] } } = e;
        e.preventDefault();
        dispatch({ type: 'hideMessage' });
        if(validateFile(file)) {
            const data = new FormData();
            data.append('multipartUsersFile', file, file.name);
            const uploadUrl = new URL(`${baseUrl}/admin/user/delete/file`);
            let result, response;
            try {
                response = await fetch(uploadUrl, { ...getReqOptions(), method: 'POST', body: data });
                result = await response.json();
                dispatch({ type: 'showSuccessMessage', payload: result.message });
            } catch (e) {
                dispatch({ type: 'showErrorMessage', payload: `Не удалось удалить пользователей ${e.message}` });
            }
        } else {
            dispatch({ type: 'showErrorMessage', payload: 'Файл не совпадает с шаблоном' });
        }
    };

    const uploadUsers = async e => {
        dispatch({ type: 'hideMessage' });
        try {
            await onFileUploadInputChange(e);
        } catch (e) {
            dispatch({ type: 'showErrorMessage', payload: e.message });
        }
    };

    const renderBody = () => {
        return !sent ? <MultiActionForm
            data={ CHANGE_USER_FORM }
            actions={ [{ handler: onAddUser, text: 'Добавить пользователя', buttonClassName: styles.userForm__button },
                { handler: onRemoveUser, text: 'Удалить пользователя', buttonClassName: styles.userForm__button }] }
            formClassName={ styles.userForm }
            fieldClassName={ styles.userForm__field }
            activeLabelClassName={ styles.userForm__field__activeLabel }
            formError={ error }
            errorText='Ошибка'
            errorClassName={ styles.error } /> :
            <div className={ styles.successBlock }>
                <p>{msg}</p>
                <Button
                    onClick={ () => dispatch({ type: 'unsetSent' }) }
                    label='Еще'
                    type='green'
                    font='roboto'
                    className={ styles.successBlock__button } />
            </div>;
    };

    return (
        <div className={ styles.container }>
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
                <label htmlFor='contained-button-file' className={ styles.packetprocessing__block }>
                    <MaterialButton variant='contained' component='span'>
                        Загрузка пользователей
                    </MaterialButton>
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
                    <MaterialButton variant='contained' component='span'>
                        Удаление пользователей
                    </MaterialButton>
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