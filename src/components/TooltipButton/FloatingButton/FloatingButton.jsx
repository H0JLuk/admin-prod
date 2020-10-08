import React  from 'react';
import TooltipButton from '../TooltipButton';
import styles from './FloatingButton.module.css';
import 'antd/dist/antd.css';

function FloatingButton({ text, ...restProps }) {
    return (<TooltipButton className={ styles.floatingButtonWeb }
                           text={ text }
                           shape="circle"
                           size="large"
                           placement="topLeft"
                           { ...restProps } />);
}

export default FloatingButton;