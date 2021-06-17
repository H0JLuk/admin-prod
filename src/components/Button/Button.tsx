import React, { MouseEvent } from 'react';
import PropTypes from 'prop-types';
import styles from './Button.module.css';
import classNames from 'classnames';
import ButtonLabels from './ButtonLables';

export type ButtonProps = {
    label: string | ButtonLabels;
    font?: 'roboto' | 'sfpro';
    type?: 'green' | 'red' | 'blue' | 'clear';
    className?: string;
    disabled?: boolean;
    onClick?: (e: MouseEvent<HTMLButtonElement>) => void;
} & Omit<React.ButtonHTMLAttributes<any>, 'onClick' | 'type'>;

class Button extends React.PureComponent<ButtonProps> {
    onClick = (e: MouseEvent<HTMLButtonElement>) => {
        const { onClick, disabled } = this.props;

        if (disabled || typeof onClick !== 'function') {
            e.preventDefault();
            return;
        }

        onClick(e);
    };

    render() {
        const { label, font, type, className, children, disabled, ...restProps } = this.props;

        const buttonClasses = classNames([
            className,
            styles.button, {
                [styles[`button_${font}`]]: font,
                [styles[`button_${type}`]]: type,
                [styles.button_disabled]: disabled,
            }
        ]);

        return (
            <button
                {...restProps}
                className={buttonClasses}
                onClick={this.onClick}
                disabled={disabled}
            >
                {label || children}
            </button>
        );
    }
}

(Button as any).propTypes = {
    label: PropTypes.string.isRequired,
    onClick: PropTypes.func.isRequired,
    type: PropTypes.oneOf(['green', 'red', 'blue', 'clear']),
    font: PropTypes.oneOf(['roboto', 'sfpro']),
    disabled: PropTypes.bool
};

(Button as any).defaultProps = {
    disabled: false
};

export default Button;
