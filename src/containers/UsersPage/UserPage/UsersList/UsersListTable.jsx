import React from 'react';
import cn from 'classnames';
import { Empty, Table } from 'antd';
import { ROLES_RU } from '../../../../constants/roles';
import { LOGIN_TYPE } from '../../../../constants/loginTypes';

import styles from './UsersListTable.module.css';

const USER_ACTIVE = 'Активен';
const USER_BLOCKED = 'Заблокирован';
const LOGIN = 'Логин';
const LOCATION = 'Локация';
const SALE_POINT = 'Точка продажи';
const ROLE = 'Роль';
const LOGIN_METHOD = 'Способ входа';
const EMPTY_TABLE = {
    firstMessagePart: 'Мы ничего не нашли.',
    secondMessagePart: 'Измените значение поиска и попробуйте еще раз',
};

const EmptyMessage = (
    <Empty description={ null } >
        <div>{ EMPTY_TABLE.firstMessagePart }</div>
        <div>{ EMPTY_TABLE.secondMessagePart }</div>
    </Empty>
);

const UsersListTable = ({
    loadingData,
    onRow,
    rowSelection,
    dataSource,
    pagination,
    onChangePage,
}) => (
    <div className={ styles.tableWrapper }>
        <Table
            loading={ loadingData }
            onRow={ onRow }
            rowKey="id"
            className={ styles.table }
            rowSelection={ rowSelection }
            dataSource={ dataSource }
            pagination={ pagination }
            showHeader={ false }
            onChange={ onChangePage }
            locale={ { emptyText: EmptyMessage } }
        >
            <Table.Column
                width="20%"
                key="login"
                dataIndex="personalNumber"
                render={ (item) => columnRender(item, LOGIN) }
            />
            <Table.Column
                width="20%"
                key="locationName"
                dataIndex="locationName"
                render={ (item) => columnRender(item, LOCATION) }
            />
            <Table.Column
                width="20%"
                key="salePointName"
                dataIndex="salePointName"
                render={ (item) => columnRender(item, SALE_POINT) }
            />
            <Table.Column
                width="25%"
                key="loginType"
                dataIndex="loginType"
                render={ (item) => columnRender(LOGIN_TYPE[item], LOGIN_METHOD) }
            />
            <Table.Column
                width="15%"
                key="role"
                dataIndex="role"
                render={ (userRole) => columnRender(ROLES_RU[userRole], ROLE) }
            />
            <Table.Column
                width="15%"
                key="status"
                dataIndex="tmpBlocked"
                className={ styles.cellRight }
                render={ columnRenderStatus }
            />
        </Table>
    </div>
);

export default UsersListTable;


const columnRender = (item, name) => (
    <>
        <div className={ styles.tableTitle }>{ name }</div>
        <div className={ styles.tableCell }>{ item }</div>
    </>
);

const columnRenderStatus = (blocked) => (
    <div className={ cn({
        [styles.blocked]: blocked,
        [styles.active]: !blocked
    }) }>
        { blocked ? USER_BLOCKED : USER_ACTIVE }
    </div>
);
