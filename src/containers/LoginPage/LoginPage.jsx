import React, { useState } from 'react';
import { goToClientApps, goToDashboard } from '../../utils/appNavigation';
import styles from './LoginPage.module.css';
import { LOGIN_FORM } from '../../components/Form/forms';
import Form from '../../components/Form/Form';
import { login } from '../../api/services/authService';
import { storeUserData } from '../../api/services/sessionService';
import { Errors, getErrorText } from '../../constants/errors';
import { ROLES } from '../../constants/roles';
import ButtonLabels from '../../components/Button/ButtonLables';


const LoginPage = (props) => {

    const [ error, setError ] = useState(null);
    const { history } = props;

    const onSubmit = async (data) => {
        try {
            const { token, authority } = await login(data) ?? {};
            if (!Object.values(ROLES).includes(authority)) {
                setError(Errors.AUTHORITY);
                return;
            }
            storeUserData(token, authority);
            ([ROLES.ADMIN, ROLES.PRODUCT_OWNER].includes(authority))
                ? goToDashboard(history)
                : goToClientApps(history);
        } catch (e) {
            console.error(e?.message);
            setError(Errors.FAIL);
        }
    };

    return (
        <div className={ styles.container }>
            <Form
                data={ LOGIN_FORM }
                buttonText={ ButtonLabels.LOGIN }
                onSubmit={ onSubmit }
                formClassName={ styles.loginForm }
                fieldClassName={ styles.loginForm__field }
                activeLabelClassName={ styles.loginForm__field__activeLabel }
                buttonClassName={ styles.loginForm__button }
                errorText={ getErrorText(error) }
                formError={ !!error }
                errorClassName={ styles.error }
            />
        </div>
    );
};

export default LoginPage;