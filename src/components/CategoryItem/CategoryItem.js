import React, { memo, useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { loadImageWithPromise } from '../../utils/helper';
import Button from '../Button/Button';
import SimpleDzoItem from '../DzoItem/SimpleDzoItem';
import droidSvg from '../../static/images/droid.svg';
import spinner from '../../static/images/loading-spinner.svg';
import styles from './CategoryItem.module.css';
import ButtonLabels from '../Button/ButtonLables';
import { UP, DOWN } from '../../constants/movementDirections';

const CategoryItem = (props) => {
    const { categoryId, categoryName, categoryDescription, categoryUrl, isActive, dzoList } = props;
    const [curUrl, setUrl] = useState(spinner);

    useEffect(() => {
        loadImageWithPromise(categoryUrl, droidSvg)
            .then(categoryUrl => { setUrl(categoryUrl); })
            .catch(failUrl => { setUrl(failUrl); });
    }, [categoryUrl]);


    const handleDelete = () => { props.handleDelete(categoryId); };
    const handleEdit = () => { props.handleEdit(categoryId, categoryName, categoryDescription, categoryUrl, isActive); };
    const handleMoveUp = () => { props.handleMove(categoryId, UP); };
    const handleMoveDown = () => { props.handleMove(categoryId, DOWN); };

    return (
        <div className={ styles.categoryItem }>
            <div className={ styles.imageWrapper } style={ { backgroundImage: `url(${curUrl})` } } />
            <div className={ styles.descrWrapper }>
                <div className={ styles.textFieldFormat }>
                    <p className={ styles.headerFormat }><b>Название: </b></p>
                    <p className={ styles.textFormat }>{ categoryName }</p>
                    <p className={ styles.headerFormat }><b>Описание: </b></p>
                    <p className={ styles.textFormat }>{ categoryDescription }</p>
                    <p className={ styles.headerFormat }><b>Активная: </b></p>
                    <p className={ styles.textFormat }>{ isActive.toString() }</p>
                    <span>
                        <p className={ styles.headerFormat }>
                            <b>dzoName(dzoCode):</b>
                        </p>
                        { dzoList != null ? dzoList.map( (dzo, i) =>
                            <SimpleDzoItem key={ `dzoItem-${i}` } { ...dzo } />
                        ): null }
                    </span>
                </div>
                <div className={ styles.categoryActions }>
                    <div>
                        <img src={ require('../../static/images/up-arrow.svg') }
                            onClick={ handleMoveUp }
                            alt={ ButtonLabels.MOVE_UP }
                            className={ styles.arrow_image }
                        />
                    </div>
                    <div>
                        <img src={ require('../../static/images/down-arrow.svg') }
                            onClick={ handleMoveDown }
                            alt={ ButtonLabels.MOVE_DOWN }
                            className={ styles.arrow_image }
                        />
                    </div>
                    <Button type="green" onClick={ handleEdit } label={ ButtonLabels.EDIT } />
                    <Button type="red" onClick={ handleDelete } label={ ButtonLabels.DELETE } />
                </div>
            </div>
        </div>
    );
};

CategoryItem.propTypes = {
    categoryId: PropTypes.number.isRequired,
    categoryName: PropTypes.string.isRequired,
    categoryDescription: PropTypes.string.isRequired,
    categoryUrl: PropTypes.string.isRequired,
    isActive: PropTypes.bool.isRequired,
    dzoList: PropTypes.array.isRequired,
    handleDelete: PropTypes.func.isRequired,
    handleEdit: PropTypes.func.isRequired
};

export default memo(CategoryItem);
