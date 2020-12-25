import React, { useState, useCallback } from 'react';
import PropTypes from 'prop-types';
import { Button } from 'antd';
import { addVisibilitySetting } from '../../../../../api/services/promoCampaignService';
import PromoCampaignVisibilitySettingInput from '../../../PromoCampaignVisibilitySettingInput/PromoCampaignVisibilitySettingInput';
import Header from '../../../../../components/Header/Redisegnedheader/Header';

import styles from './PromoCampaignVisibilitySettingForm.module.css';

const CANCEL_BUTTON_TEXT = 'Отменить';
const SUBMIT_BUTTON_TEXT = 'Добавить';
const PAGE_TITLE = 'Новая настройка видимости';
const DEFAULT_ERRORS = { location: '', salePoint: '' };

const PromoCampaignVisibilitySettingForm = ({ onCancel, onSubmit, match = {} }) => {
    const [location, setLocation] = useState(null);
    const [salePoint, setSalePoint] = useState(null);
    const [visibility, setVisibility] = useState(true);
    const [error, setError] = useState(DEFAULT_ERRORS);

    const onFinish = useCallback(async () => {
        if (!salePoint) {
            return setError({ salePoint: 'Укажите точку продажи' });
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

    const onLocationChange = useCallback((location) => {
        setLocation(location);
        setError(DEFAULT_ERRORS);
    }, []);

    const onSalePointChange = useCallback((salePoint) => {
        setSalePoint(salePoint);
        setError(DEFAULT_ERRORS);
    }, []);

    return (
        <div className={ styles.container }>
            <Header />
            <div className={ styles.formContainer }>
                <h1 className={ styles.pageTitle }>
                    { PAGE_TITLE }
                </h1>
                <PromoCampaignVisibilitySettingInput
                    error={ error }
                    onLocationChange={ onLocationChange }
                    onSalePointChange={ onSalePointChange }
                    visibility={ visibility }
                    onVisibilityChange={ setVisibility }
                    location={ location }
                />
                <div className={ styles.buttons }>
                    <Button
                        className={ styles.cancelButton }
                        htmlType="button"
                        onClick={ onCancel }
                    >
                        { CANCEL_BUTTON_TEXT }
                    </Button>
                    <Button
                        onClick={ onFinish }
                        className={ styles.submitButton }
                        type="primary"
                    >
                        { SUBMIT_BUTTON_TEXT }
                    </Button>
                </div>
            </div>
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
