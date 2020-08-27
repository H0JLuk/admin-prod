import React, { useState } from 'react';
import styles from './UsersPage.module.css';
import MultiActionForm from '../../components/Form/MultiActionForm';
import { CHANGE_USER_FORM } from '../../components/Form/forms';
import { addUser, removeUser } from '../../api/services/adminService';
import Button from '../../components/Button/Button';

const UsersPage = (props) => {
    const [sent, setSent] = useState(null);
    const [error, setError] = useState(false);
    const [msg, setMsg] = useState(null);

    const onAddUser = (data) => {
        const newUser = { ...data, password: data.personalNumber };
        addUser(newUser).then((response) => {
            setSent(true);
            setError(false)
            setMsg("Пользователь создан, пароль: " + response['generatedPassword'])
        }, (error) => {
            setSent(false);
            setError(true);
            setMsg(null);
        });
    };

    const onRemoveUser = (data) => {
        const pn = data.personalNumber;
        removeUser(pn).then((response) => {
            setSent(true);
            setError(false);
            setMsg("Пользователь удален");
        }, (error) => {
            setSent(false);
            setError(true);
            setMsg(null);
        });
    };

    const renderBody = () => {
        return !sent ? <MultiActionForm
            data={CHANGE_USER_FORM}
            buttonText={['Добавить пользователя', 'Удалить пользователя']}
            onSubmit={[onAddUser, onRemoveUser]}
            formClassName={styles.userForm}
            fieldClassName={styles.userForm__field}
            activeLabelClassName={styles.userForm__field__activeLabel}
            buttonClassName={styles.userForm__button}
            formError={error}
            errorText='Ошибка'
            errorClassName={styles.error}/> :
            <div className={styles.successBlock}>
                <p>{msg}</p>
                <Button
                    onClick={() => setSent(false)}
                    label='Еще'
                    type='green'
                    font='roboto'
                    className={styles.successBlock__button}/>
            </div>
    };

    return (
        <div className={styles.container}>
            {renderBody()}
        </div>
    )
};

export default UsersPage;