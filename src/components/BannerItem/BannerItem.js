import React, { memo, useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { loadImageWithPromise } from '../../utils/helper';
import Button from '../Button/Button';
import droidSvg from '../../static/images/droid.svg';
import spinner from '../../static/images/loading-spinner.svg';
import styles from './BannerItem.module.css';
import ButtonLabels from '../Button/ButtonLables';

const BannerItem = (props) => {
    const { bannerId, dzoId, bannerUrl, dzoName } = props;
    const [url, setUrl] = useState(spinner);
    useEffect(() => {
        loadImageWithPromise(bannerUrl, droidSvg)
            .then(setUrl)
            .catch(setUrl);
    }, [bannerUrl]);


    const handleDelete = () => { props.handleDelete(bannerId); };
    const handleEdit = () => { props.handleEdit(bannerId, dzoId, bannerUrl); };

    return (
        <div className={ styles.bannerItem }>
            <div className={ styles.imageWrapper } style={ { backgroundImage: `url(${ url })` } } />
            <div className={ styles.descrWrapper }>
                <div className={ styles.fieldsWrapper }>
                    <p><b>ДЗО:</b>{ ` "${ dzoName }"` }</p>
                </div>
                <div className={ styles.bannerActions }>
                    <Button type="green" onClick={ handleEdit } label={ ButtonLabels.EDIT } />
                    <Button type="red" onClick={ handleDelete } label={ ButtonLabels.DELETE } />
                </div>
            </div>
        </div>
    );
};

BannerItem.propTypes = {
    bannerId: PropTypes.number.isRequired,
    dzoId: PropTypes.number.isRequired,
    dzoName: PropTypes.string.isRequired,
    bannerUrl: PropTypes.string.isRequired,
    handleDelete: PropTypes.func.isRequired,
    handleEdit: PropTypes.func.isRequired
};

export default memo(BannerItem);
