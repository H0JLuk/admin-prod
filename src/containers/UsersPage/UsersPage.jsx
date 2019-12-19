import React, { useState } from 'react';
import styles from './UsersPage.module.css';
import Form from '../../components/Form/Form';
import { NEW_USER_FORM } from '../../components/Form/forms';
import { addUser } from '../../api/services/adminService';
import Button from '../../components/Button/Button';

const UsersPage = (props) => {
    const [sent, setSent] = useState(null);
    const [error, setError] = useState(false);

    const onAddUser = (data) => {
        const newUser = { ...data, password: data.personalNumber };
        addUser(newUser).then((response) => {
            setSent(true);
            setError(false)
        }, (error) => {
            setSent(false);
            setError(true);
        });
    };

    const renderBody = () => {
        return !sent ? <Form
            data={NEW_USER_FORM}
            buttonText='Добавить пользователя'
            onSubmit={onAddUser}
            formClassName={styles.userForm}
            fieldClassName={styles.userForm__field}
            activeLabelClassName={styles.userForm__field__activeLabel}
            buttonClassName={styles.userForm__button}
            formError={error}
            errorText='Ошибка'
            errorClassName={styles.error}/> :
            <div className={styles.successBlock}>
                <p>Пользователь добавлен</p>
                <Button
                    onClick={() => setSent(false)}
                    label='Добавить еще'
                    type='green'
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