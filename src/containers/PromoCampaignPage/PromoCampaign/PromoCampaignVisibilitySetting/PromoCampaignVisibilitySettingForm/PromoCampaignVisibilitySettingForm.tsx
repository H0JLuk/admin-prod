import React, { useState, useCallback } from 'react';
import PropTypes from 'prop-types';
import { match as Match } from 'react-router-dom';
import noop from 'lodash/noop';
import { Button } from 'antd';
import { addVisibilitySetting } from '@apiServices/promoCampaignService';
import PromoCampaignVisibilitySettingInput from '../../PromoCampaignVisibilitySettingInput/PromoCampaignVisibilitySettingInput';
import Header from '@components/Header';
import { LocationDto, SalePointDto } from '@types';

import styles from './PromoCampaignVisibilitySettingForm.module.css';

type SubmitData = {
    location: LocationDto;
    salePoint: SalePointDto | null;
    visibility: boolean;
};

type PromoCampaignVisibilitySettingFormProps = {
    onCancel: () => void;
    onSubmit: (data?: SubmitData) => void;
    match: Match<{ promoCampaignId: string; }>;
};

const CANCEL_BUTTON_TEXT = 'Отменить';
const SUBMIT_BUTTON_TEXT = 'Добавить';
const PAGE_TITLE = 'Новая настройка видимости';
const DEFAULT_ERRORS = { location: '', salePoint: '', server: '' };

const PromoCampaignVisibilitySettingForm: React.FC<PromoCampaignVisibilitySettingFormProps> = ({
    onCancel,
    onSubmit,
    match = {} as Match<{ promoCampaignId: string; }>,
}) => {
    const [location, setLocation] = useState<LocationDto | null>(null);
    const [salePoint, setSalePoint] = useState<SalePointDto | null>(null);
    const [visibility, setVisibility] = useState(true);
    const [error, setError] = useState<Partial<typeof DEFAULT_ERRORS>>(DEFAULT_ERRORS);

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

    const onLocationChange = useCallback((selectedLocation) => {
        setLocation(selectedLocation);
        setError(DEFAULT_ERRORS);
    }, []);

    const onSalePointChange = useCallback((selectedSalePoint) => {
        setSalePoint(selectedSalePoint);
        setError(DEFAULT_ERRORS);
    }, []);

    return (
        <div className={styles.container}>
            <Header />
            <div className={styles.formContainer}>
                <h1 className={styles.pageTitle}>
                    {PAGE_TITLE}
                </h1>
                <PromoCampaignVisibilitySettingInput
                    error={error}
                    onLocationChange={onLocationChange}
                    onSalePointChange={onSalePointChange}
                    visibility={visibility}
                    onVisibilityChange={setVisibility}
                    location={location}
                />
                <div className={styles.buttons}>
                    <Button type="ghost" htmlType="button" onClick={onCancel}>
                        {CANCEL_BUTTON_TEXT}
                    </Button>
                    <Button type="primary" onClick={onFinish}>
                        {SUBMIT_BUTTON_TEXT}
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
