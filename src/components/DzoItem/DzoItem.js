import React, { memo } from 'react';
import PropTypes from 'prop-types';
import Button from '../Button/Button';
import styles from './DzoItem.module.css';
import ButtonLabels from '../Button/ButtonLables';

const DZO_NAME_LABEL = 'Название: ';
const DZO_ID_LABEL = 'ID: ';
const DZO_CODE_LABEL = 'Код: ';
const HEADER_LABEL = 'Заголовок: ';
const DESCRIPTION_LABEL = 'Описание: ';
const WEB_URL_LABEL = 'URL: ';

const DzoItem = ({
                     dzoId, dzoName, header,
                     description, dzoCode, webUrl,
                     handleEdit, handleDelete
                 }) => {
    const onDeleteClick = () => handleDelete(dzoId);

    const onEditClick = () => handleEdit(dzoId, dzoName, header ?? '', description ?? '', dzoCode, webUrl);

    return (
        <div className={ styles.dzoItem }>
            <div className={ styles.textFieldFormat }>
                {generateField(DZO_NAME_LABEL, `"${dzoName}"`)}
                {generateField(DZO_ID_LABEL, dzoId)}
                {generateField(DZO_CODE_LABEL, `"${dzoCode}"`)}
                {generateField(WEB_URL_LABEL, `"${webUrl}"`)}
                {header && generateField(HEADER_LABEL, `"${header}"`)}
                {description && generateField(DESCRIPTION_LABEL, `"${description}"`)}
            </div>
            <div className={ styles.dzoActions }>
                <Button type="green" onClick={ onEditClick } label={ ButtonLabels.EDIT } />
                <Button type="red" onClick={ onDeleteClick } label={ ButtonLabels.DELETE } />
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

DzoItem.propTypes = {
    dzoId: PropTypes.number.isRequired,
    dzoName: PropTypes.string.isRequired,
    dzoPresentationUrl: PropTypes.string,
    header: PropTypes.string,
    description: PropTypes.string,
    dzoCode: PropTypes.string.isRequired,
    webUrl: PropTypes.string,
    handleEdit: PropTypes.func.isRequired,
    handleDelete: PropTypes.func.isRequired
};

DzoItem.defaultProps = {
    header: '',
    description: ''
};

export default memo(DzoItem);
