import React, { useCallback, useState, useEffect, useMemo, useRef } from 'react';
import { useHistory, generatePath, useLocation } from 'react-router-dom';
import { Button, TableProps } from 'antd';
import RestoredTableUser from './RestoredTableUser/RestoredTableUser';
import EmptyUsersPage from './EmptyUsersPage/EmptyUsersPage';
import DownloadDropDown from './DownloadDropDown/DownloadDropDown';
import HeaderWithActions, { ButtonProps } from '@components/HeaderWithActions';
import TableDeleteModal from '@components/TableDeleteModal';
import Header from '@components/Header';
import Loading from '@components/Loading';
import UsersListTable from './UsersListTable';
import FiltrationBlock from './FiltrationBlock';
import ActionsDropDown from './ActionsDropDown';
import TemplateUploadButtonsWithModal from '@components/ButtonWithModal/TemplateUploadButtonsWithModal';
import { generateQRCodes, getUsersList, removeUser, resetUser } from '@apiServices/usersService';
import { USERS_PAGES } from '@constants/route';
import { downloadFileFunc, getSearchParamsFromUrl } from '@utils/helper';
import { PaginationConfig } from 'antd/lib/pagination';
import { UserInfo } from '@types';
import { DIRECTION } from '@constants/common';
import { SearchParams } from '@components/HeaderWithActions/types';
import { customNotifications } from '@utils/notifications';
import { LOGIN_TYPES_ENUM } from '@constants/loginTypes';
import { getCurrUserInteractions, InteractionsForOtherUser } from '@constants/permissions';

import styles from './UsersList.module.css';

type UserListProps = {
    matchPath: string;
};

type SelectedItems = {
    rowKeys: number[];
    rowValues: UserInfo[];
};

const TITLE = 'Пользователи';

const RESET_LABEL = 'По умолчанию';

const BUTTON_ADD = 'Добавить';
const BUTTON_CHOOSE = 'Выбрать';
const BUTTON_CANCEL = 'Отменить';
const BUTTON_SELECT_ALL = 'Выбрать все';
const BUTTON_UNSELECT_ALL = 'Отменить выбор';
const BUTTON_DELETE = 'Удалить';

const SEARCH_INPUT = 'Поиск по логину, локации и точке продажи';

const CHOSEN_USER = 'Выбрано';
const TITLE_DOWNLOAD_USER = 'Пакетная обработка пользователей';

const MODAL_TITLE = 'Вы уверены что хотите удалить этих пользователей?';
const MODAL_SUCCESS_TITLE = 'Результат удаления пользователей';

const locale: PaginationConfig['locale'] = {
    items_per_page: '',
    prev_page:      'Назад',
    next_page:      'Вперед',
    jump_to:        'Перейти',
    prev_5:         'Предыдущие 5',
    next_5:         'Следующие 5',
    prev_3:         'Предыдущие 3',
    next_3:         'Следующие 3',
};

const DEFAULT_PARAMS: SearchParams = {
    pageNo: 0,
    pageSize: 10,
    sortBy: '',
    direction: DIRECTION.ASC,
    filterText: '',
    clientAppCode: '',
    parentUserName: '',
    parentId: '',
    loginType: '',
    totalElements: 0,
};

// eslint-disable-next-line no-unused-vars, @typescript-eslint/no-unused-vars
const getURLSearchParams = ({ totalElements, parentId, ...rest }: Record<string, string | number>) =>
    new URLSearchParams(rest as Record<string, string>).toString();

const DROPDOWN_SORT_MENU = [
    { name: 'personalNumber', label: 'По логину' },
    { name: 'locationName', label: 'По локации' },
    { name: 'salePointName', label: 'По точке продажи' },
];


type RestoredUser = {
    personalNumber: UserInfo['personalNumber'];
    generatedPassword: string;
};

const showRestoredUsersNotification = (users: RestoredUser[]) => {
    customNotifications.success({
        message: <RestoredTableUser users={users} />,
        style: { width: '100%' },
    });
};

const showRestoredErrorsNotification = (message: React.ReactNode) => {
    customNotifications.error({
        message,
    });
};

const IGNORE_SEARCH_PARAMS = ['parentUserName', 'clientAppCode'];
const defaultSelected: SelectedItems = { rowValues: [], rowKeys: [] };

const UserList: React.FC<UserListProps> = ({ matchPath }) => {
    const history = useHistory();
    const { search } = useLocation();
    const [users, setUsers] = useState<UserInfo[]>([]);
    const [select, setSelect] = useState(false);
    const [selectedItems, setSelectedItems] = useState<SelectedItems>(defaultSelected);
    const [loadingPage, setLoadingPage] = useState(true);
    const [loadingTableData, setLoadingTableData] = useState(true);
    const [params, setParams] = useState(DEFAULT_PARAMS);
    const userInteractions = useRef({} as InteractionsForOtherUser);
    const { current: permissions = {} as InteractionsForOtherUser } = userInteractions;
    const canSelectUsers = users.filter(({ role }) => (permissions[role] || {}).canSelectUserInTable);

    const loadUsersData = useCallback(async (searchParams: SearchParams = DEFAULT_PARAMS) => {
        const urlSearchParams = getURLSearchParams(searchParams);

        setLoadingTableData(true);

        try {
            const { users = [], totalElements, pageNo } = await getUsersList(urlSearchParams);
            /* use `replace` instead of `push` for correct work `history.goBack()` */
            history.replace(`${matchPath}?${urlSearchParams}`);
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

    useEffect(() => {
        (async () => {
            await loadUsersData(getSearchParamsFromUrl(search, DEFAULT_PARAMS, IGNORE_SEARCH_PARAMS));
            setLoadingPage(false);
        })();

        // TODO: Вынести настройки текущего пользователя в контекст приложения
        userInteractions.current = getCurrUserInteractions();
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const clearSelectedItems = useCallback(() => {
        setSelectedItems(defaultSelected);
    }, []);

    const onAddUser = () => history.push(`${matchPath}${USERS_PAGES.ADD_USER}`);

    const setSelectedRow = () => {
        setSelect((state) => !state);
        clearSelectedItems();
    };

    const selectAll = () => {
        if (canSelectUsers.length !== selectedItems.rowValues.length) {
            setSelectedItems({ rowKeys: canSelectUsers.map(({ id }) => id), rowValues: canSelectUsers });
            return;
        }

        clearSelectedItems();
    };

    const onChangePage: TableProps<UserInfo>['onChange'] = ({ current, pageSize }) => {
        loadUsersData({
            ...params,
            pageNo: current! - 1,
            pageSize: (pageSize as number),
        });
    };

    const pagination: TableProps<UserInfo>['pagination'] = useMemo(() => ({
        current: (params.pageNo as number) + 1,
        total: params.totalElements as number,
        pageSize: params.pageSize as number,
        locale,
        showQuickJumper: true,
        showSizeChanger: true,
    }), [params.pageNo, params.pageSize, params.totalElements]);

    const updateSelected = useCallback((rowKeys: React.Key[], rowValues: UserInfo[]) => {
        setSelectedItems({ rowKeys: rowKeys as number[], rowValues });
    }, []);

    const rowSelection: TableProps<UserInfo>['rowSelection'] = useMemo(() => ({
        selectedRowKeys: selectedItems.rowKeys,
        onChange: updateSelected,
        getCheckboxProps: (record) => ({
            disabled: !(permissions[record.role] || {}).canSelectUserInTable,
        }),
    }), [selectedItems.rowKeys, updateSelected, permissions]);

    const refreshTable = () => {
        loadUsersData(params);
        clearSelectedItems();
    };

    const onRow: TableProps<UserInfo>['onRow'] = (record) => ({
        onClick: () => {
            if (!select) {
                history.push(generatePath(`${matchPath}${USERS_PAGES.USER_INFO}`, { userId: record.id }));
                return;
            }

            if (!(permissions[record.role] || {}).canSelectUserInTable) {
                return;
            }

            const rowKeys = !selectedItems.rowKeys.includes(record.id)
                ? [...selectedItems.rowKeys, record.id]
                : selectedItems.rowKeys.filter((selectedItemId) => selectedItemId !== record.id);
            const rowValues = !selectedItems.rowValues.includes(record)
                ? [...selectedItems.rowValues, record]
                : selectedItems.rowValues.filter((selectedItem) => selectedItem.id !== record.id);

            setSelectedItems({ rowKeys, rowValues });
        },
    });

    const onClickResetPass = useCallback(async () => {
        const requestPromises = selectedItems.rowValues.map(({ personalNumber }) => resetUser(personalNumber));
        setLoadingTableData(true);

        try {
            const response = await Promise.allSettled(requestPromises);
            const { users, errors } = response.reduce<{ users: RestoredUser[]; errors: string[]; }>((prev, result, index) => {
                if (result.status === 'rejected') {
                    const { message } = result.reason;
                    prev.errors.push(message);
                } else {
                    const { personalNumber } = selectedItems.rowValues[index];
                    const { generatedPassword } = result.value;
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
    }, [clearSelectedItems, selectedItems.rowValues]);

    if (loadingPage) {
        return (
            <div className={styles.loadingPage}>
                <Loading />
            </div>
        );
    }

    if (
        !users.length &&
        !loadingPage &&
        !loadingTableData &&
        !params.filterText &&
        !params.pageNo &&
        !params.clientAppCode &&
        !params.parentUserName &&
        !params.loginType
    ) {
        return <EmptyUsersPage refreshTable={refreshTable} />;
    }

    const linkEdit = () => {
        history.push(`${matchPath}${USERS_PAGES.EDIT_SOME_USERS}`, { users: selectedItems.rowValues });
    };

    const buttons: ButtonProps[] = [];

    if (select) {
        const selectedAll = canSelectUsers.length === selectedItems.rowKeys.length;
        buttons.push({
            type: 'primary',
            label: selectedAll ? BUTTON_UNSELECT_ALL : BUTTON_SELECT_ALL,
            onClick: selectAll,
            disabled: loadingTableData,
        },
        {
            label: BUTTON_CANCEL,
            onClick: setSelectedRow,
            disabled: loadingTableData,
        });
    } else {
        buttons.push(
            { type: 'primary', label: BUTTON_ADD, onClick: onAddUser, disabled: loadingTableData },
            { label: BUTTON_CHOOSE, onClick: setSelectedRow, disabled: loadingTableData },
        );
    }


    const onChangeFilter = (requestOptions: SearchParams) => {
        const newParams: SearchParams = { ...requestOptions, pageNo: 0 };

        IGNORE_SEARCH_PARAMS.forEach(key => {
            if (!newParams[key]) {
                delete newParams[key];
            }
        });
        loadUsersData(newParams);
    };

    const generateQR = async () => {
        try {
            const file = await generateQRCodes({
                clientAppCode: params.clientAppCode as string,
                parentId: params.parentId as number,
                userIds: selectedItems.rowKeys,
            });
            downloadFileFunc(URL.createObjectURL(file), 'QR-codes', 'zip');
        } catch (err) {
            console.error(err);
        }
    };

    return (
        <div className={styles.mainBlock}>
            <Header buttonBack={false} />
            <HeaderWithActions
                title={TITLE}
                buttons={buttons}
                loading={loadingTableData}
                resetLabel={RESET_LABEL}
                params={params}
                setParams={setParams}
                loadData={loadUsersData}
                onChangeSort={clearSelectedItems}
                inputPlaceholder={SEARCH_INPUT}
                menuItems={DROPDOWN_SORT_MENU}
                enableAsyncSort
            />
            <FiltrationBlock
                params={params}
                onChangeFilter={onChangeFilter}
                disabledAllFields={loadingTableData}
            />
            <UsersListTable
                loadingData={loadingTableData}
                onRow={onRow}
                rowSelection={(select && rowSelection) || undefined}
                dataSource={users}
                pagination={pagination}
                onChangePage={onChangePage}
            />
            <div className={styles.footer}>
                {select ? (
                    <div className={styles.space}>
                        <div className={styles.section}>
                            <span className={styles.label}>
                                {CHOSEN_USER} {selectedItems.rowKeys.length}
                            </span>
                            <ActionsDropDown
                                selectedItems={selectedItems}
                                onClickResetPass={onClickResetPass}
                                linkEdit={linkEdit}
                                generateQR={generateQR}
                                generateQRDisabled={
                                    params.loginType !== LOGIN_TYPES_ENUM.DIRECT_LINK ||
                                    !params.clientAppCode ||
                                    !params.parentUserName
                                }
                            />
                        </div>
                        <TableDeleteModal<UserInfo>
                            sourceForRemove={selectedItems.rowValues}
                            listIdForRemove={selectedItems.rowKeys}
                            deleteFunction={removeUser}
                            refreshTable={refreshTable}
                            modalSuccessTitle={MODAL_SUCCESS_TITLE}
                            modalTitle={MODAL_TITLE}
                            listNameKey="personalNumber"
                        >
                            <Button
                                type="primary"
                                danger
                                disabled={!selectedItems.rowKeys.length}
                            >
                                {BUTTON_DELETE}
                            </Button>
                        </TableDeleteModal>
                    </div>
                ) : (
                    <div className={styles.section}>
                        <span className={styles.label}>
                            {TITLE_DOWNLOAD_USER}
                        </span>
                        <div className={styles.downloadButtons}>
                            <TemplateUploadButtonsWithModal onSuccess={refreshTable} />
                        </div>
                        <DownloadDropDown />
                    </div>
                )}
            </div>
        </div>
    );
};

export default UserList;