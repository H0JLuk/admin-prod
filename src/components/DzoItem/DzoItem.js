import React, { memo } from 'react';
import PropTypes from 'prop-types';
import Button from '../Button/Button';
import Field from '../Field/Field';
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
                <Field label={ DZO_NAME_LABEL } value={ `"${dzoName}"` } />
                <Field label={ DZO_ID_LABEL } value={ dzoId.toString() } />
                <Field label={ DZO_CODE_LABEL } value={ `"${dzoCode}"` } />
                <Field label={ WEB_URL_LABEL } value={ `"${webUrl}"` } />
                {header && <Field label={ HEADER_LABEL } value={ `"${header}"` } />}
                {description && <Field label={ DESCRIPTION_LABEL } value={ `"${description}"` } />}
            </div>
            <div className={ styles.dzoActions }>
                <Button type="green" onClick={ onEditClick } label={ ButtonLabels.EDIT } />
                <Button type="red" onClick={ onDeleteClick } label={ ButtonLabels.DELETE } />
            </div>
        </div>
    );
};

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
