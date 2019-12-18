import React from 'react';
import styles from './LoginPage.module.css';
import { LOGIN_FORM } from '../../components/Form/forms';
import Form from '../../components/Form/Form';

const onSubmit = (data) => {
    console.log(data);
};

const LoginPage = () => {
    return (
        <Form
            data={LOGIN_FORM}
            buttonText='Вход'
            onSubmit={onSubmit}
            formClassName={styles.loginForm}
            fieldClassName={styles.loginForm__field}
            activeLabelClassName={styles.loginForm__field__activeLabel}
            buttonClassName={styles.loginForm__button}
        />
    )
};

export default LoginPage;