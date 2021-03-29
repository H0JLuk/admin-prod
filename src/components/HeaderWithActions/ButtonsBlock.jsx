import React from 'react';
import { Button } from 'antd';

const ButtonsBlock = ({ buttons, params }) => {
    return (buttons || []).map((button) => (
        <Button
            key={ button.label }
            type={ button.type }
            onClick={ button.onClick }
            disabled={ typeof button.disabled === 'function' ? button.disabled(params) : button.disabled }
        >
            { button.label }
        </Button>
    ));
};

export default ButtonsBlock;
