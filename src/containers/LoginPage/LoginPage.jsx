import React, { useState } from 'react';
import styles from './LoginPage.module.css';
import { LOGIN_FORM } from '../../components/Form/forms';
import Form from '../../components/Form/Form';
import { login } from '../../api/services/authService';
import { storeUserData } from '../../api/services/sessionService';
import { ROUTE } from '../../constants/route';
import { errors, getErrorText } from '../../constants/errors';
import { roles } from '../../constants/users';

const LoginPage = (props) => {
    const [error, setError] = useState(null);

    const onSubmit = (data) => {
        login(data).then(response => {
            if (response.authority !== roles.admin) {
                setError(errors.authority);
                return;
            }
            storeUserData(response.token);
            props.history.push(ROUTE.APP)
        }, () => {
            setError(errors.fail);
        })
    };

    return (
        <div className={styles.container}>
            <Form
                data={LOGIN_FORM}
                buttonText='Вход'
                onSubmit={onSubmit}
                formClassName={styles.loginForm}
                fieldClassName={styles.loginForm__field}
                activeLabelClassName={styles.loginForm__field__activeLabel}
                buttonClassName={styles.loginForm__button}
                errorText={getErrorText(error)}
                formError={!!error}
                errorClassName={styles.error}
            />
        </div>
    )
};

export default LoginPage;