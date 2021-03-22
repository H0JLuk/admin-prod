import React from 'react';
import { Image, Row, Modal } from 'antd';
import { getImage } from '../../utils';

import styles from './SettingPageModal.module.css';

const MODAL_OK = 'Сохранить';
const MODAL_CANCEL = 'Отменить';
const MODAL_TITLE = 'Выберите баннер';

const SettingPageModal = ({ visible, onClose, banners, handleClick }) => {

    return (
        <Modal
            visible={ visible }
            okText={ MODAL_OK }
            cancelText={ MODAL_CANCEL }
            title={ MODAL_TITLE }
            onCancel={ onClose }
            bodyStyle={ { maxHeight: 600, overflowY: 'auto' } }
            footer={ false }
            width={ 600 }
            centered
        >
            { banners.map(({ vitrina_theme, gradient }, index) => (
                <Row
                    key={ index.toString() }
                    className={ styles.imageBlock }
                    onClick={ () => handleClick(index) }
                >
                    <Image
                        src={ getImage(vitrina_theme) }
                        preview={ false }
                        style={ { background: `linear-gradient(${gradient})` } }
                    />
                    <div className={ styles.imageMask }></div>
                </Row>
            )) }
        </Modal>
    );
};

export default SettingPageModal;
