import React from 'react';
import cn from 'classnames';
import { Row, Col, Button } from 'antd';
import ImagesBlock from '../../../../components/ImagesBlock/ImagesBlock';
import { arrayToObject } from '../../GroupForms/groupForm.utils';
import { associationGroupRows } from '../groupInfo.constants';
import { confirmModal, errorModal, successModal } from '../../../../utils/utils';
import { deleteCampaignGroup } from '../../../../api/services/campaignGroupService';
import { BUNDLE_LOCATION_KEY, BUNDLE_TYPE } from '../../groupPageConstants';

import styles from './RelatedFormInfo.module.css';

const EDIT = 'Редактировать';
const DELETE = 'Удалить';
const DELETE_CONFIRMATION_MODAL_TITLE = 'Вы действительно хотите удалить связанную кампанию';
const ERROR_DELETE = 'Ошибка удаления';
const OK_TEXT = 'ОК';
const BANNER_EMPTY = 'Логотип отсутствует';
const HEADER_EMPTY = 'Заголовок отсутствует';

const RelatedFormInfo = ({ matchPath, history, groupId, bundleData }) => {
    const redirectToBundleList = () => history.push(matchPath);

    const { name, links } = bundleData;

    const normalizeLinks = links.reduce((prev, { banners, texts, ...rest }) => [
        ...prev,
        {
            banners: { ...arrayToObject(banners, 'type', 'url') },
            texts: { ...arrayToObject(texts, 'type', 'value') },
            ...rest,
        },
    ], []);

    const handleEdit = () => {
        history.push(`${matchPath}/${groupId}/edit?type=${BUNDLE_TYPE.ASSOCIATION}`, {
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
                        Связанная кампания <span className={ styles.text }>{ name }</span> успешно удалена
                    </span>
                ),
                okText: OK_TEXT,
            });
        } catch (e) {
            errorModal({
                title: (
                    <span>
                        { ERROR_DELETE } <span className={ styles.text }>{ e.message }</span>
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
                    { DELETE_CONFIRMATION_MODAL_TITLE } <span className={ styles.text }>{ `${name}?` }</span>
                </span>
            ),
            okText: DELETE,
            onOk: onDelete,
            okButtonProps: { danger: true },
        });
    };

    return (
        <div>
            <div className={ styles.headerActions }>
                <div>
                    <div className={ styles.title }>{ name }</div>
                </div>
                <div className={ styles.buttonBlock }>
                    <Button type="primary" onClick={ handleEdit }>
                        { EDIT }
                    </Button>
                    <Button type="primary" danger onClick={ onDeleteClick }>
                        { DELETE }
                    </Button>
                </div>
            </div>
            <div className={ styles.wrapper }>
                { normalizeLinks.map(({ banners, texts, name /* id */ }, index) => (
                    <div key={ index } className={ styles.rowWrapper }>
                        <Row gutter={ [24, 16] } className={ styles.row }>
                            <Col span={ 24 }>
                                <span className={ cn(styles.infoTitle, styles.campaignTitle) }>{ name }</span>
                            </Col>
                            { associationGroupRows.map((row) =>
                                Object.keys(row).map((key, index) => (
                                    <Col span={ 12 } key={ index }>
                                        { row[key].type === 'text' && (
                                            <>
                                                <div className={ styles.infoTitle }>{ row[key].label }</div>
                                                <div>{ texts[key] || <i>{ HEADER_EMPTY }</i> }</div>
                                            </>
                                        ) }
                                        { ['banner', 'logo'].includes(row[key].type) && (
                                            <>
                                                <div className={ styles.infoTitle }>{ row[key].label }</div>
                                                { !banners[key] ? (
                                                    <div>
                                                        <i>{ BANNER_EMPTY }</i>
                                                    </div>
                                                ) : (
                                                    <ImagesBlock imgURL={ banners[key] } />
                                                ) }
                                            </>
                                        ) }
                                    </Col>
                                ))
                            ) }
                        </Row>
                    </div>
                )) }
            </div>
        </div>
    );
};

export default RelatedFormInfo;