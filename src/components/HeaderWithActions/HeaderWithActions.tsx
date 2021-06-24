import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import PropTypes from 'prop-types';
import { useHistory } from 'react-router-dom';
import debounce from 'lodash/debounce';
import noop from 'lodash/noop';
import { DIRECTION } from '@constants/common';
import ButtonsBlock from './ButtonsBlock';
import SearchInputWithAction from './SearchInputWithAction';
import DropdownWithAction from '../DropdownWithAction/DropdownWithAction';
import {
    defaultSearchParams,
    getURLSearchParams,
    sortItemsBySearchParams,
    defaultPaginationParams,
    getSearchParamsFromUrl,
} from '@utils/helper';
import { HeaderWithActionsProps, SearchParams } from './types';

import styles from './HeaderWithActions.module.css';

const BUTTON_SORT = 'Сортировать';
const EMPTY_OBJECT: any = {};
const EMPTY_ARRAY: any[] = [];

function HeaderWithActions<DataList>({
    title,
    buttons,
    showSearchInput = true,
    showSorting = true,
    triggerResetParams,
    setDataList = noop,
    copyDataList = EMPTY_ARRAY,
    matchPath,
    sortByFieldKey,
    menuItems=[],
    inputPlaceholder,
    resetLabel,
    params = EMPTY_OBJECT,
    setParams = noop,
    onChangeInput,
    onChangeSort = noop,
    loading,
    loadData = noop,
    enableAsyncSort,
    enableHistoryReplace = true,
}: HeaderWithActionsProps<DataList>) {
    const history = useHistory();
    const { search } = history.location;
    const [paramsSync, setParamsSync] = useState<SearchParams>(getSearchParamsFromUrl(search));
    const initialRender = useRef(true);

    useEffect(() => {
        if (!enableAsyncSort) {
            setSyncParams(paramsSync);
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [copyDataList]);

    useEffect(() => {
        if (!enableAsyncSort) {
            if (!initialRender.current) {
                setSyncParams(defaultSearchParams);
            } else {
                initialRender.current = false;
            }
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [triggerResetParams]);

    // eslint-disable-next-line react-hooks/exhaustive-deps
    const loadDataDebounced = useCallback(debounce(loadData, 500), [loadData]);

    const currentParams = enableAsyncSort ? params : paramsSync;

    const setAsyncParams = useCallback((searchParams: SearchParams = defaultPaginationParams) => {
        if (loading) {
            return;
        }

        if (searchParams.filterText) {
            loadDataDebounced(searchParams);
        } else {
            loadDataDebounced.cancel();
            loadData(searchParams);
        }

        setParams(searchParams);
    }, [loadData, loadDataDebounced, loading, setParams]);

    const setSyncParams = useCallback((searchParams: SearchParams = defaultSearchParams) => {
        setParamsSync(searchParams);
        enableHistoryReplace && history.replace(`${matchPath}?${getURLSearchParams(searchParams)}`);

        if (!searchParams.filterText && !searchParams.sortBy) {
            setDataList(copyDataList);
            return;
        }

        setDataList(sortItemsBySearchParams(searchParams, copyDataList, sortByFieldKey!));
    }, [copyDataList, enableHistoryReplace, history, matchPath, setDataList, sortByFieldKey]);

    const sortData = enableAsyncSort ? setAsyncParams : setSyncParams;

    const changeSort = useCallback((sortBy) => {
        onChangeSort();

        if (typeof sortBy !== 'string') {
            sortBy = '';
        }

        if (!sortBy && !currentParams.sortBy) return;

        sortData({
            ...currentParams,
            sortBy,
            direction: !sortBy || currentParams.direction === DIRECTION.DESC ? DIRECTION.ASC : DIRECTION.DESC,
        });
    }, [currentParams, onChangeSort, sortData]);

    const dropdownLabel = useMemo(() => {
        const { label } = menuItems.find((item) => item.name === currentParams.sortBy) || {};
        return label || BUTTON_SORT;
    }, [menuItems, currentParams.sortBy]);

    const withReset = currentParams.sortBy !== '';

    return (
        <div className={styles.wrapper}>
            {title && <div className={styles.headerTitle}>{title}</div>}
            <div className={styles.actions}>
                <div className={styles.buttons}>
                    <ButtonsBlock
                        buttons={buttons}
                        params={currentParams}
                    />
                    {showSearchInput && (
                        <SearchInputWithAction
                            placeholder={inputPlaceholder}
                            onChangeValue={sortData}
                            params={currentParams}
                            onChangeInput={onChangeInput}
                            resetPage={enableAsyncSort}
                        />
                    )}
                </div>
                {showSorting && (
                    <DropdownWithAction
                        dropdownLabel={dropdownLabel}
                        menuItems={menuItems}
                        onMenuItemClick={changeSort}
                        resetLabel={resetLabel}
                        withReset={withReset}
                    />
                )}
            </div>
        </div>
    );
}

HeaderWithActions.propTypes = {
    title: PropTypes.string,
    buttons: PropTypes.arrayOf(PropTypes.shape({
        type: PropTypes.string,
        label: PropTypes.string.isRequired,
        onClick: PropTypes.func.isRequired,
        disabled: PropTypes.oneOfType([
            PropTypes.bool,
            PropTypes.func,
        ]),
    })),
    showSearchInput: PropTypes.bool,
    showSorting: PropTypes.bool,
    triggerResetParams: PropTypes.any,
    setDataList: PropTypes.func,
    copyDataList: PropTypes.array,
    matchPath: PropTypes.string,
    sortByFieldKey: PropTypes.string,
    menuItems: PropTypes.array,
    inputPlaceholder: PropTypes.string,
    resetLabel: PropTypes.string,
    params: PropTypes.object,
    setParams: PropTypes.func,
    onChangeInput: PropTypes.func,
    onChangeSort: PropTypes.func,
    loading: PropTypes.bool,
    loadData: PropTypes.func,
    enableAsyncSort: PropTypes.bool,
    enableHistoryReplace: PropTypes.bool,
};

export default HeaderWithActions;
