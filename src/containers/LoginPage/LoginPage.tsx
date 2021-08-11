import React, { useState, useEffect } from 'react';
import { RouteComponentProps } from 'react-router';
import { Form, Input, Button } from 'antd';
import { goToStartPage } from '@utils/appNavigation';
import { getStaticUrlFromBackend, saveStaticUrl } from '@apiServices/settingsService';
import { login } from '@apiServices/authService';
import { storeUserData } from '@apiServices/sessionService';
import { Errors, getErrorText } from '@constants/errors';
import { ROLES } from '@constants/roles';
import { customNotifications } from '@utils/notifications';
import { BUTTON_TEXT } from '@constants/common';
import { FORM_RULES } from '@utils/validators';

import styles from './LoginPage.module.css';

type FormValues = {
    personalNumber: string;
    password: string;
};

const availableRoles = [
    ROLES.ADMIN,
    ROLES.AUDITOR,
    ROLES.PARTNER,
    ROLES.PRODUCT_OWNER,
    ROLES.USER_MANAGER,
];

const LoginPage: React.FC<RouteComponentProps> = ({ history }) => {
    const [ error, setError ] = useState<Errors | null>(null);

    useEffect(() => {
        customNotifications.closeAll();
    }, []);

    const onSubmit = async (data: FormValues) => {
        try {
            const { token, authority } = await login(data);
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

    const clearError = () => setError(null);

    return (
        <div className={styles.container}>
            <Form
                className={styles.loginForm}
                layout="vertical"
                validateTrigger="onSubmit"
                onFinish={onSubmit}
                requiredMark={false}
            >
                <Form.Item
                    name="personalNumber"
                    label="Табельный номер"
                    rules={[
                        FORM_RULES.REQUIRED,
                        FORM_RULES.NUMBER,
                    ]}
                    validateFirst
                >
                    <Input
                        maxLength={30}
                        allowClear
                    />
                </Form.Item>
                <Form.Item
                    name="password"
                    label="Пароль"
                    rules={[FORM_RULES.REQUIRED]}
                >
                    <Input.Password
                        maxLength={30}
                        visibilityToggle={false}
                        allowClear
                    />
                </Form.Item>
                {error && <p className={styles.error}>{getErrorText(error)}</p>}
                <Button
                    className={styles.loginForm__button}
                    type="primary"
                    htmlType="submit"
                    shape="round"
                    onClick={clearError}
                >
                    {BUTTON_TEXT.LOGIN}
                </Button>
            </Form>
        </div>
    );
};

export default LoginPage;
