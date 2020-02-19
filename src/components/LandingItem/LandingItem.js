import React, { memo, useState, useEffect } from 'react'
import PropTypes from 'prop-types'
import { loadImageWithPromise } from '../../utils/helper'
import Button from '../Button/Button'
import droidSvg from '../../static/images/droid.svg'
import spinner from '../../static/images/loading-spinner.svg'
import styles from './LandingItem.module.css'
import { DELETE, EDIT, MOVE_UP, MOVE_DOWN} from '../Button/ButtonLables'

export const UP = -1;
export const DOWN = 1;

export const LandingItem = (props) => {
    const { landingId, header, description, imageUrl } = props
    const [url, setUrl] = useState(spinner)

    useEffect(() => {
        loadImageWithPromise(imageUrl, droidSvg)
            .then(url => { setUrl(url) })
            .catch(failUrl => { setUrl(failUrl) })
    }, [imageUrl])


    const handleDelete = () => { props.handleDelete(landingId) }
    const handleEdit = () => { props.handleEdit(landingId, header, description, imageUrl) }
    const handleMoveUp = () => { props.handleMove(landingId, UP) }
    const handleMoveDown = () => { props.handleMove(landingId, DOWN) }

    return (
        <div className={styles.landingItem}>
            <div className={styles.imageWrapper} style={ { backgroundImage: `url(${url})` } } />
            <div className={styles.descrWrapper}>
                <div className={styles.textFieldFormat}>
                    <p className={styles.headerFormat}><b>Заголовок:</b></p>
                    <p className={styles.textFormat}>{header}</p>
                    <p className={styles.headerFormat}><b>Описание:</b></p>
                    <p className={styles.textFormat}>{description}</p>
                </div>
                <div className={styles.landingActions}>
                    <div> <img src={require('../../static/images/up-arrow.svg')} onClick={handleMoveUp} alt={MOVE_UP} className={styles.arrow_image}/> </div>
                    <div> <img src={require('../../static/images/down-arrow.svg')} onClick={handleMoveDown} alt={MOVE_DOWN} className={styles.arrow_image}/> </div>
                    <Button type="green" onClick={handleEdit} label={EDIT} />
                    <Button type="red" onClick={handleDelete} label={DELETE} />
                </div>
            </div>
        </div>
    )
}

LandingItem.propTypes = {
    landingId: PropTypes.number.isRequired,
    header: PropTypes.string.isRequired,
    description: PropTypes.string.isRequired,
    imageUrl: PropTypes.string.isRequired,
    handleDelete: PropTypes.func.isRequired,
    handleEdit: PropTypes.func.isRequired,
    handleMove: PropTypes.func.isRequired,

}

export default memo(LandingItem);
