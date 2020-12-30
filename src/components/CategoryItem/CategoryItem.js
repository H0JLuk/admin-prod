import React, { memo, useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import cn from 'classnames';
import { loadImageWithPromise } from '../../utils/helper';
import droidSvg from '../../static/images/droid.svg';
import spinner from '../../static/images/loading-spinner.svg';
import { Button } from 'antd';
import Field from '../Field/Field';
import styles from './CategoryItem.module.css';
import ButtonLabels from '../Button/ButtonLables';
import { UP, DOWN } from '../../constants/movementDirections';

const CATEGORY_HEADER_LABEL = 'Заголовок: ';
const CATEGORY_DESCRIPTION_LABEL = 'Описание: ';

const CategoryItem = ({
                          handleDelete, handleEdit, handleMove,
                          categoryId: id, categoryName: name,
                          categoryDescription: description,
                          categoryUrl: imageUrl, active
}) => {
    const [curUrl, setUrl] = useState(spinner);

    useEffect(() => {
        loadImageWithPromise(imageUrl, droidSvg)
            .then(setUrl)
            .catch(setUrl);
    }, [imageUrl]);

    const onDeleteClick = () => handleDelete(id);

    const onEditClick = () => handleEdit(id, name, description ?? '', imageUrl, active);

    const handleMoveUp = () => handleMove(id, UP);

    const handleMoveDown = () => handleMove(id, DOWN);

    return (
        <div className={ styles.categoryItem }>
            <div className={ styles.imageWrapper } style={ { backgroundImage: `url(${curUrl})` } } />
            <div className={ styles.content }>
                <div className={ styles.textFieldFormat }>
                    <Field label={ CATEGORY_HEADER_LABEL } value={ `"${name}"` } />
                    {description && <Field label={ CATEGORY_DESCRIPTION_LABEL } value={ `"${description}"` } />}
                    <p className={ cn(styles.fieldActive, { [styles.red]: !active }) }>
                        { active ? 'Активная' : 'Неактивная' }
                    </p>
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
                    <Button type="primary" onClick={ onEditClick }>
                        { ButtonLabels.EDIT }
                    </Button>
                    <Button type="danger" onClick={ onDeleteClick }>
                        { ButtonLabels.DELETE }
                    </Button>
                </div>
            </div>
        </div>
    );
};

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
