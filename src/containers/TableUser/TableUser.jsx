import React, { useCallback, useState, useEffect, useMemo } from 'react';
import { useHistory, generatePath } from 'react-router-dom';
import debounce from 'lodash/debounce';
import cn from 'classnames';
import { Table } from 'antd';
import Pagination from './Pagination/Pagination';
import EmptyUsersPage from './EmptyUsersPage/EmptyUsersPage';
import ButtonLoadUsers from './ButtonUsers/ButtonLoadUsers';
import ButtonDeleteUsers from './ButtonUsers/ButtonDeleteUsers';
import ButtonAddUser from './ButtonUsers/ButtonAddUser';
import DownloadDropDown from './DownloadDropDown/DownloadDropDown';
import { getUsersList, removeUser, resetUser } from '../../api/services/adminService';
import { ROUTE_ADMIN_USERS } from '../../constants/route';
import { getColumnsForTable } from './TableUserHelper';

import styles from './TableUser.module.css';
import btnStyles from './ButtonUsers/ButtonUsers.module.css';

const TITLE = 'Пользователи';

const BUTTON_EDIT = 'Редактировать';
const BUTTON_CHANGE_PASSWORD = 'Сбросить пароль';
const BUTTON_ADD = 'Добавить';
const BUTTON_LOAD = 'Загрузить';
const BUTTON_CHOOSE = 'Выбрать';
const BUTTON_CANCEL = 'Отменить';
const BUTTON_DELETE = 'Удалить';

const CHOSEN_USER = 'Выбрано';
const TITLE_DOWNLOAD_USER = 'Пакетная обработка пользователей';

const SHOW_ON_PAGE_COUNT = [10, 20, 50];

const TableUser = () => {
    const history = useHistory();
    const [users, setUsers] = useState([]);
    const [select, setSelect] = useState(false);
    const [selectedRowValues, setSelectedRowValues] = useState([]);
    const [selectedRowKeys, setSelectedRowKeys] = useState([]);
    const [currentPage, setCurrentPage] = useState(0);
    const [totalPage, setTotalPage] = useState(10);
    const [showOnPageCount, setShowOnPageCount] = useState(10);
    const [loadingPage, setLoadingPage] = useState(true);
    const [loadingTableData, setLoadingTableData] = useState(true);
    const [filterInput, setFilterInput] = useState({ personalNumber: '', locationName: '', salePointName: '', blocked: '' });

    const getUsersData = useCallback(async (pageNumber, onPageCount, filters) => {
        const { users = [], totalElements } = await getUsersList(pageNumber, onPageCount, filters);
        const usersAddKey = users.map((user, index) => ({ ...user, key: index }));
        const totalPageMath = totalElements === 0 ? 0 : Math.ceil(totalElements / onPageCount);

        setUsers(usersAddKey);
        setTotalPage(totalPageMath);

        return totalPageMath;
    }, []);

    const updateUsersData = useCallback(async (pageNumber, onPageCount, filters) => {
        clearSelectedItems();
        setLoadingTableData(true);

        const totalPageMath = await getUsersData(pageNumber, onPageCount, filters);

        if (pageNumber !== 0 && pageNumber >= totalPageMath) {
            setCurrentPage(totalPageMath - 1);
            await getUsersData(totalPageMath - 1, onPageCount, filters);
        }

        setLoadingPage(false);
        setLoadingTableData(false);
    }, [getUsersData]);

    useEffect(() => {
        // Update data when update page number and count users on page
        updateUsersData(currentPage, showOnPageCount);
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    // eslint-disable-next-line react-hooks/exhaustive-deps
    const getResultsDebounced = useCallback(debounce(updateUsersData, 500), [updateUsersData]);

    const handleSearch = useCallback((dataIndex, value = '') => {
        if (loadingTableData) {
            return;
        }

        const newFilterState = { ...filterInput, [dataIndex]: value };
        setFilterInput(newFilterState);
        getResultsDebounced(currentPage, showOnPageCount, newFilterState);
    }, [currentPage, showOnPageCount, filterInput, getResultsDebounced, loadingTableData]);

    const clearSelectedItems = () => {
        setSelectedRowKeys([]);
        setSelectedRowValues([]);
    };

    const sorted = useCallback(() => {
        setFilterInput((state) => {
            let currentSort = '';
            switch (state.blocked) {
                case false: {
                    currentSort = true;
                    break;
                }
                case true: {
                    currentSort = '';
                    break;
                }
                default: {
                    currentSort = false;
                    break;
                }
            }

            handleSearch('blocked', currentSort);

            return { ...state, blocked: currentSort };
        });
    }, [handleSearch]);

    const columns = useMemo(
        () => getColumnsForTable({ filterInput, handleSearch, sorted }),
        [filterInput, handleSearch, sorted]
    );

    const setSelectedRow = () => {
        setSelect(!select);
        clearSelectedItems();
    };

    const changeShowOnPageCount = useCallback((count) => {
        clearSelectedItems();
        setShowOnPageCount(count);
        updateUsersData(currentPage, count, filterInput);
    }, [updateUsersData, currentPage, filterInput]);

    const onClickNext = useCallback(() => {
        if (currentPage + 1 < totalPage) {
            const newCurrPage = currentPage + 1;
            setCurrentPage(newCurrPage);
            updateUsersData(newCurrPage, showOnPageCount, filterInput);
        }

        clearSelectedItems();
    }, [currentPage, totalPage, filterInput, showOnPageCount, updateUsersData]);

    const onClickPrev = useCallback(() => {
        if (currentPage + 1 > 1) {
            const newCurrPage = currentPage - 1;
            setCurrentPage(newCurrPage);
            updateUsersData(newCurrPage, showOnPageCount, filterInput);
        }

        clearSelectedItems();
    }, [currentPage, filterInput, showOnPageCount, updateUsersData]);

    const forceUpdateUsersData = useCallback(
        () => updateUsersData(currentPage, showOnPageCount, filterInput),
        [currentPage, showOnPageCount, filterInput, updateUsersData]
    );

    if (loadingPage) {
        return (
            <div className={ styles.loadingPage }>
                Загрузка...
            </div>
        );
    }

    if (!users.length && loadingPage) {
        return <EmptyUsersPage />;
    }

    const onSelectChange = (selectedRowKeys, selectedRowItem) => {
        setSelectedRowKeys(selectedRowKeys);
        setSelectedRowValues(selectedRowItem);
    };

    const rowSelection = {
        selectedRowKeys,
        onChange: onSelectChange,
    };

    const linkChangePassword = async () => {
        const requestPromises = selectedRowValues.map(({ personalNumber }) => resetUser(personalNumber));

        try {
            await Promise.all(requestPromises);
            clearSelectedItems();
        } catch (e) {
            console.warn(e);
        }
    };

    const linkEdit = () => {
        const userIds = selectedRowValues.map(({ id }) => id).join();
        history.push(generatePath(ROUTE_ADMIN_USERS.EDIT_SOME_USERS, { userIds }));
    };

    const linkDelete = async () => {
        const requestPromises = selectedRowValues.map(({ id }) => removeUser(id));

        try {
            await Promise.all(requestPromises);
            clearSelectedItems();
            updateUsersData(currentPage, showOnPageCount, filterInput);
        } catch (e) {
            console.warn(e);
        }
    };

    const onRow = (record, item) => ({
        onClick: () => {
            if (!select) {
                history.push(generatePath(ROUTE_ADMIN_USERS.USER_INFO, { userId: record.id }));
                return;
            }

            const newSelectedItemId = !selectedRowKeys.includes(item)
                ? [...selectedRowKeys, item]
                : selectedRowKeys.filter((selectedItemId) => selectedItemId !== item);
            const newSelectedItem = !selectedRowValues.includes(record)
                ? [...selectedRowValues, record]
                : selectedRowValues.filter((selectedItem) => selectedItem.id !== record.id);

            setSelectedRowKeys(newSelectedItemId);
            setSelectedRowValues(newSelectedItem);
        }
    });

    return (
        <div className={ styles.mainBlock }>
            <div className={ styles.header }>
                <div className={ styles.title }>{ TITLE }</div>
                <div className={ styles.button_section }>
                    {select ? (
                        <button
                            className={ cn(btnStyles.addButton, btnStyles.btnGray) }
                            onClick={ setSelectedRow }
                        >
                            { BUTTON_CANCEL }
                        </button>
                    ) : (
                        <>
                            <ButtonAddUser title={ BUTTON_ADD } />
                            <button
                                className={ cn(btnStyles.addButton, btnStyles.btnGray) }
                                onClick={ setSelectedRow }
                            >
                                { BUTTON_CHOOSE }
                            </button>
                        </>
                    )}
                </div>
            </div>
            <Table
                loading={ loadingTableData }
                onRow={ onRow }
                className={ styles.table }
                rowSelection={ select && rowSelection }
                columns={ columns }
                dataSource={ users }
                pagination={ false }
            />
            <Pagination
                currentPage={ totalPage === 0 ? currentPage : currentPage + 1 }
                totalPage={ totalPage }
                loadTableData={ loadingTableData }
                showOnPageCount={ SHOW_ON_PAGE_COUNT }
                onClickNext={ onClickNext }
                onClickPrev={ onClickPrev }
                changeShowOnPageCount={ changeShowOnPageCount }
            />
            <div className={ styles.footer }>
                {select ? (
                    <div className={ cn(styles.section, styles.space) }>
                        <div>
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
                        </div>
                        <div className={ styles.button_section }>
                            <button
                                className={ cn(btnStyles.addButton, btnStyles.btnGreen) }
                                disabled={ !selectedRowKeys.length }
                                onClick={ linkEdit }
                            >
                                { BUTTON_EDIT }
                            </button>
                            <button
                                className={ cn(btnStyles.addButton, btnStyles.btnRed) }
                                disabled={ !selectedRowKeys.length }
                                onClick={ linkDelete }
                            >
                                { BUTTON_DELETE }
                            </button>
                        </div>
                    </div>
                ) : (
                    <div className={ styles.section }>
                        <span className={ styles.label }>
                            { TITLE_DOWNLOAD_USER }
                        </span>
                        <div className={ styles.downloadButtons }>
                            <ButtonLoadUsers
                                id="contained-button-upload-file"
                                label={ BUTTON_LOAD }
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
