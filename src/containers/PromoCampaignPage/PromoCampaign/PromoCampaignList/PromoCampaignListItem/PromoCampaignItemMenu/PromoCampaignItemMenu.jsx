import React, { useCallback, useState } from 'react';
import { generatePath, Link } from 'react-router-dom';
import { Menu, Dropdown, notification } from 'antd';
import { EllipsisOutlined } from '@ant-design/icons';
import PromoCodeStatisticModal from './PromoCampaignModalMenu/PromoCodeStatisticModal';
import { errorNotice } from '../../../../../../components/toast/Notice';
import UploadPromoCodesModal from './PromoCampaignModalMenu/UploadPromoCodesModal';
import { uploadPromoCodes } from '../../../../../../api/services/promoCampaignService';
import { PROMO_CAMPAIGN_PAGES } from '../../../../../../constants/route';
import { confirmModal } from '../../../../../../utils/utils';
import { getDeleteTitleConfirm, onConfirmDeletePromoCampaign } from '../../../../PromoCampaignUtils';

import styles from './PromoCampaignItemMenu.module.css';

const ON_PROMO_CODES_LOADED = 'Промокоды успешно загружены';

const showSuccessNotification = (message) => {
    notification.success({
        duration: 0,
        message,
        placement: 'bottomRight',
    });
};

const PromoCampaignItemMenu = ({ onDeleteItem, promoCampaign, matchUrl }) => {
    const [dropdownVisible, setDropdownVisible] = useState(false);
    const [showModalStatistic, setShowModalStatistic] = useState(false);
    const [showPromoCodesModal, setShowPromoCodesModal] = useState(false);

    const onConfirmDelete = useCallback(async () => {
        try {
            await onConfirmDeletePromoCampaign(promoCampaign.id, promoCampaign.name);
            onDeleteItem();
        } catch (err) {
            console.warn(err);
        }
    }, [promoCampaign.id, promoCampaign.name, onDeleteItem]);

    const onDeleteClick = useCallback(() => {
        confirmModal({
            onOk: onConfirmDelete,
            title: getDeleteTitleConfirm(promoCampaign.name),
        });

        setDropdownVisible(false);
    }, [promoCampaign.name, onConfirmDelete]);

    const onShowStatistic = useCallback((e) => {
        e.stopPropagation();
        setShowModalStatistic(true);
        setDropdownVisible(false);
    }, []);

    const onHideStatistic = useCallback(() => {
        setShowModalStatistic(false);
    }, []);

    const onPromoCodeUpload = useCallback((e) => {
        e.stopPropagation();
        setShowPromoCodesModal(true);
        setDropdownVisible(false);
    }, []);

    const closeUploadPromoCodesModal = useCallback(() => {
        setShowPromoCodesModal(false);
    }, []);

    const promoCodeUpload = useCallback((data) => {
        uploadPromoCodes(promoCampaign.id, data)
            .then(() => closeUploadPromoCodesModal())
            .then(() => showSuccessNotification(ON_PROMO_CODES_LOADED))
            .catch(error => errorNotice(error.message));
    }, [closeUploadPromoCodesModal, promoCampaign.id]);


    return (
        <>
            <Dropdown
                className={ styles.dropdown }
                overlayClassName={ styles.dropdownMenu }
                overlay={
                    <DropdownMenu
                        promoCampaign={ promoCampaign }
                        onDelete={ onDeleteClick }
                        onShowStatistic={ onShowStatistic }
                        onPromoCodeUpload={ onPromoCodeUpload }
                        matchUrl={ matchUrl }
                    />
                }
                trigger={ ['click'] }
                visible={ dropdownVisible }
                onVisibleChange={ setDropdownVisible }
            >
                <div className={ styles.menuButton }>
                    <EllipsisOutlined />
                </div>
            </Dropdown>
            <PromoCodeStatisticModal
                open={ showModalStatistic }
                onClose={ onHideStatistic }
                { ...promoCampaign }
            />
            <UploadPromoCodesModal
                open={ showPromoCodesModal }
                onClose={ closeUploadPromoCodesModal }
                onSave={ promoCodeUpload }
            />
        </>
    );
};


export default PromoCampaignItemMenu;


const MENU = {
    LOAD_PROMO_CODE: 'Загрузить промо-коды',
    STATISTICS: 'Статистика использования промо-кодов',
    VISIBILITY_SETTINGS: 'Настроить видимость промо-кампании',
    EDIT_PROMO_CAMPAIGN: 'Редактировать промо-кампанию',
    DELETE: 'Удалить',
};

const DropdownMenu = ({
    onDelete,
    promoCampaign,
    matchUrl,
    onShowStatistic,
    onPromoCodeUpload,
}) => (
    <Menu>
        <Menu.Item key="0">
            <div className={ styles.menuItem } onClick={ onPromoCodeUpload }>
                { MENU.LOAD_PROMO_CODE}
            </div>
        </Menu.Item>
        <Menu.Item key="1" >
            <div className={ styles.menuItem } onClick={ onShowStatistic }>
                { MENU.STATISTICS }
            </div>
        </Menu.Item>
        <Menu.Item key="2">
            <Link
                to={ generatePath(
                    `${ matchUrl }${PROMO_CAMPAIGN_PAGES.VISIBILITY_SETTINGS}`,
                    { promoCampaignId: promoCampaign.id }
                ) }
            >
                { MENU.VISIBILITY_SETTINGS }
            </Link>
        </Menu.Item>
        <Menu.Item key="3">
            <Link
                to={ {
                    pathname: generatePath(
                        `${ matchUrl }${PROMO_CAMPAIGN_PAGES.PROMO_CAMPAIGN_EDIT}`,
                        { promoCampaignId: promoCampaign.id }
                    ),
                    state: { promoCampaign },
                } }
            >
                { MENU.EDIT_PROMO_CAMPAIGN }
            </Link>
        </Menu.Item>
        <Menu.Item key="4">
            <div className={ styles.menuItem } onClick={ onDelete }>
                { MENU.DELETE }
            </div>
        </Menu.Item>
    </Menu>
);
