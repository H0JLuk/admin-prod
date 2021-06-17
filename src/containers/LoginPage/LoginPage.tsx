import React, { useState, useEffect } from 'react';
import { RouteComponentProps } from 'react-router';
import { goToStartPage } from '@utils/appNavigation';
import { getStaticUrlFromBackend, saveStaticUrl } from '@apiServices/settingsService';
import { LOGIN_FORM } from '@components/Form/forms';
import Form from '@components/Form';
import { login } from '@apiServices/authService';
import { storeUserData } from '@apiServices/sessionService';
import { Errors, getErrorText } from '@constants/errors';
import { ROLES } from '@constants/roles';
import ButtonLabels from '@components/Button/ButtonLables';
import { customNotifications } from '@utils/notifications';
import { UserDto } from '@types';

import styles from './LoginPage.module.css';

const availableRoles = [
    ROLES.ADMIN,
    ROLES.AUDITOR,
    ROLES.PARTNER,
    ROLES.PRODUCT_OWNER,
    ROLES.USER_MANAGER,
];

const LoginPage: React.FC<RouteComponentProps> = (props) => {

    const [ error, setError ] = useState<Errors | null>(null);
    const { history } = props;

    useEffect(() => {
        customNotifications.closeAll();
    }, []);

    const onSubmit = async (data: Record<string, string>) => {
        try {
            const { token, authority } = await login(data as UserDto) ?? {};
            if (!availableRoles.includes(authority)) {
                setError(Errors.FAIL);
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
        <div className={styles.container}>
            <Form
                data={LOGIN_FORM}
                buttonText={ButtonLabels.LOGIN}
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
    );
};

export default LoginPage;
