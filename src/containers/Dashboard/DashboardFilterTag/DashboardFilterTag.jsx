import React from 'react';
import cn from 'classnames';
import styles from './DashboardFilterTag.module.css';

const DashboardFilterTag = ({ handleClick, id, displayName, selected, type }) => {
    const onClick = () => handleClick(id, !selected, type);

    return (
        <div className={ cn(styles.tag, { [styles.selected]: selected }) } onClick={ onClick }>
            <p className={ cn(styles.text, { [styles.selected]: selected }) }>{ displayName }</p>
        </div>
    );
};

export default DashboardFilterTag;
