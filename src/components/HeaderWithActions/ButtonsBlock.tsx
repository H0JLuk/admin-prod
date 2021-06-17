import React from 'react';
import { Button, ButtonProps as AntButtonProps } from 'antd';

export type ButtonProps = Omit<AntButtonProps, 'disabled' | 'label'> & {
    label: string;
    disabled?: ((params?: Record<string, string | number>) => boolean) | boolean;
};

type ButtonsBlockProps = {
    buttons: ButtonProps[];
    params?: Record<string, string | number>;
};

const ButtonsBlock: React.FC<ButtonsBlockProps> = ({ buttons, params }) =>
    (buttons || []).map(({ label, disabled, ...restProps }) => (
        <Button
            key={label}
            disabled={typeof disabled === 'function' ? disabled(params) : disabled}
            {...restProps}
        >
            {label}
        </Button>
    )) as Exclude<React.ReactNode, null | undefined | boolean | React.ReactFragment>;

export default ButtonsBlock;
