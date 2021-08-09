import React, { memo, useState, useEffect } from 'react';
import { loadImageWithPromise } from '@utils/helper';
import PropTypes from 'prop-types';
import { Button } from 'antd';
import droidSvg from '@imgs/droid.svg';
import spinner from '@imgs/loading-spinner.svg';
import styles from './LandingItem.module.css';
import { movementDirections } from '@constants/movementDirections';
import { PresentationDto } from '@types';
import { BUTTON_TEXT } from '@constants/common';

type ILandingItemProps = PresentationDto & {
    handleDelete: (landingId: number) => void;
    handleEdit: (landingId: number, header: string, description: string, imageUrl: string) => void;
    handleMove: (landingId: number, direction: movementDirections) => void;
};

export const LandingItem: React.FC<ILandingItemProps> = (props) => {
    const { landingId, header, description, imageUrl } = props;
    const [url, setUrl] = useState(spinner);

    useEffect(() => {
        loadImageWithPromise(imageUrl, droidSvg)
            .then(setUrl)
            .catch(setUrl);
    }, [imageUrl]);


    const handleDelete = () => props.handleDelete(landingId);
    const handleEdit = () => props.handleEdit(landingId, header, description, imageUrl);
    const handleMoveUp = () => props.handleMove(landingId, movementDirections.UP);
    const handleMoveDown = () => props.handleMove(landingId, movementDirections.DOWN);

    return (
        <div className={styles.landingItem}>
            <div className={styles.imageWrapper} style={{ backgroundImage: `url(${ url })` }} />
            <div className={styles.descrWrapper}>
                <div className={styles.textFieldFormat}>
                    <p className={styles.headerFormat}><b>Заголовок:</b></p>
                    <p className={styles.textFormat}>{header}</p>
                    <p className={styles.headerFormat}><b>Описание:</b></p>
                    <p className={styles.textFormat}>{description}</p>
                </div>
                <div className={styles.landingActions}>
                    <div>
                        <img src={require('../../static/images/up-arrow.svg')}
                            onClick={handleMoveUp}
                            alt={BUTTON_TEXT.MOVE_UP}
                            className={styles.arrow_image}
                        />
                    </div>
                    <div>
                        <img src={require('../../static/images/down-arrow.svg')}
                            onClick={handleMoveDown}
                            alt={BUTTON_TEXT.MOVE_DOWN}
                            className={styles.arrow_image}
                        />
                    </div>
                    <Button
                        type="primary"
                        onClick={handleEdit}
                    >
                        {BUTTON_TEXT.CHANGE}
                    </Button>
                    <Button
                        type="primary"
                        onClick={handleDelete}
                        danger
                    >
                        {BUTTON_TEXT.DELETE}
                    </Button>
                </div>
            </div>
        </div>
    );
};

LandingItem.propTypes = {
    landingId: PropTypes.number.isRequired,
    header: PropTypes.string.isRequired,
    description: PropTypes.string.isRequired,
    imageUrl: PropTypes.string.isRequired,
    handleDelete: PropTypes.func.isRequired,
    handleEdit: PropTypes.func.isRequired,
    handleMove: PropTypes.func.isRequired,
};

export default memo(LandingItem);
