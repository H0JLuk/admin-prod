import React, { useCallback } from 'react';
import PropTypes from 'prop-types';
import cn from 'classnames';
import ButtonLoadXMLFile from './ButtonLoadXMLFile';
import { onFileUploadInputChange } from '../../UsersPage/uploadLogic';
import styles from './ButtonUsers.module.css';

const ButtonLoadUsers = ({ id,  label, classNames, onSuccess }) => {
    const uploadUsers = useCallback(async (e) => {
        try {
            await onFileUploadInputChange(e);
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
            className={ cn(styles.addButton, styles.btnGreen, classNames) }
            changeAction={ uploadUsers }
        />
    );
};

ButtonLoadUsers.propTypes = {
    id: PropTypes.string.isRequired,
    label: PropTypes.string.isRequired,
    classNames: PropTypes.string,
    onSuccess:PropTypes.func,
};

ButtonLoadUsers.defaultProps = {
    onSuccess: () => {},
};

export default ButtonLoadUsers;