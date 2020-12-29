import React, { useCallback, useState, useEffect, useMemo } from 'react';
import { useHistory, generatePath, useLocation } from 'react-router-dom';
import debounce from 'lodash/debounce';
import cn from 'classnames';
import EmptyUsersPage from './EmptyUsersPage/EmptyUsersPage';
import ButtonLoadUsers from './ButtonUsers/ButtonLoadUsers';
import ButtonDeleteUsers from './ButtonUsers/ButtonDeleteUsers';
import DownloadDropDown from './DownloadDropDown/DownloadDropDown';
import HeaderWithActions from '../../components/HeaderWithActions/HeaderWithActions';
import Header from '../../components/Header/Redisegnedheader/Header';
import UsersListTable from './UsersListTable';
import ModalDeleteUsers from './ModalDeleteUsers/ModalDeleteUsers';
import { getUsersList, resetUser } from '../../api/services/adminService';
import { USERS_PAGES } from '../../constants/route';

import styles from './TableUser.module.css';
import btnStyles from './ButtonUsers/ButtonUsers.module.css';

const TITLE = 'Пользователи';

const BUTTON_EDIT = 'Редактировать';
const BUTTON_CHANGE_PASSWORD = 'Сбросить пароль';
const BUTTON_ADD = 'Добавить';
const BUTTON_CHOOSE = 'Выбрать';
const BUTTON_CANCEL = 'Отменить';
const BUTTON_DELETE = 'Удалить';

const SEARCH_INPUT = 'Поиск по логину, локации и точке продажи';

const CHOSEN_USER = 'Выбрано';
const TITLE_DOWNLOAD_USER = 'Пакетная обработка пользователей';

const locale = {
    items_per_page: '',
    prev_page:      'Назад',
    next_page:      'Вперед',
    jump_to:        'Перейти',
    prev_5:         'Предыдущие 5',
    next_5:         'Следующие 5',
    prev_3:         'Предыдущие 3',
    next_3:         'Следующие 3',
};

const DEFAULT_PARAMS = {
    pageNo: 0,
    pageSize: 10,
    sortBy: '',
    direction: 'ASC',
    filterText: '',
    totalElements: 0,
};

// eslint-disable-next-line no-unused-vars
const getURLSearchParams = ({ totalElements, ...rest }) => new URLSearchParams(rest).toString();

const DROPDOWN_SORT_MENU = [
    { name: 'personalNumber', label: 'По логину' },
    { name: 'locationName', label: 'По локации' },
    { name: 'salePointName', label: 'По точке продажи' },
];

const TableUser = ({ matchUrl }) => {
    const history = useHistory();
    const { search } = useLocation();
    const [users, setUsers] = useState([]);
    const [select, setSelect] = useState(false);
    const [selectedRowValues, setSelectedRowValues] = useState([]);
    const [selectedRowKeys, setSelectedRowKeys] = useState([]);
    const [loadingPage, setLoadingPage] = useState(true);
    const [loadingTableData, setLoadingTableData] = useState(true);
    const [params, setParams] = useState(DEFAULT_PARAMS);
    const [modalIsOpen, setModalIsOpen] = useState(false);

    const loadUsersData = useCallback(async (searchParams = DEFAULT_PARAMS) => {
        const urlSearchParams = getURLSearchParams(searchParams);

        setLoadingTableData(true);

        try {
            const { users = [], totalElements, pageNo } = await getUsersList(urlSearchParams);
            /* use `replace` instead of `push` for correct work `history.goBack()` */
            history.replace(`${matchUrl}?${urlSearchParams}`);
            clearSelectedItems();
            setParams({
                ...searchParams,
                pageNo,
                totalElements,
            });
            setUsers(users);
        } catch (e) {
            console.error(e);
        }
        setLoadingTableData(false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    // eslint-disable-next-line react-hooks/exhaustive-deps
    const loadUsersDataDebounced = useCallback(debounce(loadUsersData, 500), [loadUsersData]);

    useEffect(() => {
        (async () => {
            const urlSearchParams = new URLSearchParams(search);
            const searchParamsFromUrl = {};
            Object.keys(DEFAULT_PARAMS).forEach(key => {
                const searchValue = urlSearchParams.get(key);
                searchParamsFromUrl[key] = searchValue || DEFAULT_PARAMS[key];
            });
            await loadUsersData(searchParamsFromUrl);
            setLoadingPage(false);
        })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [loadUsersData]);

    const handleSearch = useCallback((value = '') => {
        if (loadingTableData) {
            return;
        }

        const nextParams = { ...params, filterText: value, pageNo: 0 };

        if (value) {
            loadUsersDataDebounced(nextParams);
        } else {
            loadUsersData(nextParams);
        }
        setParams(nextParams);
    }, [loadingTableData, params, loadUsersDataDebounced, loadUsersData]);

    const changeSort = useCallback((sortBy) => {
        if (typeof sortBy !== 'string') {
            sortBy = '';
        }

        if (!sortBy && !params.sortBy) {
            return;
        }

        loadUsersData({
            ...params,
            sortBy,
            direction: !sortBy || params.direction === 'DESC' ? 'ASC' : 'DESC',
        });
    }, [loadUsersData, params]);

    const clearSelectedItems = () => {
        setSelectedRowKeys([]);
        setSelectedRowValues([]);
    };

    const onAddUser = useCallback(() => history.push(`${matchUrl}${USERS_PAGES.ADD_USER}`), [history, matchUrl]);

    const setSelectedRow = useCallback(() => {
        setSelect((state) => !state);
        clearSelectedItems();
    }, []);

    const buttons = useMemo(() => {
        if (select) {
            return [
                { label: BUTTON_CANCEL, onClick: setSelectedRow, disabled: loadingTableData },
            ];
        }

        return [
            { type: 'primary', label: BUTTON_ADD, onClick: onAddUser, disabled: loadingTableData },
            { label: BUTTON_CHOOSE, onClick: setSelectedRow, disabled: loadingTableData },
        ];
    }, [select, loadingTableData, setSelectedRow, onAddUser]);

    const searchInput = useMemo(() => ({
        placeholder: SEARCH_INPUT,
        value: params.filterText,
        onChange: handleSearch,
    }), [params, handleSearch]);

    const sortingBy = useMemo(() => ({
        menuItems: DROPDOWN_SORT_MENU,
        onMenuItemClick: changeSort,
        sortBy: params.sortBy,
        withReset: params.sortBy !== '',
    }), [changeSort, params.sortBy]);

    const onChangePage = useCallback(async ({ current, pageSize }) => {
        loadUsersData({
            ...params,
            pageNo: current - 1,
            pageSize,
        });
    }, [loadUsersData, params]);

    /** @type {import('antd/lib/pagination').PaginationConfig} */
    const pagination = useMemo(() => ({
        current: params.pageNo + 1,
        total: params.totalElements,
        pageSize: params.pageSize,
        locale,
        showQuickJumper: true,
        showSizeChanger: true,
    }), [params.pageNo, params.pageSize, params.totalElements]);

    const forceUpdateUsersData = useCallback(() => loadUsersData(params), [params, loadUsersData]);

    const updateSelected = useCallback((keys, rows) => {
        setSelectedRowKeys(keys);
        setSelectedRowValues(rows);
    }, []);

    const rowSelection = useMemo(() => ({
        selectedRowKeys,
        onChange: updateSelected,
    }), [selectedRowKeys, updateSelected]);

    const linkChangePassword = useCallback(async () => {
        const requestPromises = selectedRowValues.map(({ personalNumber }) => resetUser(personalNumber));
        setLoadingTableData(true);

        try {
            await Promise.all(requestPromises);
            clearSelectedItems();
        } catch (e) {
            console.warn(e);
        }

        setLoadingTableData(false);
    }, [selectedRowValues]);

    const linkEdit = useCallback(() => {
        history.push(`${matchUrl}${USERS_PAGES.EDIT_SOME_USERS}`, { users: selectedRowValues });
    }, [history, selectedRowValues, matchUrl]);

    const refreshTable = useCallback(async () => {
        await loadUsersData(params);
        clearSelectedItems();
    }, [params, loadUsersData]);

    const onRow = useCallback((record) => ({
        onClick: () => {
            if (!select) {
                history.push(generatePath(`${matchUrl}${USERS_PAGES.USER_INFO}`, { userId: record.id }));
                return;
            }

            const newSelectedItemId = !selectedRowKeys.includes(record.id)
                ? [...selectedRowKeys, record.id]
                : selectedRowKeys.filter((selectedItemId) => selectedItemId !== record.id);
            const newSelectedItem = !selectedRowValues.includes(record)
                ? [...selectedRowValues, record]
                : selectedRowValues.filter((selectedItem) => selectedItem.id !== record.id);

            setSelectedRowKeys(newSelectedItemId);
            setSelectedRowValues(newSelectedItem);
        }
    }), [history, select, selectedRowKeys, selectedRowValues, matchUrl]);

    const openModal = useCallback(() => setModalIsOpen(true), []);

    if (loadingPage) {
        return (
            <div className={ styles.loadingPage }>
                Загрузка...
            </div>
        );
    }

    if (!users.length && !loadingPage && !loadingTableData && !params.filterText && !params.pageNo) {
        return <EmptyUsersPage />;
    }

    return (
        <div className={ styles.mainBlock }>
            <Header buttonBack={ false } />
            <HeaderWithActions
                title={ TITLE }
                buttons={ buttons }
                searchInput={ searchInput }
                showSearchInput={ true }
                showSorting
                sortingBy={ sortingBy }
                classNameByInput={ styles.inputSearch }
            />
            <UsersListTable
                loadingData={ loadingTableData }
                onRow={ onRow }
                rowSelection={ select && rowSelection }
                dataSource={ users }
                pagination={ pagination }
                onChangePage={ onChangePage }
            />
            <div className={ styles.footer }>
                {select ? (
                    <div className={ styles.space }>
                        <div className={ styles.section }>
                            <span className={ styles.label }>
                                { CHOSEN_USER } { selectedRowKeys.length }
                            </span>
                            <button
                                className={ cn(btnStyles.addButton, btnStyles.btnGreen) }
                                disabled={ !selectedRowKeys.length }
                                onClick={ linkChangePassword }
                            >
                                { BUTTON_CHANGE_PASSWORD }
                            </button>
                            <button
                                className={ cn(btnStyles.addButton, btnStyles.btnGreen) }
                                disabled={ !selectedRowKeys.length }
                                onClick={ linkEdit }
                            >
                                { BUTTON_EDIT }
                            </button>
                        </div>
                        <button
                            className={ cn(btnStyles.addButton, btnStyles.btnRed) }
                            disabled={ !selectedRowKeys.length }
                            onClick={ openModal }
                        >
                            { BUTTON_DELETE }
                        </button>
                        <ModalDeleteUsers
                            modalOpen={ setModalIsOpen }
                            visible={ modalIsOpen }
                            userList={ selectedRowValues }
                            selectedRowKeys={ selectedRowKeys }
                            refreshTable={ refreshTable }
                        />
                    </div>
                ) : (
                    <div className={ styles.section }>
                        <span className={ styles.label }>
                            { TITLE_DOWNLOAD_USER }
                        </span>
                        <div className={ styles.downloadButtons }>
                            <ButtonLoadUsers
                                id="contained-button-upload-file"
                                label={ BUTTON_ADD }
                                onSuccess={ forceUpdateUsersData }
                            />
                            <ButtonDeleteUsers
                                id="contained-button-delete-file"
                                label={ BUTTON_DELETE }
                                onSuccess={ forceUpdateUsersData }
                            />
                        </div>
                        <DownloadDropDown />
                    </div>
                )}
            </div>
        </div>
    );
};

export default TableUser;
