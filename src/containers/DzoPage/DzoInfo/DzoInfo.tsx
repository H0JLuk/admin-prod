import React from 'react';
import { generatePath, RouteComponentProps } from 'react-router-dom';
import { Col, Row, Button } from 'antd';
import Header from '@components/Header';
import { DZO_PAGES } from '@constants/route';
import { deleteDzo } from '@apiServices/dzoService';
import { confirmModal, errorModal } from '@utils/utils';
import { customNotifications } from '@utils/notifications';
import { ImageBlock } from '../../PromoCampaignPage/PromoCampaign/PromoCampaignInfo/Steps/Templates/TemplateBlocks';
import {
    DELETE_CONFIRMATION_MODAL_TITLE,
    ERROR_DELETE_DZO,
    DZO_INFO_TEMPLATE_DATA,
    DZO_BANNERS_TEMPLATE,
    BANNER_IS_EMPTY,
    DZO_INFO_APPS_TEMPLATE,
    LINK_VIDEO_LABEL,
    IMainDataRow,
    IDzoBannersRow,
} from '../dzoConstants';
import { BANNER_TYPE, BUTTON_TEXT } from '@constants/common';
import { DzoDto } from '@types';

import styles from './DzoInfo.module.css';

interface ILocationState {
    dzoData?: DzoDto;
}

interface IDzoInfoProps extends RouteComponentProps<any, any, ILocationState | undefined> {
    matchPath: string;
}

type INormalizedBannerList = {
    [BannerType in BANNER_TYPE]?: string;
};

interface IDzoInfoBlock {
    label: string;
    value: string;
    type?: string;
    colSpan: number;
}

const DzoInfo: React.FC<IDzoInfoProps> = ({
    matchPath,
    history,
    location,
}) => {
    const { state: stateFromLocation } = location;
    const { dzoData } = stateFromLocation || {};
    const redirectToDzoList = () => history.push(matchPath);

    if (!dzoData) {
        redirectToDzoList();
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

            customNotifications.success({
                message: (
                    <span>
                        ДЗО <span className={styles.text}>{dzoData.dzoName}</span> успешно удалено
                    </span>
                ),
            });
            redirectToDzoList();
        } catch (e) {
            const { message } = e;

            errorModal({
                title: (
                    <span>
                        <b>{ERROR_DELETE_DZO}</b>
                        <div>{message}</div>
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
            okText: BUTTON_TEXT.DELETE,
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
                            {DZO_BANNERS_TEMPLATE.map(({ type, label }: IDzoBannersRow) => (
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
                            ))}
                        </Row>
                        <Row gutter={[24, 16]} className={styles.dzoInfoRow}>
                            {applicationList.map(dzoApp =>
                                DZO_INFO_APPS_TEMPLATE.map(({ key, label, type }) => (
                                    <DzoInfoBlock
                                        key={key}
                                        label={label}
                                        value={dzoApp[key]}
                                        type={type}
                                        colSpan={12}
                                    />
                                )),
                            )}
                        </Row>
                        <Row gutter={24}>
                            <DzoInfoBlock
                                label={LINK_VIDEO_LABEL}
                                value={normalizedBannerList.VIDEO || ''}
                                type="url"
                                colSpan={12}
                            />
                        </Row>
                    </div>
                </div>
                <div className={styles.footer}>
                    <Button
                        type="primary"
                        onClick={onEdit}
                    >
                        {BUTTON_TEXT.EDIT}
                    </Button>
                    <Button
                        type="primary"
                        danger
                        onClick={onDeleteClick}
                    >
                        {BUTTON_TEXT.DELETE}
                    </Button>
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
            <div className={styles.text}>
                {value ? decodedUrl : (<i>{`${label} отсутствует`}</i>)}
            </div>
        </Col>
    );
}
