import React from 'react';
import { TooltipProps, ButtonProps } from 'antd';
import TooltipButton from '../TooltipButton';
import styles from './FloatingButton.module.css';

type FloatingButtonProps = ButtonProps & {
    text?: string;
    placement?: TooltipProps['placement'];
};

const FloatingButton: React.FC<FloatingButtonProps> = ({ text, ...restProps }) => (
    <TooltipButton
        className={styles.floatingButtonWeb}
        text={text}
        shape="circle"
        size="large"
        placement="topLeft"
        {...restProps}
    />
);

export default FloatingButton;
