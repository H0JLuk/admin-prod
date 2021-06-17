import React, { memo } from 'react';
import { Descriptions, Checkbox } from 'antd';
import PropTypes from 'prop-types';

import styles from './PromoCampaignItem.module.css';

const columnsNumber = 1;

type PromoCampaignItemProps = {
    id: number;
    webUrl?: string;
    name: string;
    active?: boolean;
    dzoId: number;
    promoCodeType: string;
    type?: string;
    getDzo: (dzoId: number) => string;
};

const PromoCampaignItem: React.FC<PromoCampaignItemProps> = ({
    webUrl,
    name,
    active,
    dzoId,
    promoCodeType,
    type,
    getDzo
}) => (
    <Descriptions column={columnsNumber} bordered className={styles.description}>
        <Descriptions.Item label="Название">{name}</Descriptions.Item>
        <Descriptions.Item label="ДЗО">{getDzo(dzoId)}</Descriptions.Item>
        <Descriptions.Item label="Ссылка на страницу промо-кампании">{webUrl ? webUrl : '-'}</Descriptions.Item>
        <Descriptions.Item label="Тип промо-кампании">{type}</Descriptions.Item>
        <Descriptions.Item label="Тип промокода">{promoCodeType}</Descriptions.Item>
        <Descriptions.Item label="Активна"><Checkbox checked={active} /></Descriptions.Item>
    </Descriptions>
);

PromoCampaignItem.propTypes = {
    id: PropTypes.number.isRequired,
    name: PropTypes.string.isRequired,
    webUrl: PropTypes.string,
    dzoId: PropTypes.number.isRequired,
    promoCodeType: PropTypes.string.isRequired,
    getDzo: PropTypes.func.isRequired,
};

export default memo(PromoCampaignItem);
