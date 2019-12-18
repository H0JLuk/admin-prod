import React, { useState, useEffect } from 'react';
import styles from './Menu.module.css';
import { Link } from 'react-router-dom';

const Menu = (props) => {
    return (
        <div className={styles.menu}>
            {props.items.map(item =>
                <Link key={item.name} className={styles.menu__item} to={item.url}>{item.title}</Link>)}
        </div>
    )
};

export default Menu;