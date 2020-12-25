import React from 'react';
import cn from 'classnames';
import { Table } from 'antd';

import styles from './UsersListTable.module.css';

const USER_ACTIVE = 'Активен';
const USER_BLOCKED = 'Заблокирован';
const LOGIN = 'Логин';
const LOCATION = 'Локация';
const SALE_POINT = 'Точка продажи';

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
        >
            <Table.Column
                width="25%"
                key="login"
                dataIndex="personalNumber"
                render={ (item) => columnRender(item, LOGIN) }
            />
            <Table.Column
                width="35%"
                key="locationName"
                dataIndex="locationName"
                render={ (item) => columnRender(item, LOCATION) }
            />
            <Table.Column
                width="25%"
                key="salePointName"
                dataIndex="salePointName"
                render={ (item) => columnRender(item, SALE_POINT) }
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
