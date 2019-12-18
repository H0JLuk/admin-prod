import React from 'react';
import styles from './LoginPage.module.css';
import { LOGIN_FORM } from '../../components/Form/forms';
import Form from '../../components/Form/Form';
import { login } from '../../api/services/authService';
import { storeUserData } from '../../api/services/sessionService';
import { ROUTE } from '../../constants/route';

const LoginPage = (props) => {
    const onSubmit = (data) => {
        console.log(data);
        login(data).then(response => {
            console.log(response);
            storeUserData(response.token);
            props.history.push(ROUTE.MAIN)
        })
    };

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