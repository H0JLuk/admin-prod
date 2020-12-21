import React, { useCallback, useMemo } from 'react';
import PropTypes from 'prop-types';
import cn from 'classnames';
import { Button, Input } from 'antd';
import { SearchOutlined } from '@ant-design/icons';
import DropdownWithAction from '../DropdownWithAction/DropdownWithAction';

import { ReactComponent as Cross } from '../../static/images/cross.svg';

import styles from './HeaderWithActions.module.css';

const BUTTON_SORT = 'Сортировать';

const HeaderWithActions = ({
    title,
    buttons,
    searchInput,
    showSearchInput,
    showSorting,
    sortingBy,
    classNameByInput,
    classNames,
}) => {
    const buttonsBlock = useMemo(() => (buttons || []).map((button) => (
        <Button
            className={ cn(styles.button, { [styles.btn_primary]: button.type === 'primary' }) }
            key={ button.label }
            type={ button.type }
            onClick={ button.onClick }
            disabled={ button.disabled }
        >
            { button.label }
        </Button>
    )), [buttons]);

    const onChangeInput = useCallback(({ target: { value } }) => {
        searchInput.onChange(value);
    }, [searchInput]);

    const clickClearButton = useCallback(() => searchInput.onChange(''), [searchInput]);

    const dropdownLabel = useMemo(
        () => sortingBy.menuItems.find((item) => item.name === sortingBy.sortBy)?.label || BUTTON_SORT,
        [sortingBy.menuItems, sortingBy.sortBy]
    );

    return (
        <div className={ cn(styles.wrapper, classNames) }>
            {title && <h1>{ title }</h1>}
            <div className={ styles.actions }>
                <div className={ styles.buttons }>
                    { buttonsBlock }
                    {searchInput && showSearchInput && (
                        <Input
                            className={ cn(styles.searchInput, classNameByInput) }
                            onChange={ onChangeInput }
                            placeholder={ searchInput.placeholder }
                            prefix={ <SearchOutlined /> }
                            value={ searchInput.value }
                            suffix={ searchInput.value !== '' ?
                                <Cross
                                    className={ styles.crossIcon }
                                    onClick={ clickClearButton }
                                /> :
                                <span />
                            }
                            disabled={ searchInput.disabled }
                        />
                    )}
                </div>
                {sortingBy && showSorting && (
                    <DropdownWithAction
                        dropdownLabel={ dropdownLabel }
                        menuItems={ sortingBy.menuItems }
                        onMenuItemClick={ sortingBy.onMenuItemClick }
                        withReset={ sortingBy.withReset }
                    />
                )}
            </div>
        </div>
    );
};

HeaderWithActions.propTypes = {
    title: PropTypes.string,
    buttons: PropTypes.arrayOf(PropTypes.shape({
        type: PropTypes.string,
        label: PropTypes.string.isRequired,
        onClick: PropTypes.func.isRequired,
        disabled: PropTypes.bool,
    })),
    searchInput: PropTypes.shape({
        placeholder: PropTypes.string,
        onChange: PropTypes.func,
        disabled: PropTypes.bool,
    }),
    showSorting: PropTypes.bool,
    sortingBy: PropTypes.shape({
        buttonLabel: PropTypes.string,
        onMenuItemClick: PropTypes.func.isRequired,
        menuItems: PropTypes.arrayOf(PropTypes.shape({
            name: PropTypes.string.isRequired,
            label: PropTypes.string.isRequired,
            active: PropTypes.bool,
        })).isRequired,
        sortBy: PropTypes.string,
        withReset: PropTypes.bool,
    }),
};

export default HeaderWithActions;
