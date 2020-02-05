import React, { memo, useState, useEffect } from 'react'
import PropTypes from 'prop-types'
import { loadImageWithPromise } from '../../utils/helper'
import Button from '../Button/Button'
import droidSvg from '../../static/images/droid.svg'
import spinner from '../../static/images/loading-spinner.svg'
import styles from './BannerItem.module.css'


const BANNER_DELETE = 'Удалить';
const BANNER_EDIT = 'Изменить';

const BannerItem = (props) => {
    const { dzoId, bannerId, bannerUrl } = props
    const [url, setUrl] = useState(spinner)

    useEffect(() => {
        loadImageWithPromise(bannerUrl, droidSvg)
            .then(url => { setUrl(url) })
            .catch(failUrl => { setUrl(failUrl) })
    }, [bannerUrl])


    const handleDelete = () => { props.handleDelete(bannerId) }
    const handleEdit = () => { props.handleEdit(bannerId) }

    return (
        <div className={styles.bannerItem}>
            <div className={styles.imageWrapper} style={ { backgroundImage: `url(${url})` } } />
            <div className={styles.descrWrapper}>
                <div className={styles.fieldsWrapper}>
                    <p>dzoId: {dzoId}</p>
                    <p>bannerId: {bannerId}</p>
                </div>
                <div className={styles.bannerActions}>
                    <Button type="green" onClick={handleEdit} label={BANNER_EDIT} />
                    <Button type="red" onClick={handleDelete} label={BANNER_DELETE} />
                </div>
            </div>
        </div>
    )
}

BannerItem.propTypes = {
    dzoId: PropTypes.number.isRequired,
    bannerId: PropTypes.number.isRequired,
    bannerUrl: PropTypes.string.isRequired,
    handleDelete: PropTypes.func.isRequired,
    handleEdit: PropTypes.func.isRequired
}

export default memo(BannerItem);
