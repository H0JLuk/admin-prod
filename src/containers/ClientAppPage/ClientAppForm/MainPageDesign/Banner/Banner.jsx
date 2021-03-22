import React, { useState } from 'react';
import { banners } from '../../ClientAppFormConstants';
import SettingPageModal from '../Modal/SettingPageModal';
import { getImage } from '../../utils';

import styles from './Banner.module.css';

function Banner({ value = '', onChange }) {

    const [modalVisible, setModalVisible] = useState(false);

    const handleModalClick = () => {
        setModalVisible(!modalVisible);
    };

    const handleClick = (index) => {
        onChange(banners[index]);
        setModalVisible(false);
    };

    return (
        <div className={ styles.imageBlock } onClick={ handleModalClick }>
            { value.vitrina_theme && (
                <div className={ styles.imageContainer }>
                    <img
                        className={ styles.img }
                        style={ { background: `linear-gradient(${value.gradient})` } }
                        src={ getImage(value.vitrina_theme) }
                        alt='banner'
                    />
                </div>
            ) }
            <SettingPageModal
                visible={ modalVisible }
                onClose={ handleModalClick }
                banners={ banners }
                handleClick={ handleClick }
            />
        </div>
    );
}

export default Banner;
