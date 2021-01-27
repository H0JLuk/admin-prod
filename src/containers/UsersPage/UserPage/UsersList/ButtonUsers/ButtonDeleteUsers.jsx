import React, { useCallback } from 'react';
import PropTypes from 'prop-types';
import cn from 'classnames';
import ButtonLoadXMLFile from './ButtonLoadXMLFile';
import { onDeleteFileUploadInputChange } from '../../uploadLogic';

import styles from './ButtonUsers.module.css';

const ButtonDeleteUsers = ({ id, label, className = '', onSuccess }) => {
    const deleteUsers = useCallback(async (e) => {
        try {
            await onDeleteFileUploadInputChange(e);
            onSuccess();
        } catch (error) {
            // TODO: add error handler
            console.warn(error);
        }
    }, [onSuccess]);

    return (
        <ButtonLoadXMLFile
            id={ id }
            label={ label }
            className={ cn(styles.addButton, className) }
            changeAction={ deleteUsers }
        />
    );
};

ButtonDeleteUsers.defaultProps = {
    onSuccess: () => {},
};

ButtonDeleteUsers.propTypes = {
    id: PropTypes.string.isRequired,
    label: PropTypes.string.isRequired,
    className: PropTypes.string,
    onSuccess: PropTypes.func,
};

export default ButtonDeleteUsers;