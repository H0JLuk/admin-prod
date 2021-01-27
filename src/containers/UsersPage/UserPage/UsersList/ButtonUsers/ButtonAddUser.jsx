import React from 'react';
import PropTypes from 'prop-types';
import { useHistory, useRouteMatch } from 'react-router-dom';
import cn from 'classnames';
import { USERS_PAGES } from '../../../../../constants/route';

import btnStyles from './ButtonUsers.module.css';

const ButtonAddUser = ({ title, classNames }) => {
    const history = useHistory();
    const { path } = useRouteMatch();

    const onAddUser = () => {
        history.push(`${path}${USERS_PAGES.ADD_USER}`);
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
