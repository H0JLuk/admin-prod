import React, { memo, useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { loadImageWithPromise } from '../../utils/helper';
import Button from '../Button/Button';
import droidSvg from '../../static/images/droid.svg';
import spinner from '../../static/images/loading-spinner.svg';
import styles from './CategoryItem.module.css';
import ButtonLabels from '../Button/ButtonLables';
import { UP, DOWN } from '../../constants/movementDirections';

const CATEGORY_HEADER_LABEL = 'Заголовок: ';
const CATEGORY_DESCRIPTION_LABEL = 'Описание: ';
const CATEGORY_ACTIVE_LABEL = 'Активная: ';

const CategoryItem = ({
                          handleDelete, handleEdit, handleMove,
                          categoryId, categoryName, categoryDescription,
                          categoryUrl, active
}) => {
    const [curUrl, setUrl] = useState(spinner);

    useEffect(() => {
        loadImageWithPromise(categoryUrl, droidSvg)
            .then(setUrl)
            .catch(setUrl);
    }, [categoryUrl]);

    const onDeleteClick = () => handleDelete(categoryId);

    const onEditClick = () => handleEdit(categoryId, categoryName, categoryDescription ?? '', categoryUrl, active);

    const handleMoveUp = () => handleMove(categoryId, UP);

    const handleMoveDown = () => handleMove(categoryId, DOWN);

    return (
        <div className={ styles.categoryItem }>
            <div className={ styles.imageWrapper } style={ { backgroundImage: `url(${curUrl})` } } />
            <div className={ styles.content }>
                <div className={ styles.textFieldFormat }>
                    {generateField(CATEGORY_HEADER_LABEL, `"${categoryName}"`)}
                    {categoryDescription && generateField(CATEGORY_DESCRIPTION_LABEL, `"${categoryDescription}"`)}
                    {generateField(CATEGORY_ACTIVE_LABEL, active ? 'да' : 'нет')}
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
                    <Button type="green" onClick={ onEditClick } label={ ButtonLabels.EDIT } />
                    <Button type="red" onClick={ onDeleteClick } label={ ButtonLabels.DELETE } />
                </div>
            </div>
        </div>
    );
};

function generateField(label, value) {
    return (
        <p className={ styles.text }>
            <span className={ styles.bold }>{ label }</span>
            { value }
        </p>
    );
}

CategoryItem.propTypes = {
    categoryId: PropTypes.number.isRequired,
    categoryName: PropTypes.string.isRequired,
    categoryDescription: PropTypes.string,
    categoryUrl: PropTypes.string.isRequired,
    active: PropTypes.bool.isRequired,
    handleDelete: PropTypes.func.isRequired,
    handleEdit: PropTypes.func.isRequired
};

export default memo(CategoryItem);
