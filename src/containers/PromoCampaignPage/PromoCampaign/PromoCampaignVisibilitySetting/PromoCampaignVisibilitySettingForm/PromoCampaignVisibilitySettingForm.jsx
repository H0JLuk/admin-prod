import React, { useState, useCallback } from 'react';
import PropTypes from 'prop-types';
import noop from 'lodash/noop';
import { Button } from 'antd';
import { addVisibilitySetting } from '../../../../../api/services/promoCampaignService';
import PromoCampaignVisibilitySettingInput from '../../PromoCampaignVisibilitySettingInput/PromoCampaignVisibilitySettingInput';
import Header from '../../../../../components/Header/Header';

import styles from './PromoCampaignVisibilitySettingForm.module.css';

const CANCEL_BUTTON_TEXT = 'Отменить';
const SUBMIT_BUTTON_TEXT = 'Добавить';
const PAGE_TITLE = 'Новая настройка видимости';
const DEFAULT_ERRORS = { location: '', salePoint: '', server: '' };

const PromoCampaignVisibilitySettingForm = ({ onCancel, onSubmit, match = {} }) => {
    const [location, setLocation] = useState(null);
    const [salePoint, setSalePoint] = useState(null);
    const [visibility, setVisibility] = useState(true);
    const [error, setError] = useState(DEFAULT_ERRORS);

    const onFinish = useCallback(async () => {
        if (!location) {
            return setError({ location: 'Укажите локацию' });
        }

        try {
            const { promoCampaignId } = match.params || {};

            await addVisibilitySetting({
                locationId: location?.id ?? undefined,
                promoCampaignId: Number(promoCampaignId),
                salePointId: salePoint?.id ?? undefined,
                visible: visibility,
            });

            onSubmit({ location, salePoint, visibility });
        } catch (e) {
            setError({ server: e.message });
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
                    <Button type="ghost" htmlType="button" onClick={ onCancel }>
                        { CANCEL_BUTTON_TEXT }
                    </Button>
                    <Button type="primary" onClick={ onFinish }>
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
    onSubmit: noop,
    onCancel: noop,
};

export default PromoCampaignVisibilitySettingForm;
