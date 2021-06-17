import React, { Component } from 'react';
import { Modal, Statistic, Row, Col, Typography } from 'antd';
import eq from 'lodash/eq';
import { PromoCampaignDto, PromoCampaignStatisticsDto, PromoCodeType } from '@types';

type PromoCodeStatisticModalProps = {
    title: React.ReactNode;
    open: boolean;
    onClose: () => void;
    currentPromoCampaign?: PromoCampaignDto;
    data?: PromoCampaignStatisticsDto;
};

type PromoCodeStatisticModalState = {
    totalPromoCodesNumber: string | number;
    issuedPromoCodesNumber: string | number;
    currentPromoCampaign?: PromoCampaignDto;
};

const promoCodeTypes: Record<PromoCodeType, string> = {
    PERSONAL: 'В рамках данной промо-кампании любым клиентам выдаются персональные промокоды',
    PERSONAL_CLIENT_POOL: 'В рамках данной промо-кампании определенным клиентам выдаются персональные промокоды',
    COMMON: 'В рамках данной промо-кампании любым клиентам выдается единый промокод',
    COMMON_CLIENT_POOL: 'В рамках данной промо-кампании определенным клиентам клиентам выдается единый промокод',
    NONE: 'В рамках данной промо-кампании промокоды не выдаются'
};
const { Title } = Typography;
const emptyStatistic = {
    totalPromoCodesNumber: '',
    issuedPromoCodesNumber: '',
};

class PromoCodeStatisticModal extends Component<PromoCodeStatisticModalProps, PromoCodeStatisticModalState> {
    constructor(props: PromoCodeStatisticModalProps) {
        super(props);
        this.state = {
            ...emptyStatistic,
            currentPromoCampaign: {} as PromoCampaignDto,
        };
    }

    componentDidUpdate(prevProps: PromoCodeStatisticModalProps) {
        if (!eq(prevProps, this.props)) {
            const { data = {}, currentPromoCampaign } = this.props;
            this.setState({ ...data, currentPromoCampaign });
        }
    }

    render() {
        const {
            open,
            title,
            onClose
        } = this.props;

        const {
            totalPromoCodesNumber, issuedPromoCodesNumber, currentPromoCampaign: { promoCodeType } = {}
        } = this.state;

        const description = promoCodeTypes[promoCodeType as PromoCodeType];

        return (
            <Modal
                title={title}
                visible={open}
                onOk={onClose}
                onCancel={onClose}
            >
                <Title level={3}>{description}</Title>
                <Row gutter={16}>
                    <Col span={12}>
                        <Statistic title="Использовано промокодов"
                            groupSeparator=""
                            value={issuedPromoCodesNumber}
                            suffix={`/ ${ totalPromoCodesNumber }`} />
                    </Col>
                </Row>
            </Modal>
        );
    }
}

(PromoCodeStatisticModal as any).defaultProps = {
    data: emptyStatistic,
    currentPromoCampaign: {},
    title: ''
};

export default PromoCodeStatisticModal;
