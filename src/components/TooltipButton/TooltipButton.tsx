import React from 'react';
import { Button, Tooltip, ButtonProps, TooltipProps } from 'antd';

type FloatingButtonProps = ButtonProps & {
    text?: string;
    placement?: TooltipProps['placement'];
};

const TooltipButton: React.FC<FloatingButtonProps> = ({ text, placement, ...restProps }) => (
    <Tooltip
        placement={placement || 'bottom'}
        title={text || ''}
    >
        <Button {...restProps} />
    </Tooltip>
);

export default TooltipButton;
