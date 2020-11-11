import React from 'react';
import PropTypes from 'prop-types';
import styles from './Field.module.css';

const Field = ({ label, value }) => {
    return (
        <p className={ styles.text }>
            <span className={ styles.bold }>{ label }</span>
            { value }
        </p>
    );
};

Field.propTypes = {
    label: PropTypes.string.isRequired,
    value: PropTypes.string.isRequired
};

export default Field;
