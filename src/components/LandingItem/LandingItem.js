import React, { memo, useState, useEffect } from 'react'
import PropTypes from 'prop-types'
import { loadImageWithPromise } from '../../utils/helper'
import Button from '../Button/Button'
import droidSvg from '../../static/images/droid.svg'
import spinner from '../../static/images/loading-spinner.svg'
import styles from './LandingItem.module.css'


const LANDING_DELETE = 'Удалить';
const LANDING_EDIT = 'Изменить';
const MOVE_UP = 'Переместить вверх'
const MOVE_DOWN = 'Переместить вниз'
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
                <div className={styles.fieldsWrapper}>
                    <p><b>Landing ID:</b> {landingId}</p>
                    <br/>
                    <p><b>Header:</b> <br/>{header}</p>
                    <br/>
                    <p><b>Description:</b> <br/>{description}</p>
                    <br/>
                    {/*<p><b>url:</b> <br/>{url}</p>*/}
                    {/*<br/>*/}
                </div>
                <div className={styles.landingActions}>
                    <div> <img src={require('../../static/images/up-arrow.svg')} onClick={handleMoveUp} alt={MOVE_UP} className={styles.arrow_image}/> </div>
                    <div> <img src={require('../../static/images/down-arrow.svg')} onClick={handleMoveDown} alt={MOVE_DOWN} className={styles.arrow_image}/> </div>
                    <Button type="green" onClick={handleEdit} label={LANDING_EDIT} />
                    <Button type="red" onClick={handleDelete} label={LANDING_DELETE} />
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
