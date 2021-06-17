import React from 'react';
import { generatePath, useHistory, useLocation } from 'react-router-dom';
import { Col, Row, Space, Button } from 'antd';
import Header from '../../../components/Header/Header';
import { DZO_PAGES } from '../../../constants/route';
import { deleteDzo } from '../../../api/services/dzoService';
import { confirmModal, errorModal, successModal } from '../../../utils/utils';
import { ImageBlock } from '../../PromoCampaignPage/PromoCampaign/PromoCampaignInfo/Steps/Templates/TemplateBlocks';
import {
    DELETE_BUTTON_LABEL,
    DELETE_CONFIRMATION_MODAL_TITLE,
    ERROR_DELETE_DZO, OK_TEXT,
    DZO_INFO_TEMPLATE_DATA,
    DZO_BANNERS_TEMPLATE,
    BANNER_IS_EMPTY,
    DZO_INFO_APPS_TEMPLATE,
    EDIT,
    IMainDataRow,
    IDzoBannersRow,
    IDzoInfoRow,
} from '../dzoConstants';
import { dzoBannerTypes, IDzoItem } from '@types';

import styles from './DzoInfo.module.css';

interface IDzoInfoProps {
    matchPath: string;
}

interface ILocationState {
    dzoData: IDzoItem;
}

type INormalizedBannerList = {
    [BannerType in keyof typeof dzoBannerTypes]?: string;
};

interface IDzoInfoBlock {
    label: string;
    value: string;
    type?: string ;
    colSpan: number;
}

const DzoInfo = ({ matchPath }: IDzoInfoProps) => {
    const history = useHistory();
    const { state: stateFromLocation } = useLocation();
    const { dzoData } = (stateFromLocation || {}) as ILocationState;
    const redirectToDzoList = () => history.push(matchPath);

    if (!dzoData) {
        history.push(matchPath);
        return null;
    }

    const { dzoId, applicationList, dzoBannerList } = dzoData;
    const normalizedBannerList: INormalizedBannerList = dzoBannerList.reduce((acc, { type, url }) => ({
        ...acc,
        [type]: url,
    }), {});

    const onEdit = () => {
        history.push(generatePath(`${ matchPath }${ DZO_PAGES.DZO_EDIT }`, { dzoId }), { dzoData });
    };

    const onDelete = async () => {
        try {
            await deleteDzo(dzoId);

            // TODO: maybe later change this to notification
            successModal({
                onOk: redirectToDzoList,
                title: (
                    <span>
                        ДЗО <span className={styles.text}>{dzoData.dzoName}</span> успешно удалено
                    </span>
                ),
                okText: OK_TEXT,
            });
        } catch (e) {
            const { message } = e;

            errorModal({
                title: (
                    <span>
                        {ERROR_DELETE_DZO} <span className={styles.text}>{message}</span>
                    </span>
                ),
            });
            console.warn(e);
        }
    };

    const onDeleteClick = () => {
        confirmModal({
            title: (
                <span>
                    {DELETE_CONFIRMATION_MODAL_TITLE} <span className={styles.text}>{`${dzoData.dzoName}?`}</span>
                </span>
            ),
            okText: DELETE_BUTTON_LABEL,
            onOk: onDelete,
            okButtonProps: { danger: true },
        });
    };

    return (
        <div className={styles.dzoWrapper}>
            <Header />
            <div className={styles.container}>
                <div className={styles.dzoTitle}>
                    {dzoData.dzoName}
                </div>
                <div className={styles.infoWrapper}>
                    <div className={styles.dzoInfo}>
                        {DZO_INFO_TEMPLATE_DATA.map((row, index) => (
                            <Row gutter={[24, 16]} key={index} className={styles.dzoInfoRow}>
                                {row.map(({ key, label }: IMainDataRow) => (
                                    <DzoInfoBlock
                                        key={key}
                                        label={label}
                                        value={dzoData[key] || ''}
                                        colSpan={24 / row.length}
                                    />
                                ))}
                            </Row>
                        ))}
                        <Row className={styles.bannersRow} gutter={24}>
                            {DZO_BANNERS_TEMPLATE.map(({ type, label }: IDzoBannersRow) =>
                                <Col span={8} key={type}>
                                    {normalizedBannerList[type] ? (
                                        <ImageBlock
                                            type="logo"
                                            label={label}
                                            src={normalizedBannerList[type]}
                                        />
                                    ) : (
                                        <>
                                            <div className={styles.infoTitle}>{label}</div>
                                            <div>
                                                <i>{BANNER_IS_EMPTY}</i>
                                            </div>
                                        </>
                                    )}
                                </Col>
                            )}
                        </Row>
                        <Row gutter={[24, 16]}>
                            {applicationList.map(dzoApp =>
                                DZO_INFO_APPS_TEMPLATE.map(({ key, label, type }: IDzoInfoRow) => (
                                    <DzoInfoBlock
                                        key={key}
                                        label={label}
                                        value={dzoApp[key]}
                                        type={type}
                                        colSpan={12}
                                    />
                                ))
                            )}
                        </Row>
                    </div>
                </div>
                <div className={styles.footer}>
                    <Space>
                        <Button
                            type="primary"
                            onClick={onEdit}
                        >
                            {EDIT}
                        </Button>
                        <Button
                            type="primary"
                            danger
                            onClick={onDeleteClick}
                        >
                            {DELETE_BUTTON_LABEL}
                        </Button>
                    </Space>
                </div>
            </div>
        </div>
    );
};

export default DzoInfo;

function DzoInfoBlock({ label, value, type, colSpan }: IDzoInfoBlock) {
    const decodedUrl = type === 'url' ? decodeURI(value) : value;

    return (
        <Col span={colSpan}>
            <div className={styles.title}>{label}</div>
            <span className={styles.text}>
                {value ? decodedUrl : (<i>{`${ label } отсутствует`}</i>)}
            </span>
        </Col>
    );
}
