import React, { memo, useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { loadImageWithPromise } from '../../utils/helper';
import Button from '../Button/Button';
import droidSvg from '../../static/images/droid.svg';
import spinner from '../../static/images/loading-spinner.svg';
import styles from './DzoItem.module.css';
import ButtonLabels from '../Button/ButtonLables';

const ADD_EDIT_APP_URL = 'Add/Edit App url';

const DzoItem = (props) => {
    const { dzoId, dzoName, screenUrl, logoUrl, header, description, cardUrl, dzoCode, webUrl, behaviorType, categoryList, applicationList } = props;
    const [curCardUrl, setCardUrl] = useState(spinner);
    const [curScreenUrl, setScreenUrl] = useState(spinner);
    const [curLogoUrl, setLogoUrl] = useState(spinner);

    useEffect(() => {
        loadImageWithPromise(cardUrl, droidSvg)
            .then(cardUrl => { setCardUrl(cardUrl); })
            .catch(failUrl => { setCardUrl(failUrl); });
    }, [cardUrl]);

    useEffect(() => {
        loadImageWithPromise(screenUrl, droidSvg)
            .then(screenUrl => { setScreenUrl(screenUrl); })
            .catch(failUrl => { setScreenUrl(failUrl); });
    }, [screenUrl]);

    useEffect(() => {
        loadImageWithPromise(logoUrl, droidSvg)
            .then(logoUrl => { setLogoUrl(logoUrl); })
            .catch(failUrl => { setLogoUrl(failUrl); });
    }, [logoUrl]);


    const handleDelete = () => { props.handleDelete(dzoId); };
    const handleEdit = () => { props.handleEdit(dzoId, dzoName, screenUrl, logoUrl, header, description, cardUrl, dzoCode, webUrl, behaviorType, categoryList); };
    const handleAddAppLink = () => {
        props.handleAddAppLink(dzoId, dzoName, applicationList);
    };

    return (
        <div className={ styles.dzoItem }>
            <div className={ styles.imagesGroupBlock }>
                <div className={ styles.imageBlockWrapper }>
                    <p align="center">Card image </p>
                    <div className={ styles.imageWrapper } style={ { backgroundImage: `url(${curCardUrl})` } } />
                    <hr />
                    <p align="center">Logo image</p>
                    <div className={ styles.imageWrapper } style={ { backgroundImage: `url(${curLogoUrl})` } } />
                </div>
                <div className={ styles.imageBlockWrapper }>
                    <p align="center">  Screen image </p>
                    <div className={ styles.screenImageWrapper } style={ { backgroundImage: `url(${curScreenUrl})` } } />
                </div>
            </div>
            <div className={ styles.descrWrapper }>
                <div className={ styles.textFieldFormat }>
                    <p className={ styles.headerFormat }><b>Название: </b></p>
                    <p className={ styles.textFormat }>{ dzoName }</p>
                    <p className={ styles.headerFormat }><b>Заголовок: </b></p>
                    <p className={ styles.textFormat }>{ header }</p>
                    <p className={ styles.headerFormat }><b>Описание: </b></p>
                    <p className={ styles.textFormat }>{ description }</p>
                    <p className={ styles.headerFormat }><b>Код: </b></p>
                    <p className={ styles.textFormat }>{ dzoCode }</p>
                    <p className={ styles.headerFormat }><b>webUrl: </b></p>
                    <p className={ styles.textFormat }>{ webUrl }</p>
                    <p className={ styles.headerFormat }><b>Тип поведения: </b></p>
                    <p className={ styles.textFormat }>{ behaviorType }</p>
                </div>
                <div className={ styles.dzoActions }>
                    <Button type="green" onClick={ handleAddAppLink } label={ ADD_EDIT_APP_URL } />
                    <Button type="green" onClick={ handleEdit } label={ ButtonLabels.EDIT } />
                    <Button type="red" onClick={ handleDelete } label={ ButtonLabels.DELETE } />
                </div>
            </div>
        </div>
    );
};

DzoItem.propTypes = {

    dzoId: PropTypes.number.isRequired,
    dzoName: PropTypes.string.isRequired,
    dzoPresentationUrl: PropTypes.string,
    screenUrl: PropTypes.string,
    logoUrl: PropTypes.string,
    header: PropTypes.string,
    description: PropTypes.string,
    cardUrl: PropTypes.string,
    dzoCode: PropTypes.string.isRequired,
    webUrl: PropTypes.string,
    behaviorType: PropTypes.string.isRequired,
    categoryList: PropTypes.array.isRequired,
    applicationList: PropTypes.array,
};

export default memo(DzoItem);
