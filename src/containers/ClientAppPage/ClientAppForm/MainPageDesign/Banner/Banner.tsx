import React, { useState } from 'react';
import cn from 'classnames';
import noop from 'lodash/noop';
import SettingPageModal from '../SettingPageModal';
import { getImage } from '../../utils';
import Themes from '@constants/themes';

import styles from './Banner.module.css';
import bannerStyles from '../MainPageDesign.module.css';

export type BannerProps = {
    value?: Themes;
    onChange?: (value: Themes) => void;
};

const Banner: React.FC<BannerProps> = ({ value = Themes.DEFAULT, onChange = noop }) => {
    const [modalVisible, setModalVisible] = useState(false);

    const handleModalClick = () => {
        setModalVisible(!modalVisible);
    };

    const handleClick = (theme: Themes) => {
        onChange(theme);
        setModalVisible(false);
    };

    return (
        <div className={styles.imageBlock} onClick={handleModalClick}>
            <div className={styles.imageContainer}>
                <img
                    className={cn(styles.img, bannerStyles[value])}
                    src={getImage(value)}
                    alt="banner"
                />
            </div>
            <SettingPageModal
                visible={modalVisible}
                onClose={handleModalClick}
                handleClick={handleClick}
            />
        </div>
    );
};

export default Banner;
