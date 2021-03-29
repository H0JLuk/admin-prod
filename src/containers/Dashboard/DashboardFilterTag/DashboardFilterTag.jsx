import React from 'react';
import cn from 'classnames';
import styles from './DashboardFilterTag.module.css';

const DashboardFilterTag = ({ handleClick, id, displayName, selected }) => {
    const onClick = () => handleClick(id, !selected);

    return (
        <div className={ cn(styles.tag, { [styles.selected]: selected }) } onClick={ onClick }>
            <p className={ styles.text }>{ displayName }</p>
        </div>
    );
};

export default DashboardFilterTag;
