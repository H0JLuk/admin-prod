import React from 'react';
import styles from './RemovedUsersList.module.css';

const RemovedUsersList = ({ usersList, message }) => (
    <ul className={ styles.list }>
        <p>
            <span className={ styles.success }>{ message }</span>
            <span>({ usersList.length })</span>
        </p>
        {usersList.map((el, index) => (
            <li key={ index }>
                { el.user }
            </li>
        ))}
    </ul>
);

export default RemovedUsersList;
