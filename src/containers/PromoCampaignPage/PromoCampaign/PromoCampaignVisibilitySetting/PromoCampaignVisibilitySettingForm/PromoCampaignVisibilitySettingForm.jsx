import React, { useState, useCallback } from 'react';
import PropTypes from 'prop-types';
import cn from 'classnames';
import { Form, Button, Switch } from 'antd';
import AutocompleteLocationAndSalePoint from '../../../../../components/Form/AutocompleteLocationAndSalePoint/AutocompleteLocationAndSalePoint';
import { addVisibilitySetting } from '../../../../../api/services/promoCampaignService';

import styles from './PromoCampaignVisibilitySettingForm.module.css';

const FORM_NAME = 'createVisibilityForm';

const VISIBILITY_FIELD = {
    name: 'visibility',
    label: 'Включить видимость',
};

const CANCEL_BUTTON_TEXT = 'Отменить';
const SUBMIT_BUTTON_TEXT = 'Добавить';

const layout = {
    labelCol: { span: 6 },
    wrapperCol: { span: 12 },
};

const buttonLayout = {
    wrapperCol: { offset: 4, span: 12 }
};

const errorLayout = {
    wrapperCol: { offset: 5, span: 12 }
};

const PromoCampaignVisibilitySettingForm = ({ onCancel, onSubmit, match = {} }) => {
    const [location, setLocation] = useState(null);
    const [salePoint, setSalePoint] = useState(null);
    const [visibility, setVisibility] = useState(true);
    const [error, setError] = useState('');

    const onFinish = useCallback(async () => {
        if (!location && !salePoint) {
            setError('Укажите локацию или точку продажи');
            return;
        }

        try {
            const { promoCampaignId } = match.params || {};

            await addVisibilitySetting({
                locationId: location?.id || undefined,
                promoCampaignId: Number(promoCampaignId),
                salePointId: salePoint?.id || undefined,
                visible: visibility,
            });

            onSubmit({ location, salePoint, visibility });
        } catch (e) {
            // TODO: add handler for error
            console.error(e);
        }
    }, [onSubmit, match.params, visibility, location, salePoint]);

    const onVisibilityChange = useCallback((visibility) => setVisibility(visibility), []);

    const onLocationChange = useCallback((location) => {
        setLocation(location);
        setError('');
    }, []);

    const onSalePointChange = useCallback((salePoint) => {
        setSalePoint(salePoint);
        setError('');
    }, []);

    return (
        <div className={ styles.formContainer }>
            <Form
                { ...layout }
                className={ cn(styles.form, { [styles.hasError]: !!error }) } // TODO: change error handler for each fields
                name={ FORM_NAME }
                onFinish={ onFinish }
                requiredMark={ false }
            >
                <AutocompleteLocationAndSalePoint
                    layout={ layout }
                    onLocationChange={ onLocationChange }
                    onSalePointChange={ onSalePointChange }
                    locationId={ location?.id }
                />
                <Form.Item
                    labelAlign="left"
                    label={ VISIBILITY_FIELD.label }
                    name={ VISIBILITY_FIELD.name }
                >
                    <Switch
                        className={ cn({ [styles.switch]: visibility }) }
                        checked={ visibility }
                        onChange={ onVisibilityChange }
                    />
                </Form.Item>
                {!!error && (
                    <Form.Item { ...errorLayout }>
                        <div className={ styles.formError }>
                            { error }
                        </div>
                    </Form.Item>
                )}
                <Form.Item { ...buttonLayout }>
                    <Button
                        className={ styles.cancelButton }
                        type="primary"
                        shape="round"
                        htmlType="button"
                        size="large"
                        onClick={ onCancel }
                    >
                        { CANCEL_BUTTON_TEXT }
                    </Button>
                    <Button
                        className={ styles.submitButton }
                        type="primary"
                        shape="round"
                        htmlType="submit"
                        size="large"
                    >
                        { SUBMIT_BUTTON_TEXT }
                    </Button>
                </Form.Item>
            </Form>
        </div>
    );
};

PromoCampaignVisibilitySettingForm.propTypes = {
    onSubmit: PropTypes.func.isRequired,
    onCancel: PropTypes.func.isRequired,
};

PromoCampaignVisibilitySettingForm.defaultProps = {
    onSubmit: () => {},
    onCancel: () => {},
};

export default PromoCampaignVisibilitySettingForm;
