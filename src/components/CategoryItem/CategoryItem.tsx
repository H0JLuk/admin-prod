import React, { memo, useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import cn from 'classnames';
import { loadImageWithPromise } from '@utils/helper';
import droidSvg from '@imgs/droid.svg';
import spinner from '@imgs/loading-spinner.svg';
import { Button } from 'antd';
import Field from '../Field';
import styles from './CategoryItem.module.css';
import ButtonLabels from '../Button/ButtonLables';
import { movementDirections } from '@constants/movementDirections';
import { CategoryDto } from '@types';

const CATEGORY_HEADER_LABEL = 'Заголовок: ';

type CategoryItemProps = CategoryDto & {
    handleDelete: (id: number) => void;
    handleEdit: (id: number, name: string, imgUrl: string, active: boolean) => void;
    handleMove: (id: number, direction: movementDirections) => void;
};

const CategoryItem: React.FC<CategoryItemProps> = ({
    handleDelete,
    handleEdit,
    handleMove,
    categoryId: id,
    categoryName: name,
    categoryUrl: imageUrl,
    active,
}) => {
    const [curUrl, setUrl] = useState(spinner);

    useEffect(() => {
        loadImageWithPromise(imageUrl || '', droidSvg)
            .then(setUrl)
            .catch(setUrl);
    }, [imageUrl]);

    const onDeleteClick = () => handleDelete(id);

    const onEditClick = () => handleEdit(id, name, imageUrl || '', active);

    const handleMoveUp = () => handleMove(id, movementDirections.UP);

    const handleMoveDown = () => handleMove(id, movementDirections.DOWN);

    return (
        <div className={styles.categoryItem}>
            <div className={styles.imageWrapper} style={{ backgroundImage: `url(${curUrl})` }} />
            <div className={styles.content}>
                <div className={styles.textFieldFormat}>
                    <Field label={CATEGORY_HEADER_LABEL} value={`"${name}"`} />
                    <p className={cn(styles.fieldActive, { [styles.red]: !active })}>
                        {active ? 'Активная' : 'Неактивная'}
                    </p>
                </div>
                <div className={styles.categoryActions}>
                    <div>
                        <img src={require('../../static/images/up-arrow.svg')}
                            onClick={handleMoveUp}
                            alt={ButtonLabels.MOVE_UP}
                            className={styles.arrow_image}
                        />
                    </div>
                    <div>
                        <img src={require('../../static/images/down-arrow.svg')}
                            onClick={handleMoveDown}
                            alt={ButtonLabels.MOVE_DOWN}
                            className={styles.arrow_image}
                        />
                    </div>
                    <Button type="primary" onClick={onEditClick}>
                        {ButtonLabels.EDIT}
                    </Button>
                    <Button type="primary" danger onClick={onDeleteClick}>
                        {ButtonLabels.DELETE}
                    </Button>
                </div>
            </div>
        </div>
    );
};

CategoryItem.propTypes = {
    categoryId: PropTypes.number.isRequired,
    categoryName: PropTypes.string.isRequired,
    categoryUrl: PropTypes.string.isRequired,
    active: PropTypes.bool.isRequired,
    handleDelete: PropTypes.func.isRequired,
    handleEdit: PropTypes.func.isRequired
};

export default memo(CategoryItem);
