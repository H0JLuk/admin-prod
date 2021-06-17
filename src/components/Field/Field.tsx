import React from 'react';
import PropTypes from 'prop-types';
import styles from './Field.module.css';

type FieldProps = {
    label: string;
    value: string;
};

const Field: React.FC<FieldProps> = ({ label, value }) => (
    <p className={styles.text}>
        <span className={styles.bold}>{label}</span>
        {value}
    </p>
);

Field.propTypes = {
    label: PropTypes.string.isRequired,
    value: PropTypes.string.isRequired
};

export default Field;
