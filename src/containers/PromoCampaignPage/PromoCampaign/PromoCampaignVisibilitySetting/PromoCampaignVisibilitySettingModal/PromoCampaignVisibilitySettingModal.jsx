import React, { useState, useCallback } from 'react';
import PromoCampaignVisibilitySettingInput from '../../PromoCampaignVisibilitySettingInput/PromoCampaignVisibilitySettingInput';
import { addVisibilitySetting } from '../../../../../api/services/promoCampaignService';
import { Modal } from 'antd';

const BUTTON_ADD_MODAL = 'Добавить';
const BUTTON_CANCEL_MODAL = 'Отменить';
const DEFAULT_ERRORS = { location: '', salePoint: '', server: '' };

const PromoCampaignVisibilitySettingModal = ({ forceUpdate, promoCampaignId, closeModal, isModalVisible }) => {
    const [loading, setLoading] = useState(false);
    const [location, setLocation] = useState(null);
    const [salePoint, setSalePoint] = useState(null);
    const [visibility, setVisibility] = useState(true);
    const [error, setError] = useState(DEFAULT_ERRORS);

    const handleModalClose = useCallback(() => {
        setLocation(null);
        setSalePoint(null);
        setVisibility(true);
        setError(DEFAULT_ERRORS);
        closeModal();
    }, [closeModal]);

    const onLocationChange = useCallback((location) => {
        setLocation(location);
        setError(DEFAULT_ERRORS);
    }, []);

    const onSalePointChange = useCallback((salePoint) => {
        setSalePoint(salePoint);
        setError(DEFAULT_ERRORS);
    }, []);

    const onFinish = useCallback(async () => {
        if (!location) {
            return setError({ location: 'Укажите локацию' });
        }

        try {
            setLoading(true);

            await addVisibilitySetting({
                locationId: location?.id ?? undefined,
                promoCampaignId: Number(promoCampaignId),
                salePointId: salePoint?.id ?? undefined,
                visible: visibility,
            });

            forceUpdate();
            handleModalClose();
        } catch (e) {
            setError({ server: e.message });
        } finally {
            setLoading(false);
        }

    }, [handleModalClose, forceUpdate, promoCampaignId, visibility, location, salePoint]);

    return (
        <Modal
            destroyOnClose
            visible={ isModalVisible }
            onOk={ onFinish }
            onCancel={ handleModalClose }
            confirmLoading={ loading }
            okText={ BUTTON_ADD_MODAL }
            cancelText={ BUTTON_CANCEL_MODAL }
        >
            <PromoCampaignVisibilitySettingInput
                error={ error }
                onLocationChange={ onLocationChange }
                onSalePointChange={ onSalePointChange }
                visibility={ visibility }
                onVisibilityChange={ setVisibility }
                location={ location }
                columnMode
            />
        </Modal>
    );
};

export default PromoCampaignVisibilitySettingModal;
