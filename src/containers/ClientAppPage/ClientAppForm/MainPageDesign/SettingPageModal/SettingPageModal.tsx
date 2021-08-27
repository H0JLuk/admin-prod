import React from 'react';
import { Image, Row, Modal } from 'antd';
import { getImage } from '../../utils';
import Themes from '@constants/themes';
import { banners } from '../../ClientAppFormConstants';

import styles from './SettingPageModal.module.css';
import bannerStyles from '../MainPageDesign.module.css';

interface ISettingPageModal{
    visible: boolean;
    onClose: () => void;
    handleClick: (index: Themes) => void;
}

const MODAL_TITLE = 'Выберите баннер';

const SettingPageModal: React.FC<ISettingPageModal> = ({ visible, onClose, handleClick }) => (
    <Modal
        visible={visible}
        title={MODAL_TITLE}
        className={styles.modal}
        onCancel={onClose}
        footer={false}
        width={600}
        centered
    >
        {banners.map((appTheme) => (
            <Row
                key={appTheme}
                className={styles.imageBlock}
                onClick={() => handleClick(appTheme)}
            >
                <Image
                    className={bannerStyles[appTheme]}
                    src={getImage(appTheme)}
                    preview={false}
                />
                <div className={styles.imageMask} />
            </Row>
        ))}
    </Modal>
);


export default SettingPageModal;
