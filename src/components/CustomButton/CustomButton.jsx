import { Button } from 'antd';
import PropTypes from 'prop-types';
import React from 'react';

const CustomButton = ({
                          className,
                          type,
                          htmlType,
                          onClick,
                          disabled,
                          children,
                      }) => (
    <Button
        className={ className }
        type={ type }
        htmlType={ htmlType }
        onClick={ onClick }
        disabled={ disabled }
    >
        { children }
    </Button>
);

CustomButton.defaultProps = {
    type: 'primary',
    htmlType: 'button',
    onClick: () => {},
};

CustomButton.propTypes = {
    className: PropTypes.string,
    type: PropTypes.string,
    shape: PropTypes.string,
    htmlType: PropTypes.string,
    size: PropTypes.string,
    onClick: PropTypes.func,
    disabled: PropTypes.bool,
    children: PropTypes.oneOfType([
        PropTypes.arrayOf(PropTypes.node),
        PropTypes.node
    ]),
};

export default CustomButton;