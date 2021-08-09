import React, { CSSProperties, memo } from 'react';
import cn from 'classnames';
import styles from './ContentBlock.module.css';

type ContentContainerProps = {
    maxWidth?: CSSProperties['maxWidth'];
    style?: Omit<CSSProperties, 'maxWidth'>;
    className?: string;
};

const ContentBlock: React.FC<ContentContainerProps> = memo(function ContentBlock({
    className,
    maxWidth = '100%',
    style = {},
    children,
}) {
    const mergedStyle = {
        ...style,
        maxWidth,
    };

    return (
        <div className={cn(styles.contentContainer, className)} >
            <div style={mergedStyle}>
                {children}
            </div>
        </div>
    );
});

export default ContentBlock;
