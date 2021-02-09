import React, { useCallback, useState, useEffect, useMemo } from 'react';
import { useHistory, generatePath, useLocation } from 'react-router-dom';
import debounce from 'lodash/debounce';
import cn from 'classnames';
import { notification } from 'antd';
import RestoredTableUser from './RestoredTableUser/RestoredTableUser';
import EmptyUsersPage from './EmptyUsersPage/EmptyUsersPage';
import DownloadDropDown from './DownloadDropDown/DownloadDropDown';
import HeaderWithActions from '../../../../components/HeaderWithActions/HeaderWithActions';
import TableDeleteModal from '../../../../components/TableDeleteModal/TableDeleteModal';
import Header from '../../../../components/Header/Header';
import UsersListTable from './UsersListTable';
import useBodyClassForSidebar from '../../../../hooks/useBodyClassForSidebar';
import TemplateUploadButtonsWithModal from '../../../../components/ButtonWithModal/TemplateUploadButtonsWithModal';
import { getUsersList, removeUser, resetUser } from '../../../../api/services/usersService';
import { USERS_PAGES } from '../../../../constants/route';

import styles from './UsersList.module.css';
import btnStyles from './ButtonUsers/ButtonUsers.module.css';

const TITLE = 'Пользователи';

const BUTTON_EDIT = 'Редактировать';
const BUTTON_CHANGE_PASSWORD = 'Сбросить пароль';
const BUTTON_ADD = 'Добавить';
const BUTTON_CHOOSE = 'Выбрать';
const BUTTON_CANCEL = 'Отменить';
const BUTTON_SELECT_ALL = 'Выбрать все';
const BUTTON_UNSELECT_ALL = 'Отменить выбор';
const BUTTON_DELETE = 'Удалить';

const SEARCH_INPUT = 'Поиск по логину, локации и точке продажи';

const CHOSEN_USER = 'Выбрано';
const TITLE_DOWNLOAD_USER = 'Пакетная обработка пользователей';

const RESET_LABEL = 'По умолчанию';

const MODAL_TITLE = 'Вы уверены что хотите удалить этих пользователей?';
const MODAL_SUCCESS_TITLE = 'Результат удаления пользователей';

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


const showRestoredUsersNotification = (users) => {
    notification.success({
        message: <RestoredTableUser users={ users } />,
        duration: 0,
        placement: 'bottomRight',
        style: { width: '100%' },
    });
};

const showRestoredErrorsNotification = (message) => {
    notification.error({
        message,
        duration: 0,
        placement: 'bottomRight',
    });
};

const defaultSelected = { rowValues: [], rowKeys: [] };

const UserList = ({ matchUrl }) => {
    const history = useHistory();
    const { search } = useLocation();
    const [users, setUsers] = useState([]);
    const [select, setSelect] = useState(false);
    const [selectedItems, setSelectedItems] = useState(defaultSelected);
    const [loadingPage, setLoadingPage] = useState(true);
    const [loadingTableData, setLoadingTableData] = useState(true);
    const [params, setParams] = useState(DEFAULT_PARAMS);
    const [modalIsOpen, setModalIsOpen] = useState(false);

    useBodyClassForSidebar();

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
            loadUsersDataDebounced.cancel();
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
        setSelectedItems(defaultSelected);
    };

    const onAddUser = useCallback(() => history.push(`${matchUrl}${USERS_PAGES.ADD_USER}`), [history, matchUrl]);

    const setSelectedRow = useCallback(() => {
        setSelect((state) => !state);
        clearSelectedItems();
    }, []);

    const selectAll = useCallback(() => {
        if (users.length !== selectedItems.rowValues.length) {
            setSelectedItems({ rowKeys: users.map(({ id }) => id), rowValues: users });
            return;
        } else {
            clearSelectedItems();
        }
    }, [selectedItems.rowValues, users]);

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

    const updateSelected = useCallback((rowKeys, rowValues) => {

        setSelectedItems({ rowKeys, rowValues });
    }, []);

    const rowSelection = useMemo(() => ({
        selectedRowKeys: selectedItems.rowKeys,
        onChange: updateSelected,
    }), [selectedItems.rowKeys, updateSelected]);

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

            const rowKeys = !selectedItems.rowKeys.includes(record.id)
                ? [...selectedItems.rowKeys, record.id]
                : selectedItems.rowKeys.filter((selectedItemId) => selectedItemId !== record.id);
            const rowValues = !selectedItems.rowValues.includes(record)
                ? [...selectedItems.rowValues, record]
                : selectedItems.rowValues.filter((selectedItem) => selectedItem.id !== record.id);

                setSelectedItems({ rowKeys, rowValues });
        }
    }), [select, selectedItems.rowKeys, selectedItems.rowValues, history, matchUrl]);

    const toggleModal = useCallback(() => setModalIsOpen(!modalIsOpen), [modalIsOpen]);

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

    /* no useCallback needed, because function is set to <button /> onClick */
    const linkChangePassword = async () => {
        const requestPromises = selectedItems.rowValues.map(({ personalNumber }) => resetUser(personalNumber));
        setLoadingTableData(true);

        try {
            const response = await Promise.allSettled(requestPromises);
            const { users, errors } = response.reduce((prev, { status, value = {}, reason =  {} }, index) => {
                const { personalNumber } = selectedItems.rowValues[index];
                const { generatedPassword } = value;
                const { message } = reason;
                if (status === 'rejected') {
                    prev.errors.push(message);
                } else {
                    prev.users.push({ personalNumber, generatedPassword });
                }
                return prev;
            }, { users: [], errors: [] });
            if (users.length) {
                showRestoredUsersNotification(users);
            }
            if (errors.length) {
                showRestoredErrorsNotification(errors);
            }
            clearSelectedItems();
        } catch (e) {
            const { message } = e;
            showRestoredErrorsNotification(message);
            console.warn(e);
        }

        setLoadingTableData(false);
    };

    /* no useCallback needed, because function is set to <button /> onClick */
    const linkEdit = () => {
        history.push(`${matchUrl}${USERS_PAGES.EDIT_SOME_USERS}`, { users: selectedItems.rowValues });
    };

    const buttons = [];

    /* no useMemo needed, because almost every render we get new object */
    if (select) {
        const selectedAll = users.length === selectedItems.rowKeys.length;
        buttons.push({
            type: 'primary',
            label: selectedAll ? BUTTON_UNSELECT_ALL : BUTTON_SELECT_ALL,
            onClick: selectAll,
            disabled: loadingTableData
        },
        {
            label: BUTTON_CANCEL,
            onClick: setSelectedRow,
            disabled: loadingTableData
        });
    } else {
        buttons.push(
            { type: 'primary', label: BUTTON_ADD, onClick: onAddUser, disabled: loadingTableData },
            { label: BUTTON_CHOOSE, onClick: setSelectedRow, disabled: loadingTableData },
        );
    }

    /* no useMemo needed, because almost every render we get new object for `buttons` */
    const searchInput = {
        placeholder: SEARCH_INPUT,
        value: params.filterText,
        onChange: handleSearch,
    };

    /* no useMemo needed, because almost every render we get new object for `buttons` */
    const sortingBy = {
        menuItems: DROPDOWN_SORT_MENU,
        onMenuItemClick: changeSort,
        sortBy: params.sortBy,
        withReset: params.sortBy !== '',
    };

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
                resetLabel={ RESET_LABEL }
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
                                { CHOSEN_USER } { selectedItems.rowKeys.length }
                            </span>
                            <button
                                className={ cn(btnStyles.addButton, btnStyles.btnGreen) }
                                disabled={ !selectedItems.rowKeys.length }
                                onClick={ linkChangePassword }
                            >
                                { BUTTON_CHANGE_PASSWORD }
                            </button>
                            <button
                                className={ cn(btnStyles.addButton, btnStyles.btnGreen) }
                                disabled={ !selectedItems.rowKeys.length }
                                onClick={ linkEdit }
                            >
                                { BUTTON_EDIT }
                            </button>
                        </div>
                        <button
                            className={ cn(btnStyles.addButton, btnStyles.btnRed) }
                            disabled={ !selectedItems.rowKeys.length }
                            onClick={ toggleModal }
                        >
                            { BUTTON_DELETE }
                        </button>
                        <TableDeleteModal
                            modalClose={ toggleModal }
                            sourceForRemove={ selectedItems.rowValues }
                            listIdForRemove={ selectedItems.rowKeys }
                            deleteFunction={ removeUser }
                            refreshTable={ refreshTable }
                            modalSuccessTitle={ MODAL_SUCCESS_TITLE }
                            visible={ modalIsOpen }
                            modalTitle={ MODAL_TITLE }
                            listNameKey='personalNumber'
                        />
                    </div>
                ) : (
                    <div className={ styles.section }>
                        <span className={ styles.label }>
                            { TITLE_DOWNLOAD_USER }
                        </span>
                        <div className={ styles.downloadButtons }>
                            <TemplateUploadButtonsWithModal onSuccess={ forceUpdateUsersData } />
                        </div>
                        <DownloadDropDown />
                    </div>
                )}
            </div>
        </div>
    );
};

export default UserList;
