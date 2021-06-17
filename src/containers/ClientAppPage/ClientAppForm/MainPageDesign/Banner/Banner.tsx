import React, { useState } from 'react';
import noop from 'lodash/noop';
import { banners } from '../../ClientAppFormConstants';
import SettingPageModal from '../Modal/SettingPageModal';
import { getImage } from '../../utils';

import styles from './Banner.module.css';

export interface IBanner {
    vitrina_theme: string;
    gradient: string;
    design_elements: string[];
}

export type BannerProps = {
    value?: IBanner | '';
    onChange?: (value: IBanner) => void;
};

const Banner: React.FC<BannerProps> = ({ value = '', onChange = noop }) => {
    const [modalVisible, setModalVisible] = useState(false);

    const handleModalClick = () => {
        setModalVisible(!modalVisible);
    };

    const handleClick = (index: number) => {
        onChange(banners[index]);
        setModalVisible(false);
    };

    return (
        <div className={styles.imageBlock} onClick={handleModalClick}>
            {value && value.vitrina_theme && (
                <div className={styles.imageContainer}>
                    <img
                        className={styles.img}
                        style={{ background: `linear-gradient(${value.gradient})` }}
                        src={getImage(value.vitrina_theme)}
                        alt="banner"
                    />
                </div>
            )}
            <SettingPageModal
                visible={modalVisible}
                onClose={handleModalClick}
                banners={banners}
                handleClick={handleClick}
            />
        </div>
    );
};

export default Banner;
