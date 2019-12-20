import React from 'react';
import PropTypes from 'prop-types';
import styles from './Button.module.css';
import classNames from 'classnames';

class Button extends React.PureComponent {

    render() {
        const {label, font, type, className, children, disabled, ...restProps} = this.props;

        const buttonClasses = classNames([
            className,
            styles.button, {
                [styles[`button_${font}`]]: font,
                [styles[`button_${type}`]]: type,
                [styles.button_disabled]: disabled
            }]);

        return (
            <button
                {...restProps}
                className={buttonClasses}>
                {label || children}
            </button>
        )
    }
}

Button.propTypes = {
    label: PropTypes.string.isRequired,
    onClick: PropTypes.func.isRequired,
    type: PropTypes.oneOf(["green", "clear"]),
    font: PropTypes.oneOf(["roboto", "sfpro"]),
    disabled: PropTypes.bool
};

Button.defaultProps = {
    disabled: false
};

export default Button;
