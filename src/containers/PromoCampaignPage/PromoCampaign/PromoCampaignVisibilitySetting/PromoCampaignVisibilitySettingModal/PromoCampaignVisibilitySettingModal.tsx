import React, { useState, useCallback } from 'react';
import PromoCampaignVisibilitySettingInput from '../../PromoCampaignVisibilitySettingInput';
import { addVisibilitySetting } from '@apiServices/promoCampaignService';
import { Modal } from 'antd';
import { LocationDto, SalePointDto } from '@types';
import { BUTTON_TEXT } from '@constants/common';

const DEFAULT_ERRORS = { location: '', salePoint: '', server: '' };

type PromoCampaignVisibilitySettingModalProps = {
    forceUpdate: () => void;
    promoCampaignId: number;
    closeModal: () => void;
    isModalVisible: boolean;
};

const PromoCampaignVisibilitySettingModal: React.FC<PromoCampaignVisibilitySettingModalProps> = ({
    forceUpdate,
    promoCampaignId,
    closeModal,
    isModalVisible,
}) => {
    const [loading, setLoading] = useState(false);
    const [location, setLocation] = useState<LocationDto | null>(null);
    const [salePoint, setSalePoint] = useState<SalePointDto | null>(null);
    const [visibility, setVisibility] = useState(true);
    const [error, setError] = useState<Partial<typeof DEFAULT_ERRORS>>(DEFAULT_ERRORS);

    const handleModalClose = useCallback(() => {
        setLocation(null);
        setSalePoint(null);
        setVisibility(true);
        setError(DEFAULT_ERRORS);
        closeModal();
    }, [closeModal]);

    const onLocationChange = useCallback((selectedLocation: LocationDto | null) => {
        setLocation(selectedLocation);
        setError(DEFAULT_ERRORS);
    }, []);

    const onSalePointChange = useCallback((selectedSalePoint: SalePointDto | null) => {
        setSalePoint(selectedSalePoint);
        setError(DEFAULT_ERRORS);
    }, []);

    const onFinish = async () => {
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

    };

    return (
        <Modal
            destroyOnClose
            visible={isModalVisible}
            onOk={onFinish}
            onCancel={handleModalClose}
            confirmLoading={loading}
            okText={BUTTON_TEXT.ADD}
            cancelText={BUTTON_TEXT.CANCEL}
        >
            <PromoCampaignVisibilitySettingInput
                error={error}
                onLocationChange={onLocationChange}
                onSalePointChange={onSalePointChange}
                visibility={visibility}
                onVisibilityChange={setVisibility}
                location={location}
                columnMode
            />
        </Modal>
    );
};

export default PromoCampaignVisibilitySettingModal;
