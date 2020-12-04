import React from 'react';
import PropTypes from 'prop-types';

const ButtonLoadXMLFile = ({ id,  label, changeAction, className }) => (
    <>
        <input
            style={ { display: 'none' } }
            id={ id }
            type="file"
            onChange={ changeAction }
            accept="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
            value=""
        />
        <label htmlFor={ id }>
            <div className={ className } >
                { label }
            </div>
        </label>
    </>
);

ButtonLoadXMLFile.propTypes = {
    id: PropTypes.string.isRequired,
    label: PropTypes.string.isRequired,
    changeAction: PropTypes.func,
    className: PropTypes.string,
};

export default ButtonLoadXMLFile;
