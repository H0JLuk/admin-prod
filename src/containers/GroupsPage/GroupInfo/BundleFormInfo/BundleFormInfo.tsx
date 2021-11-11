import React from 'react';
import { History } from 'history';
import { normalizedLinksDto } from '../types';
import { BundleDto, BundleLink } from '@types';
import cn from 'classnames';
import { Row, Col, Button, Switch } from 'antd';
import { arrayToObject } from '@utils/helper';
import ImagesBlock from '@components/ImagesBlock';
import { BundleRowsDto, BundleRowsValueDto, BUNDLE_ROWS, groupBundleRows } from '../groupInfo.constants';
import { deleteCampaignGroup } from '@apiServices/campaignGroupService';
import { confirmModal, errorModal, successModal } from '@utils/utils';
import { BundleTypes, BUNDLE_LOCATION_KEY } from '../../groupPageConstants';
import { BANNER_TYPE, BUTTON_TEXT } from '@constants/common';

import styles from './BundleFormInfo.module.css';

export type BundleFormInfoProps = {
    matchPath: string;
    groupId: number;
    bundleData: BundleDto;
    history: History;
};

const DELETE_CONFIRMATION_MODAL_TITLE = 'Вы действительно хотите удалить Бандл';
const ERROR_DELETE = 'Ошибка удаления';
const OK_TEXT = 'ОК';
const BANNER_EMPTY = 'Баннер отсутствует';
const LOGO_EMPTY = 'Логотип отсутствует';
const EXTERNAL_ID_EMPTY = 'Внешний ID отсутствует';
const EXTERNAL_ID_LABEL = 'Внешний ID';

const STATUS = {
    ACTIVE: 'Бандл активен',
    INACTIVE: 'Бандл неактивен',
};

const BundleFormInfo: React.FC<BundleFormInfoProps> = ({ matchPath, history, bundleData, groupId }) => {

    const redirectToBundleList = () => history.push(matchPath);

    const { name, active, banners, links/*, texts */ } = bundleData;

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
        history.push(`${matchPath}/${groupId}/edit?type=${BundleTypes.IDEA.toLowerCase()}`, { [BUNDLE_LOCATION_KEY]: bundleData });
    };

    const onDelete = async () => {
        try {
            await deleteCampaignGroup(groupId);

            successModal({
                onOk: redirectToBundleList,
                title: (
                    <span>
                        Бандл <span className={styles.text}>{name}</span> успешно удален
                    </span>
                ),
                okText: OK_TEXT,
            });
        } catch (e: any) {
            errorModal({
                title: (
                    <span>
                        {ERROR_DELETE} {e?.message ? <span className={styles.text}>{e.message}</span> : ''}
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
                <div className={styles.headerInfo}>
                    <div className={styles.title}>{name}</div>
                    <div className={cn(styles.status, { [styles.redStatus]: !active })}>
                        {active ? STATUS.ACTIVE : STATUS.INACTIVE}
                    </div>
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
                <div className={styles.rowWrapper}>
                    <Row gutter={[24, 16]} className={styles.row}>
                        <Col span={12}>
                            {!banners.length ? (
                                <>
                                    <div className={styles.infoTitle}>
                                        {BUNDLE_ROWS[BANNER_TYPE.CARD].label}
                                    </div>
                                    <div>
                                        <i>{BANNER_EMPTY}</i>
                                    </div>
                                </>
                            ) : banners.map(({ url, type }) => (
                                <React.Fragment key={url}>
                                    <div className={styles.infoTitle}>{(BUNDLE_ROWS as BundleRowsDto)[type]?.label}</div>
                                    <ImagesBlock key={url} imgURL={url} />
                                </React.Fragment>
                            ))}
                        </Col>
                        <Col span={12}>
                            <div className={styles.infoTitle}>
                                {EXTERNAL_ID_LABEL}
                            </div>
                            <div className={styles.infoText}>
                                {bundleData.externalId || <i>{EXTERNAL_ID_EMPTY}</i>}
                            </div>
                        </Col>
                    </Row>
                </div>
                {normalizeLinks.map(({ banners, name, settings }, index) => (
                    <div key={index} className={styles.rowWrapper}>
                        <Row gutter={[24, 16]} className={styles.row}>
                            <Col span={12}>
                                <span className={cn(styles.infoTitle, styles.campaignTitle)}>{name}</span>
                            </Col>
                            <Col span={12}>
                                <div className={styles.infoTitle}>Отображать лого на баннере Бандла</div>
                                <div className={styles.infoText}>
                                    <Switch
                                        disabled
                                        checked={settings?.display_logo_on_bundle}
                                    />
                                </div>
                            </Col>
                            {groupBundleRows.map((row: Record<string, BundleRowsValueDto>) =>
                                Object.keys(row).map((key, idx) => (
                                    <Col span={12} key={idx}>
                                        {['banner', 'logo'].includes(row[key].type) && (
                                            <>
                                                <div className={styles.infoTitle}>{row[key].label}</div>
                                                {!banners[key] ? (
                                                    <div>
                                                        <i>{LOGO_EMPTY}</i>
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

export default BundleFormInfo;
