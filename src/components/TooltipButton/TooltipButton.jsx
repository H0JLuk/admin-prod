import React  from 'react';
import { Button, Tooltip } from 'antd';
import 'antd/dist/antd.css';

function TooltipButton({ text, placement, ...restProps }) {
    return (
        <Tooltip placement={ placement || 'bottom' }
                 title={ text || '' }>
            <Button { ...restProps } />
        </Tooltip>
    );
}

export default TooltipButton;