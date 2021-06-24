import React from 'react';
import cn from 'classnames';
import { Empty, Table, TableProps } from 'antd';
import { UserInfo } from '@types';
import ROLES, { ROLES_RU } from '@constants/roles';
import { LOGIN_TYPE, LoginTypes } from '@constants/loginTypes';

import styles from './UsersListTable.module.css';

type UsersListTableProps = {
    loadingData: boolean;
    onRow: TableProps<UserInfo>['onRow'];
    rowSelection?: TableProps<UserInfo>['rowSelection'];
    dataSource: UserInfo[];
    pagination: TableProps<UserInfo>['pagination'];
    onChangePage: TableProps<UserInfo>['onChange'];
};

const USER_ACTIVE = 'Активен';
const USER_BLOCKED = 'Заблокирован';
const LOGIN = 'Логин';
const LOCATION = 'Локация';
const SALE_POINT = 'Точка продажи';
const ROLE = 'Роль';
const LOGIN_METHOD = 'Способ входа';
const PARTNER = 'Партнёр';
const EMPTY_TABLE = {
    firstMessagePart: 'Мы ничего не нашли.',
    secondMessagePart: 'Измените значение поиска и попробуйте еще раз',
};

const EmptyMessage = (
    <Empty description={null} >
        <div>{EMPTY_TABLE.firstMessagePart}</div>
        <div>{EMPTY_TABLE.secondMessagePart}</div>
    </Empty>
);

const UsersListTable: React.FC<UsersListTableProps> = ({
    loadingData,
    onRow,
    rowSelection,
    dataSource,
    pagination,
    onChangePage,
}) => (
    <div className={styles.tableWrapper}>
        <Table<UserInfo>
            loading={loadingData}
            onRow={onRow}
            rowKey="id"
            className={styles.table}
            rowSelection={rowSelection}
            dataSource={dataSource}
            pagination={pagination}
            showHeader={false}
            onChange={onChangePage}
            locale={{ emptyText: EmptyMessage }}
        >
            <Table.Column
                width="15%"
                key="login"
                dataIndex="personalNumber"
                render={(item) => columnRender(item, LOGIN)}
            />
            <Table.Column
                width="15%"
                key="locationName"
                dataIndex="locationName"
                render={(item) => columnRender(item, LOCATION)}
            />
            <Table.Column
                width="15%"
                key="salePointName"
                dataIndex="salePointName"
                render={(item) => columnRender(item, SALE_POINT)}
            />
            <Table.Column
                width="15%"
                key="parentUserName"
                dataIndex="parentUserName"
                render={(item) => columnRender(item || <i>Нет партнёра</i>, PARTNER)}
            />
            <Table.Column
                width="15%"
                key="loginType"
                dataIndex="loginType"
                render={(item: LoginTypes) => columnRender(LOGIN_TYPE[item], LOGIN_METHOD)}
            />
            <Table.Column
                width="10%"
                key="role"
                dataIndex="role"
                render={(userRole: ROLES) => columnRender(ROLES_RU[userRole], ROLE)}
            />
            <Table.Column
                width="15%"
                key="status"
                dataIndex="tmpBlocked"
                className={styles.cellRight}
                render={columnRenderStatus}
            />
        </Table>
    </div>
);

export default UsersListTable;


const columnRender = (item: string, name: string) => (
    <>
        <div className={styles.tableTitle}>{name}</div>
        <div className={styles.tableCell}>{item}</div>
    </>
);

const columnRenderStatus = (blocked: UserInfo['tmpBlocked']) => (
    <div className={cn({
        [styles.blocked]: blocked,
        [styles.active]: !blocked,
    })}>
        {blocked ? USER_BLOCKED : USER_ACTIVE}
    </div>
);
