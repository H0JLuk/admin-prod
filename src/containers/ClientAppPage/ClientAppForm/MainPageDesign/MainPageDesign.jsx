import React, { useState, useEffect } from 'react';
import { Button, Form } from 'antd';
import { getAppCode } from '../../../../api/services/sessionService';
import {
    designElements,
    EDIT_BUTTON_LABEL,
    keysToString,
    SETTINGS_TYPES,
} from '../ClientAppFormConstants';
import { createOrUpdateKey, showNotify } from '../utils';
import AppFormConstructor from '../FormConstructor/FormConstructor';
import Loading from '../../../../components/Loading/Loading';

import styles from './MainPageDesign.module.css';

const MainPageDesign = ({
    designSettings: { current: designSettings },
    updateSettings,
    initialData: { current: initialData },
}) => {

    const [form] = Form.useForm();
    const [loading, setLoading] = useState(false);
    const [canSave, setCanSave] = useState(false);

    useEffect(() => {
        form.setFieldsValue(designSettings);
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const handleSubmit = async ({ home_page_theme, ...rest }) => {
        const formData = { ...rest, ...home_page_theme, };
        const oldDesignedSettings = {
            ...designSettings,
            ...designSettings.home_page_theme,
            design_elements: JSON.stringify(designSettings.home_page_theme.design_elements),
        };

        try {
            const clientAppCode = getAppCode();
            const changedParams = Object.keys(formData).reduce((result, key) => {
                const valueFromServer = initialData[key];
                const valueInForm = keysToString.includes(key) ? JSON.stringify(formData[key]) : formData[key];

                if (valueInForm !== oldDesignedSettings[key]) {
                    if (valueFromServer === undefined) {
                        return [...result, { clientAppCode, key, value: valueInForm, type: SETTINGS_TYPES.CREATE }];
                    }

                    return [...result, { clientAppCode, key, value: valueInForm, type: SETTINGS_TYPES.EDIT }];
                }

                return result;
            }, []);

            if (changedParams.length) {
                setLoading(true);
                await createOrUpdateKey(changedParams);
                setCanSave(false);
                updateSettings(changedParams.reduce((result, { key, value }) => ({ ...result, [key]: value }), {}));
                showNotify(`Оформление для витрины '${designSettings.displayName}' обновлено`);
            }
        } catch ({ message }) {
            showNotify(message, true);
        }
        setLoading(false);
    };

    const enableBtn = () => {
        setCanSave(true);
    };

    return (
        <div className={ styles.wrapper }>
            { loading && <Loading /> }
            <Form
                className={ styles.form }
                form={ form }
                onFinish={ handleSubmit }
                layout="vertical"
                onFieldsChange={ enableBtn }
                id="edit"
            >
                <div className={ styles.container }>
                    { designElements.map((row, index) => (
                        <AppFormConstructor
                            key={ index }
                            row={ row }
                        />
                    )) }
                </div>
                <div className={ styles.buttonGroup }>
                    <Button
                        disabled={ !canSave }
                        type="primary"
                        htmlType="submit"
                    >
                        { EDIT_BUTTON_LABEL }
                    </Button>
                </div>
            </Form>
        </div>
    );
};

export default MainPageDesign;
