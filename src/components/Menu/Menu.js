import React, { useState, useEffect } from 'react';
import styles from './Menu.module.css';
import { Link } from 'react-router-dom';
import classnames from 'classnames';
import {ROUTE} from "../../constants/route";

const Menu = (props) => {

    return (
        <div className={styles.menu}>
            {props.items.map(item =>
                <Link key={item.name}
                      className={classnames(styles.menu__item, {
                          [styles.menu__item_active]: window.location.href.includes(item.url)
                      })}
                      to={item.url}
                >
                    {item.title}
                </Link>)}
                <Link to={ROUTE.CLIENT_APPS} className={styles.clientAppItem}>
                    {props.code}
                </Link>
        </div>
    )
};

export default Menu;