import React, { useState, useCallback } from 'react';
import PromoCampaignVisibilitySettingInput from '../../PromoCampaignVisibilitySettingInput/PromoCampaignVisibilitySettingInput';
import { addVisibilitySetting } from '@apiServices/promoCampaignService';
import { Modal } from 'antd';
import { LocationDto, SalePointDto } from '@types';

const BUTTON_ADD_MODAL = 'Добавить';
const BUTTON_CANCEL_MODAL = 'Отменить';
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

    const onLocationChange = useCallback((location: LocationDto | null) => {
        setLocation(location);
        setError(DEFAULT_ERRORS);
    }, []);

    const onSalePointChange = useCallback((salePoint: SalePointDto | null) => {
        setSalePoint(salePoint);
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
            okText={BUTTON_ADD_MODAL}
            cancelText={BUTTON_CANCEL_MODAL}
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
