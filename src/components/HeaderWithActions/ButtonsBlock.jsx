import React from 'react';
import { Button } from 'antd';

const ButtonsBlock = ({ buttons, params }) => {
    return (buttons || []).map(({ label, disabled, ...restProps }) => (
        <Button
            key={ label }
            disabled={ typeof disabled === 'function' ? disabled(params) : disabled }
            { ...restProps }
        >
            { label }
        </Button>
    ));
};

export default ButtonsBlock;
