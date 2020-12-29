import cn from 'classnames';
import React, { memo } from 'react';
import PropTypes from 'prop-types';
import CustomButton from '../CustomButton/CustomButton';
import Field from '../Field/Field';
import styles from './DzoItem.module.css';
import ButtonLabels from '../Button/ButtonLables';

const DZO_NAME_LABEL = 'Название: ';
const DZO_ID_LABEL = 'ID: ';
const DZO_CODE_LABEL = 'Код: ';
const HEADER_LABEL = 'Заголовок: ';
const DESCRIPTION_LABEL = 'Описание: ';
const WEB_URL_LABEL = 'URL: ';
const ADD_EDIT_APP_URL = 'Add/Edit App url';

const DzoItem = ({
                     dzoId, dzoName, header,
                     description, dzoCode, webUrl,
                     handleEdit, handleDelete,
                     handleAddAppLink, applicationList
                 }) => {
    const onDeleteClick = () => handleDelete(dzoId);

    const onEditClick = () => handleEdit(dzoId, dzoName, header ?? '', description ?? '', dzoCode, webUrl);

    const onAddAppClick = () => handleAddAppLink(dzoId, dzoName, applicationList);

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
                <CustomButton className={ cn(styles.button, styles.submitButton) } onClick={ onAddAppClick }>
                    { ADD_EDIT_APP_URL }
                </CustomButton>
                <CustomButton className={ cn(styles.button, styles.submitButton) } onClick={ onEditClick }>
                    { ButtonLabels.EDIT }
                </CustomButton>
                <CustomButton className={ cn(styles.button, styles.deleteButton) } onClick={ onDeleteClick }>
                    { ButtonLabels.DELETE }
                </CustomButton>
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
    handleDelete: PropTypes.func.isRequired,
    handleAddAppLink: PropTypes.func.isRequired,
    applicationList: PropTypes.array,
};

DzoItem.defaultProps = {
    header: '',
    description: ''
};

export default memo(DzoItem);
