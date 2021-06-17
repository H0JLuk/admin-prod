import React, { memo, useCallback, useMemo, useState, MouseEvent } from 'react';
// import PropTypes from 'prop-types';
import cn from 'classnames';
import { Dropdown, Button } from 'antd';
import { DownOutlined } from '@ant-design/icons';
import { MenuItem } from '@components/HeaderWithActions/types';

import styles from './DropdownWithAction.module.css';

const RESET_LABEL = 'Сбросить';

const DROPDOWN_ARROW_STYLE = {
    fontSize: '14px',
    color: '#c3c9d0',
};

type DropdownWithActionProps = {
    dropdownLabel: string;
    onMenuItemClick: (val: string | MouseEvent<HTMLDivElement>) => void;
    menuItems: MenuItem[];
    resetLabel?: string;
    withReset?: boolean;
};

// InferProps<DropdownWithActionProps>
const DropdownWithAction: React.FC<DropdownWithActionProps> = ({
    dropdownLabel,
    onMenuItemClick,
    menuItems,
    withReset,
    resetLabel = RESET_LABEL,
}) => {
    const [dropdownActive, setDropdownActive] = useState(false);

    const menuItemClickHandler = useCallback((name: string | MouseEvent<HTMLDivElement>) => {
        setDropdownActive(false);
        onMenuItemClick(name);
    }, [onMenuItemClick]);

    const overlay = useMemo(() => (
        <div className={styles.dropdownMenu}>
            {menuItems.map((item) => (
                <div
                    key={item.name}
                    className={cn(styles.dropdownMenuItem, { [styles.active]: item.active })}
                    onClick={() => menuItemClickHandler(item.name)}
                >
                    {item.label}
                </div>
            ))}
            {withReset && (
                <div
                    className={styles.dropdownMenuItem}
                    onClick={menuItemClickHandler}
                >
                    {resetLabel}
                </div>
            )}
        </div>
    ), [menuItems, menuItemClickHandler, withReset, resetLabel]);

    return (
        <Dropdown
            overlay={overlay}
            trigger={['click']}
            visible={dropdownActive}
            onVisibleChange={setDropdownActive}
        >
            <Button className={styles.dropdownButton}>
                {dropdownLabel} {<DownOutlined style={DROPDOWN_ARROW_STYLE} />}
            </Button>
        </Dropdown>
    );
};

// TODO: Решить проблему с типизацией menuItems
// DropdownWithAction.propTypes = {
//     dropdownLabel: PropTypes.string.isRequired,
//     onMenuItemClick: PropTypes.func.isRequired,
//     resetLabel: PropTypes.string,
//     menuItems: PropTypes.arrayOf(PropTypes.shape({
//         name: PropTypes.string.isRequired,
//         label: PropTypes.string.isRequired,
//         active: PropTypes.bool,
//     })).isRequired,
//     withReset: PropTypes.bool,
// };

export default memo(DropdownWithAction);
