import React from 'react';
import styles from './Input.module.css';
import PropTypes from 'prop-types';
import classNames from 'classnames';

class Input extends React.PureComponent {

    render() {
        const {
            name,
            value,
            label,
            valid,
            active,
            onClick,
            fieldClassName,
            iconClassName,
            activeLabelClassName,
            placeholder,
            formError,
            ...restProps
        } = this.props;

        const labelClasses = classNames(styles.label, {
            [styles.label_active]: active,
            [activeLabelClassName]: active || value !== '' || placeholder
        });

        const fieldClasses = classNames(fieldClassName, [styles.field], {
            [styles.field_error]: valid === false || formError,
            [styles.field_active]: active
        });

        const iconClasses = classNames(iconClassName, [styles.icon], {
            [styles.hide]: value === ''
        });

        const inputProps = {
            name: name,
            id: name,
            className: styles.input,
            ...restProps
        };

        return (
            <div className={fieldClasses}>
                <label htmlFor={name} className={labelClasses}>{label}</label>
                <input
                    {...inputProps}
                    placeholder={placeholder}
                    value={value} />
                <div className={iconClasses}>
                    <svg xmlns="http://www.w3.org/2000/svg"
                         width="24"
                         height="24"
                         viewBox="0 0 24 24"
                         className={`svg-icon ${iconClasses || ""}`}
                         onClick={onClick(name)}>
                        <path fill="#000" fillOpacity=".32" fillRule="evenodd"
                              d="M15.293 7.293L12 10.585 8.707 7.293a1 1 0 0 0-1.32-.083l-.094.083a1 1 0 0 0 0 1.414L10.585 12l-3.292 3.293a1 1 0 0 0 1.414 1.414L12 13.415l3.293 3.292a1 1 0 0 0 1.32.083l.094-.083a1 1 0 0 0 0-1.414L13.415 12l3.292-3.293a1 1 0 0 0-1.414-1.414z"/>
                    </svg>
                </div>
            </div>
        )
    }
}

Input.propTypes = {
    type: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    label: PropTypes.string,
    value: PropTypes.string.isRequired,
    valid: PropTypes.bool,
    active: PropTypes.bool,
    formError: PropTypes.bool,
    onChange: PropTypes.func.isRequired,
    onClick: PropTypes.func,
    onFocus: PropTypes.func,
    onBlur: PropTypes.func,
    fieldClassName: PropTypes.string,
    activeLabelClassName: PropTypes.string,
    iconClassName: PropTypes.string,
    placeholder: PropTypes.string,
};

export default Input;