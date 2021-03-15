import React, { useState, useEffect } from 'react';
import { goToStartPage } from '../../utils/appNavigation';
import { getStaticUrlFromBackend, saveStaticUrl } from '../../api/services/settingsService';
import { LOGIN_FORM } from '../../components/Form/forms';
import Form from '../../components/Form/Form';
import { login } from '../../api/services/authService';
import { storeUserData } from '../../api/services/sessionService';
import { Errors, getErrorText } from '../../constants/errors';
import { ROLES } from '../../constants/roles';
import ButtonLabels from '../../components/Button/ButtonLables';
import { notification } from 'antd';

import styles from './LoginPage.module.css';


const LoginPage = (props) => {

    const [ error, setError ] = useState(null);
    const { history } = props;

    useEffect(() => {
        notification.destroy();
    }, []);

    const onSubmit = async (data) => {
        try {
            const { token, authority } = await login(data) ?? {};
            if (!Object.values(ROLES).includes(authority)) {
                setError(Errors.AUTHORITY);
                return;
            }

            storeUserData(token, authority);
            saveStaticUrl(await getStaticUrlFromBackend());
            goToStartPage(history, true, authority);
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