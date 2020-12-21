import React, { useCallback, useMemo, useState } from 'react';
import PropTypes from 'prop-types';
import cn from 'classnames';
import { Dropdown, Button } from 'antd';
import { DownOutlined, UpOutlined } from '@ant-design/icons';

import styles from './DropdownWithAction.module.css';

const RESET_LABEL = 'Сбросить';

const DROPDOWN_ARROW_STYLE = {
    fontSize: '14px',
    color: '#c3c9d0',
};

const DropdownWithAction = ({
    dropdownLabel,
    onMenuItemClick,
    menuItems = [],
    withReset,
}) => {
    const [dropdownActive, setDropdownActive] = useState(false);

    const menuItemClickHandler = useCallback((name) => {
        setDropdownActive(false);
        onMenuItemClick(name);
    }, [onMenuItemClick]);

    const overlay = useMemo(() => (
        <div className={ styles.dropdownMenu }>
            {menuItems.map((item) => (
                <div
                    key={ item.name }
                    className={ cn(styles.dropdownMenuItem, { [styles.active]: item.active }) }
                    onClick={ () => menuItemClickHandler(item.name) }
                >
                    { item.label }
                </div>
            ))}
            {withReset && (
                <div
                    className={ styles.dropdownMenuItem }
                    onClick={ menuItemClickHandler }
                >
                    { RESET_LABEL }
                </div>
            )}
        </div>
    ), [menuItems, menuItemClickHandler, withReset]);

    return (
        <Dropdown
            className
            overlay={ overlay }
            trigger={ ['click'] }
            visible={ dropdownActive }
            onVisibleChange={ setDropdownActive }
        >
            <Button
                className={ cn(styles.dropdownButton, { [styles.dropdownActive]: dropdownActive }) }
            >
                { dropdownLabel } {
                    !dropdownActive
                        ? <DownOutlined style={ DROPDOWN_ARROW_STYLE } />
                        : <UpOutlined style={ DROPDOWN_ARROW_STYLE } />
                }
            </Button>
        </Dropdown>
    );
};

DropdownWithAction.propTypes = {
    dropdownLabel: PropTypes.string.isRequired,
    onMenuItemClick: PropTypes.func.isRequired,
    menuItems: PropTypes.arrayOf(PropTypes.shape({
        name: PropTypes.string.isRequired,
        label: PropTypes.string.isRequired,
        active: PropTypes.bool,
    })).isRequired,
    withReset: PropTypes.bool,
};

export default DropdownWithAction;
