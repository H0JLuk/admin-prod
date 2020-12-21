import React, { useMemo } from 'react';
import cn from 'classnames';
import { Pagination, Select, Table } from 'antd';

import styles from './UsersListTable.module.css';

const USER_ACTIVE = 'Активен';
const USER_BLOCKED = 'Заблокирован';
const LOGIN = 'Логин';
const LOCATION = 'Локация';
const SALE_POINT = 'Точка продажи';
const PAGE_SIZES = [10, 20, 50, 100];

const UsersListTable = ({
    loadingData,
    onRow,
    rowSelection,
    dataSource,
    pagination,
    onChangePage,
    onChangePageSize,
}) => {
    const pageSizes = useMemo(() => {
        if (!PAGE_SIZES.includes(Number(pagination.pageSize))) {
            return [...PAGE_SIZES, pagination.pageSize].sort((a, b) => a - b);
        }

        return PAGE_SIZES;
    }, [pagination.pageSize]);

    return (
        <div className={ styles.tableWrapper }>
            <Table
                loading={ loadingData }
                onRow={ onRow }
                rowKey="id"
                className={ styles.table }
                rowSelection={ rowSelection }
                dataSource={ dataSource }
                pagination={ false }
                showHeader={ false }
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
            <div className={ styles.paginationWrapper }>
                <Pagination
                    { ...pagination }
                    className={ styles.pagination }
                    onChange={ onChangePage }
                />
                <Select
                    className={ styles.pageSizes }
                    defaultValue={ PAGE_SIZES[0] }
                    onChange={ onChangePageSize }
                    value={ pagination.pageSize }
                >
                    {pageSizes.map((size) => (
                        <Select.Option key={ size }>{ size }</Select.Option>
                    ))}
                </Select>
            </div>
        </div>
    );
};

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
