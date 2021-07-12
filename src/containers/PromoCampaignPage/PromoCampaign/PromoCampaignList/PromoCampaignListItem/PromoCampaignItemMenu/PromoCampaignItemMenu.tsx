import React, { useCallback, useState } from 'react';
import { generatePath, Link } from 'react-router-dom';
import { Menu, Dropdown } from 'antd';
import { EllipsisOutlined } from '@ant-design/icons';
import PromoCodeStatisticModal from './PromoCampaignModalMenu/PromoCodeStatisticModal';
import { errorNotice } from '@components/toast/Notice';
import UploadPromoCodesModal from './PromoCampaignModalMenu';
import PromoCampaignCopyModal from '../../../PromoCampaignCopyModal';
import { uploadPromoCodes } from '@apiServices/promoCampaignService';
import { PROMO_CAMPAIGN_PAGES } from '@constants/route';
import { confirmModal } from '@utils/utils';
import { getDeleteTitleConfirm, onConfirmDeletePromoCampaign } from '../../../../PromoCampaignUtils';
import { PromoCampaignDto } from '@types';
import { customNotifications } from '@utils/notifications';
import { BUTTON_TEXT } from '@constants/common';

import styles from './PromoCampaignItemMenu.module.css';

const ON_PROMO_CODES_LOADED = 'Промокоды успешно загружены';
const NONE_PROMO_CODES = 'NONE';

const showSuccessNotification = (message: React.ReactNode) => {
    customNotifications.success({ message });
};

type PromoCampaignItemMenuProps = {
    onDeleteItem: () => void;
    promoCampaign: PromoCampaignDto;
    matchUrl: string;
};

interface DropdownMenuProps extends Omit<PromoCampaignItemMenuProps, 'onDeleteItem'> {
    onDelete: () => void;
    onShowStatistic: () => void;
    onPromoCodeUpload: () => void;
    closeDropdown: () => void;
}

const PromoCampaignItemMenu: React.FC<PromoCampaignItemMenuProps> = ({ onDeleteItem, promoCampaign, matchUrl }) => {
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

    const closeDropdown = useCallback(() => setDropdownVisible(false), []);

    const onDeleteClick = useCallback(() => {
        confirmModal({
            onOk: onConfirmDelete,
            title: getDeleteTitleConfirm(promoCampaign.name),
        });
    }, [promoCampaign.name, onConfirmDelete]);

    const onShowStatistic = useCallback(() => {
        setShowModalStatistic(true);
    }, []);

    const onHideStatistic = useCallback(() => {
        setShowModalStatistic(false);
    }, []);

    const onPromoCodeUpload = useCallback(() => {
        setShowPromoCodesModal(true);
    }, []);

    const closeUploadPromoCodesModal = useCallback(() => {
        setShowPromoCodesModal(false);
    }, []);

    const promoCodeUpload = useCallback(async (data) => {
        try {
            await uploadPromoCodes(promoCampaign.id, data);
            closeUploadPromoCodesModal();
            showSuccessNotification(ON_PROMO_CODES_LOADED);
        } catch (error) {
            errorNotice(error.message);
        }
    }, [closeUploadPromoCodesModal, promoCampaign.id]);

    return (
        <>
            <Dropdown
                className={styles.dropdown}
                overlayClassName={styles.dropdownMenu}
                overlay={
                    <DropdownMenu
                        promoCampaign={promoCampaign}
                        onDelete={onDeleteClick}
                        onShowStatistic={onShowStatistic}
                        onPromoCodeUpload={onPromoCodeUpload}
                        matchUrl={matchUrl}
                        closeDropdown={closeDropdown}
                    />
                }
                trigger={['click']}
                visible={dropdownVisible}
                onVisibleChange={setDropdownVisible}
            >
                <div className={styles.menuButton}>
                    <EllipsisOutlined />
                </div>
            </Dropdown>
            <PromoCodeStatisticModal
                open={showModalStatistic}
                onClose={onHideStatistic}
                {...promoCampaign}
            />
            <UploadPromoCodesModal
                open={showPromoCodesModal}
                onClose={closeUploadPromoCodesModal}
                onSave={promoCodeUpload}
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
    COPY_PROMO: 'Копировать промо-кампанию',
    DELETE: BUTTON_TEXT.DELETE,
};

const DropdownMenu: React.FC<DropdownMenuProps> = ({
    onDelete,
    promoCampaign,
    matchUrl,
    onShowStatistic,
    onPromoCodeUpload,
    closeDropdown,
}) => (
    <Menu onClick={closeDropdown}>
        {promoCampaign.promoCodeType !== NONE_PROMO_CODES && (
            <>
                <Menu.Item key="0">
                    <div className={styles.menuItem} onClick={onPromoCodeUpload}>
                        {MENU.LOAD_PROMO_CODE}
                    </div>
                </Menu.Item>
                <Menu.Item key="1">
                    <div className={styles.menuItem} onClick={onShowStatistic}>
                        {MENU.STATISTICS}
                    </div>
                </Menu.Item>
            </>
        )}
        <Menu.Item key="2">
            <Link
                to={generatePath(
                    `${ matchUrl }${PROMO_CAMPAIGN_PAGES.VISIBILITY_SETTINGS}`,
                    { promoCampaignId: promoCampaign.id },
                )}
            >
                {MENU.VISIBILITY_SETTINGS}
            </Link>
        </Menu.Item>
        <Menu.Item key="3">
            <Link
                to={{
                    pathname: generatePath(
                        `${ matchUrl }${PROMO_CAMPAIGN_PAGES.PROMO_CAMPAIGN_EDIT}`,
                        { promoCampaignId: promoCampaign.id },
                    ),
                    state: { promoCampaign },
                }}
            >
                {MENU.EDIT_PROMO_CAMPAIGN}
            </Link>
        </Menu.Item>
        <Menu.Item key="copyPromoCampaign">
            <PromoCampaignCopyModal promoCampaignData={promoCampaign}>
                <div className={styles.menuItem}>
                    {MENU.COPY_PROMO}
                </div>
            </PromoCampaignCopyModal>
        </Menu.Item>
        <Menu.Item key="4">
            <div className={styles.menuItem} onClick={onDelete}>
                {MENU.DELETE}
            </div>
        </Menu.Item>
    </Menu>
);
