import React, { useEffect, useState } from 'react';
import { Col, Row, Statistic, Modal, Typography } from 'antd';
import { getPromoCampaignStatistics } from '../../../../../../../api/services/promoCampaignService';
import { PromoCampaignDto, PromoCodeType } from '@types';

type PromoCodeStatisticModalProps = PromoCampaignDto & {
    open: boolean;
    onClose: () => void;
};

type PromoCodeStatisticModalState = {
    totalPromoCodesNumber: string | number;
    issuedPromoCodesNumber: string | number;
};

const { Title } = Typography;

const TITLE = 'Статистика использования промокодов';
const OK_TEXT = 'Хорошо';

export const promoCodeTypes: Record<PromoCodeType, string> = {
    PERSONAL: 'В рамках данной промо-кампании любым клиентам выдаются персональные промокоды',
    PERSONAL_CLIENT_POOL: 'В рамках данной промо-кампании определенным клиентам выдаются персональные промокоды',
    COMMON: 'В рамках данной промо-кампании любым клиентам выдается единый промокод',
    COMMON_CLIENT_POOL: 'В рамках данной промо-кампании определенным клиентам клиентам выдается единый промокод',
    NONE: 'В рамках данной промо-кампании промокоды не выдаются',
};

const emptyStatistic: PromoCodeStatisticModalState = {
    totalPromoCodesNumber: '',
    issuedPromoCodesNumber: '',
};

const PromoCodeStatisticModal: React.FC<PromoCodeStatisticModalProps> = ({ onClose, open, id, promoCodeType }) => {

    const [promoCodesStatistic, setPromoCodesStatistic] = useState(emptyStatistic);

    const { issuedPromoCodesNumber, totalPromoCodesNumber } = promoCodesStatistic;

    const description = promoCodeTypes[promoCodeType];

    const getPromoCampaignStatistic = async () => {
        const { promoCampaignStatisticsDto } = await getPromoCampaignStatistics(id);
        setPromoCodesStatistic(promoCampaignStatisticsDto);
    };

    useEffect(() => {
        if (open) {
            getPromoCampaignStatistic();
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [open]);

    return (
        <Modal
            title={TITLE}
            visible={open}
            onOk={onClose}
            onCancel={onClose}
            cancelButtonProps={{ hidden: true }}
            okText={OK_TEXT}
            centered
        >
            <Title level={3}>{description}</Title>
            <Row gutter={16}>
                <Col span={12}>
                    <Statistic
                        title="Использовано промокодов"
                        groupSeparator=""
                        value={issuedPromoCodesNumber}
                        suffix={`/ ${totalPromoCodesNumber}`}
                    />
                </Col>
            </Row>
        </Modal>
    );
};

export default PromoCodeStatisticModal;
