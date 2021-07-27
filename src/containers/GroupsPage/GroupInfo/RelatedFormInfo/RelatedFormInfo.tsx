import React from 'react';
import { arrayToObject } from '@utils/helper';
import { BundleDto, BundleLink } from '@types';
import { History } from 'history';
import cn from 'classnames';
import { Row, Col, Button } from 'antd';
import ImagesBlock from '@components/ImagesBlock';
import { associationGroupRows, BundleRowsValueDto } from '../groupInfo.constants';
import { confirmModal, errorModal, successModal } from '@utils/utils';
import { deleteCampaignGroup } from '@apiServices/campaignGroupService';
import { BundleTypes, BUNDLE_LOCATION_KEY } from '../../groupPageConstants';
import { normalizedLinksDto } from '../types';
import { BUTTON_TEXT } from '@constants/common';

import styles from './RelatedFormInfo.module.css';

export type RelatedFormInfoProps = {
    matchPath: string;
    groupId: number;
    bundleData: BundleDto;
    history: History;
};

const DELETE_CONFIRMATION_MODAL_TITLE = 'Вы действительно хотите удалить связанную кампанию';
const ERROR_DELETE = 'Ошибка удаления';
const OK_TEXT = 'ОК';
const BANNER_EMPTY = 'Логотип отсутствует';
const HEADER_EMPTY = 'Заголовок отсутствует';

const RelatedFormInfo: React.FC<RelatedFormInfoProps> = ({ matchPath, history, groupId, bundleData }) => {
    const redirectToBundleList = () => history.push(matchPath);

    const { name, links } = bundleData;

    const normalizeLinks = links.reduce(
        (prev: normalizedLinksDto<Omit<BundleLink, 'banners' | 'texts'>>[], { banners, texts, ...rest }) => [
            ...prev,
            {
                banners: { ...arrayToObject(banners, 'type', 'url') },
                texts: { ...arrayToObject(texts, 'type', 'value') },
                ...rest,
            },
        ],
        [],
    );

    const handleEdit = () => {
        history.push(`${matchPath}/${groupId}/edit?type=${BundleTypes.ASSOCIATION}`, {
            [BUNDLE_LOCATION_KEY]: bundleData,
        });
    };

    const onDelete = async () => {
        try {
            await deleteCampaignGroup(groupId);

            successModal({
                onOk: redirectToBundleList,
                title: (
                    <span>
                        Связанная кампания <span className={styles.text}>{name}</span> успешно удалена
                    </span>
                ),
                okText: OK_TEXT,
            });
        } catch (e) {
            errorModal({
                title: (
                    <span>
                        {ERROR_DELETE} <span className={styles.text}>{e.message}</span>
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
                    {DELETE_CONFIRMATION_MODAL_TITLE} <span className={styles.text}>{`${name}?`}</span>
                </span>
            ),
            okText: BUTTON_TEXT.DELETE,
            onOk: onDelete,
            okButtonProps: { danger: true },
        });
    };

    return (
        <div>
            <div className={styles.headerActions}>
                <div>
                    <div className={styles.title}>{name}</div>
                </div>
                <div className={styles.buttonBlock}>
                    <Button type="primary" onClick={handleEdit}>
                        {BUTTON_TEXT.EDIT}
                    </Button>
                    <Button type="primary" danger onClick={onDeleteClick}>
                        {BUTTON_TEXT.DELETE}
                    </Button>
                </div>
            </div>
            <div className={styles.wrapper}>
                {normalizeLinks.map(({ banners, texts, name /* id */ }, index) => (
                    <div key={index} className={styles.rowWrapper}>
                        <Row gutter={[24, 16]} className={styles.row}>
                            <Col span={24}>
                                <span className={cn(styles.infoTitle, styles.campaignTitle)}>{name}</span>
                            </Col>
                            {associationGroupRows.map((row: Record<string, BundleRowsValueDto>) =>
                                Object.keys(row).map((key, idx) => (
                                    <Col span={12} key={idx}>
                                        {row[key].type === 'text' && (
                                            <>
                                                <div className={styles.infoTitle}>{row[key].label}</div>
                                                <div>{texts[key] || <i>{HEADER_EMPTY}</i>}</div>
                                            </>
                                        )}
                                        {['banner', 'logo'].includes(row[key].type) && (
                                            <>
                                                <div className={styles.infoTitle}>{row[key].label}</div>
                                                {!banners[key] ? (
                                                    <div>
                                                        <i>{BANNER_EMPTY}</i>
                                                    </div>
                                                ) : (
                                                    <ImagesBlock imgURL={banners[key]} />
                                                )}
                                            </>
                                        )}
                                    </Col>
                                ))
                            )}
                        </Row>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default RelatedFormInfo;
