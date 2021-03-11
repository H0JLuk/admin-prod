import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { generatePath, useHistory, useLocation } from 'react-router-dom';
import { Button } from 'antd';
import { deleteDzo, getAllDzoList, getDzoList } from '../../../api/services/dzoService';
import DzoListTable from './Table/DzoListTable';
import Header from '../../../components/Header/Header';
import TableDeleteModal from '../../../components/TableDeleteModal/TableDeleteModal';
import HeaderWithActions from '../../../components/HeaderWithActions/HeaderWithActions';

import { defaultSearchParams, getSearchParamsFromUrl, sortItemsBySearchParams } from '../../../utils/helper';
import { DZO_PAGES } from '../../../constants/route';

import styles from './DzoList.module.css';

const MODAL_TITLE = 'Вы уверены, что хотите удалить эти ДЗО?';
const MODAL_SUCCESS_TITLE = 'Результат удаления ДЗО';

const DZO_TITLE = 'Список ДЗО';

const DROPDOWN_SORT_MENU = [
    { name: 'dzoName', label: 'По названию' },
    { name: 'dzoId', label: 'По ID' },
    { name: 'dzoCode', label: 'По коду' },
];

const BUTTON_TEXT = {
    SAVE: 'Сохранить',
    ADD: 'Добавить',
    CANCEL: 'Отменить',
    SELECT: 'Выбрать',
    SELECT_ALL: 'Выбрать все',
    CANCEL_ALL: 'Отменить все',
    DELETE: 'Удалить',
    CHOSEN: 'Выбрано',
};

const SEARCH_INPUT_PLACEHOLDER = 'Поиск по названию дзо';

const getURLSearchParams = ({ ...rest }) => new URLSearchParams(rest).toString();

const defaultSelected = { rowValues: [], rowKeys: [] };

const DzoPage = ({ matchPath }) => {
    const history = useHistory();
    const { search } = useLocation();
    const [params, setParams] = useState(defaultSearchParams);
    const [loadingTable, setLoadingTable] = useState(true);
    const [dzoList, setDzoList] = useState([]);
    const [copyDzoList, setCopyDzoList] = useState([]);
    const [select, setSelect] = useState(false);
    const [selectedItems, setSelectedItems] = useState(defaultSelected);
    const [isModalView, setIsModalView] = useState(false);
    const dzoCodes = useRef([]);

    const onAddDzo = () => history.push(generatePath(`${matchPath}${DZO_PAGES.ADD_DZO}`), { dzoCodes: dzoCodes.current });

    const loadDzoList = useCallback(async (searchParams = defaultSearchParams) => {
        const urlSearchParams = getURLSearchParams(searchParams);
        setLoadingTable(true);
        try {
            const { dzoDtoList = [] } = await getDzoList();
            const { dzoDtoList: allDzo = [] } = await getAllDzoList();
            dzoCodes.current = allDzo.map(({ dzoCode }) => dzoCode);
            history.replace(`${matchPath}?${urlSearchParams}`);
            clearSelectedItems();
            setParams({ ...searchParams });
            setCopyDzoList(dzoDtoList);
            setDzoList(sortItemsBySearchParams(searchParams, dzoDtoList, 'dzoName'));
        } catch (e) {
            console.warn(e);
        }
        setLoadingTable(false);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    useEffect(() => {
        loadDzoList(getSearchParamsFromUrl(search));
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [loadDzoList]);

    const sortDzoList = useCallback((searchParams = defaultSearchParams) => {
        const { filterText, sortBy } = searchParams;
        setParams(searchParams);
        history.replace(`${matchPath}?${getURLSearchParams(searchParams)}`);

        if (!filterText && !sortBy) {
            setDzoList(copyDzoList);
            return;
        }

        setDzoList(sortItemsBySearchParams(searchParams, copyDzoList, 'dzoName'));
    }, [copyDzoList, history, matchPath]);

    const clearSelectedItems = () => {
        setSelectedItems(defaultSelected);
    };

    const clearSelectsRow = () => {
        setSelect(false);
        clearSelectedItems();
    };

    const updateSelected = useCallback((rowKeys, rowValues) => {
        setSelectedItems({ rowKeys, rowValues });
    }, []);

    const onSelect = useCallback(() => setSelect(true), []);

    const rowSelection = useMemo(() => ({
        selectedRowKeys: selectedItems.rowKeys,
        onChange: updateSelected,
    }), [selectedItems, updateSelected]);

    const selectAll = useCallback(() => {
        if (dzoList.length !== selectedItems.rowKeys.length) {
            setSelectedItems({ rowKeys: dzoList.map(({ dzoId }) => dzoId), rowValues: dzoList });
            return;
        }
        clearSelectedItems();
    }, [dzoList, selectedItems.rowKeys.length]);

    const onRow = useCallback((dzoData) => ({
        onClick: () => {
            const { dzoId } = dzoData;

            if (!select) {
                history.push(generatePath(`${matchPath}${DZO_PAGES.DZO_INFO}`, { dzoId }), { dzoData });
                return;
            }

            const rowKeys = !selectedItems.rowKeys.includes(dzoId)
                ? [...selectedItems.rowKeys, dzoId]
                : selectedItems.rowKeys.filter((selectedItemId) => selectedItemId !== dzoId);
            const rowValues = !selectedItems.rowValues.includes(dzoData)
                ? [...selectedItems.rowValues, dzoData]
                : selectedItems.rowValues.filter((selectedItem) => selectedItem.dzoId !== dzoId);
            setSelectedItems({ rowKeys, rowValues });
        },
    }), [select, selectedItems.rowKeys, selectedItems.rowValues, history, matchPath]);

    const handleSearch = useCallback((value = '') => {
        if (loadingTable) {
            return;
        }
        const nextParams = { ...params, filterText: value };
        sortDzoList(nextParams);
    }, [sortDzoList, loadingTable, params]);

    const changeSort = (sortBy) => {
        if (typeof sortBy !== 'string') {
            sortBy = '';
        }

        if (!sortBy && !params.sortBy) {
            return;
        }

        const sortParams = {
            ...params,
            sortBy,
            direction: !sortBy || params.direction === 'DESC' ? 'ASC' : 'DESC',
        };
        sortDzoList(sortParams);
    };

    const refreshTable = async () => {
        await loadDzoList(params);
        clearSelectedItems();
    };

    const toggleModal = () => {
        setIsModalView(!isModalView);
    };

    const buttons = [];

    if (select) {
        const selectedAll = dzoList.length === selectedItems.rowKeys.length;
        buttons.push({
            type: 'primary',
            label: selectedAll ? BUTTON_TEXT.CANCEL_ALL : BUTTON_TEXT.SELECT_ALL,
            onClick: selectAll,
            disabled: loadingTable,
        },
        {
            label: BUTTON_TEXT.CANCEL,
            onClick: clearSelectsRow,
            disabled: loadingTable,
        });
    } else {
        buttons.push(
            { type: 'primary', label: BUTTON_TEXT.ADD, onClick: onAddDzo, disabled: loadingTable },
            { label: BUTTON_TEXT.SELECT, onClick: onSelect, disabled: loadingTable },
        );
    }

    const searchInput = {
        placeholder: SEARCH_INPUT_PLACEHOLDER,
        onChange: handleSearch,
        value: params.filterText,
    };

    const sortingBy = {
        menuItems: DROPDOWN_SORT_MENU,
        onMenuItemClick: changeSort,
        withReset: true,
        sortBy: params.sortBy,
    };

    return (
        <>
            <div className={ styles.container }>
                <Header />
                <HeaderWithActions
                    buttons={ buttons }
                    showSorting
                    showSearchInput
                    searchInput={ searchInput }
                    sortingBy={ sortingBy }
                    classNameByInput={ styles.searchInput }
                    title={ DZO_TITLE }
                />
                <DzoListTable
                    loading={ loadingTable }
                    dzoList={ dzoList }
                    rowSelection={ select && rowSelection }
                    onRow={ onRow }
                />
                <div className={ styles.footer }>
                    { select && (
                        <div className={ styles.space }>
                            <div className={ styles.section }>
                                <span className={ styles.label }>
                                    { BUTTON_TEXT.CHOSEN } { selectedItems.rowKeys.length }
                                </span>
                            </div>
                            <Button
                                disabled={ !selectedItems.rowKeys.length }
                                danger
                                type='primary'
                                onClick={ toggleModal }
                            >
                                { BUTTON_TEXT.DELETE }
                            </Button>
                        </div>
                    ) }
                </div>
            </div>
            <TableDeleteModal
                listNameKey='dzoName'
                listIdForRemove={ selectedItems.rowKeys }
                sourceForRemove={ selectedItems.rowValues }
                modalClose={ toggleModal }
                deleteFunction={ deleteDzo }
                refreshTable={ refreshTable }
                modalSuccessTitle={ MODAL_SUCCESS_TITLE }
                modalTitle={ MODAL_TITLE }
                visible={ isModalView }
            />
        </>
    );
};

export default DzoPage;
