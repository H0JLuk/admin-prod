import React from 'react';
import PropTypes from 'prop-types';
import { useHistory } from 'react-router-dom';
import cn from 'classnames';
import { ROUTE_ADMIN_USERS } from '../../../constants/route';
import btnStyles from './ButtonUsers.module.css';

const ButtonAddUser = ({ title, classNames }) => {

    const history = useHistory();

    const onAddUser = () => {
        history.push(ROUTE_ADMIN_USERS.ADD_USER);
    };

    return (
        <button
            className={ cn(btnStyles.addButton, btnStyles.btnGreen, classNames) }
            onClick={ onAddUser }
        >
            { title }
        </button>
    );
};

ButtonAddUser.propTypes = {
    title: PropTypes.string.isRequired,
    className: PropTypes.string,
};

export default ButtonAddUser;
