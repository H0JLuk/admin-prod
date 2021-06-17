/* eslint-disable react/display-name */
import React, { useEffect, useState } from 'react';
import {
    useTable,
    usePagination,
    CellProps,
    PluginHook,
    TableOptions,
    TableInstance,
    UsePaginationInstanceProps,
} from 'react-table';
import { Select, Spin, Collapse } from 'antd';
import CssBaseline from '@material-ui/core/CssBaseline';
import MaUTable from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';

import { getReqOptions } from '@apiServices';
import ReactJson from 'react-json-view';
import { baseUrl } from '../../api/apiClient';
import AuditFilter, { SubmitCallbackValues } from './AuditFilter';
import { getClientAppList } from '@apiServices/clientAppService';
import { DIRECTION } from '@constants/common';
import { DefaultPaginationResponse } from '@types';

import styles from './AuditPage.module.css';

export type AuditPageAppType = {
    label: string;
    value: string;
};

type TableInstanceProps = {
    columns: typeof columns;
    manualPagination: boolean;
    pageCount: number;
    // defaultColumn: typeof defaultColumn;
    autoResetPage: boolean;
    autoResetExpanded: boolean;
    autoResetGroupBy: boolean;
    autoResetSelectedRows: boolean;
    autoResetSortBy: boolean;
    autoResetRowState: boolean;
};

type TableInstanceFunc = (
    options: TableOptions<Record<string, any>> & TableInstanceProps,
    ...plugins: Array<PluginHook<any>>
) => TableInstance & UsePaginationInstanceProps<Record<string, any>> & {
    state: {
        pageIndex: number;
        pageSize: number;
    };
};

type AuditEvent = {
    id: number;
    clientAppCode: string;
    details: string;
    happenedAt: string;
    success: boolean;
    type: string;
    userAgent: string;
    userIp: string;
    userLogin: string;
};

type AuditEventsResponse = DefaultPaginationResponse & {
    events: AuditEvent[];
};

const initialState: Omit<AuditEventsResponse, 'message' | 'status'> = {
    events: [],
    pageNo: 0,
    totalElements: 0,
    totalPages: 0,
};

const sortItems = [
    {
        label: 'Тип события',
        value: 'type'
    },
    {
        label: 'Приложение',
        value: 'clientAppCode',
    },
    {
        label: 'Пользователь',
        value: 'userLogin'
    },
    {
        label: 'IP пользователя',
        value: 'userIp'
    },
    {
        label: 'Дата',
        value: 'happenedAt'
    },
    {
        label: 'Статус события',
        value: 'success'
    }
];

const sortDirectionItems = [
    {
        label: 'По возрастанию',
        value: DIRECTION.ASC
    },
    {
        label: 'По убыванию',
        value: DIRECTION.DESC
    },
];

const columns = [
    {
        Header: 'ID',
        accessor: 'id',
    },
    {
        Header: 'Тип события',
        accessor: 'type',
    },
    {
        Header: 'Приложение',
        accessor: 'clientAppCode',
    },
    {
        Header: 'Пользователь',
        accessor: 'userLogin',
    },
    {
        Header: 'IP пользователя',
        accessor: 'userIp',
    },
    {
        Header: 'Дата',
        accessor: 'happenedAt',
    },
    {
        Header: 'Детали',
        accessor: 'details',
        Cell: ({ row: { original: { details } } }: CellProps<Record<string, any>>) => details && (<ReactJson
            src={JSON.parse(details)}
            name={null}
            enableClipboard={false}
            displayObjectSize={false}
            displayDataTypes={false}
            collapsed={true}
            iconStyle="circle"
        />
        )
    },
    {
        Header: 'Статус события',
        accessor: 'success',
        Cell: ({ row: { original: { success } } }: CellProps<Record<string, any>>) => <span>{success ? 'Успешно' : 'Ошибка'}</span>
    },
];


const AuditPage = () => {

    const [data, setData] = useState(initialState);
    const [applications, setApplications] = useState<AuditPageAppType[]>([]);
    const [sortItem, setSortItem] = useState('happenedAt');
    const [sortDirection, setSortDirection] = useState(DIRECTION.DESC);
    const [loading, setLoading] = useState(false);
    const [filtersObject, setFiltersObject] = useState({} as SubmitCallbackValues);
    const { events, totalPages } = data;

    const skipPageResetRef = React.useRef<boolean>();

    useEffect(() => {
        // After the table has updated, always remove the flag
        skipPageResetRef.current = false;
    });

    const tableInstance = (useTable as unknown as TableInstanceFunc)({
        columns,
        data: events,
        manualPagination: true,
        // defaultColumn,
        pageCount: totalPages,
        autoResetPage: !skipPageResetRef.current,
        autoResetExpanded: !skipPageResetRef.current,
        autoResetGroupBy: !skipPageResetRef.current,
        autoResetSelectedRows: !skipPageResetRef.current,
        autoResetSortBy: !skipPageResetRef.current,
        autoResetRowState: !skipPageResetRef.current,
    }, usePagination);

    const {
        getTableProps,
        getTableBodyProps,
        headerGroups,
        rows,
        prepareRow,
        canPreviousPage,
        canNextPage,
        pageOptions,
        pageCount,
        gotoPage,
        nextPage,
        previousPage,
        setPageSize,
        state: { pageIndex, pageSize },
    } = tableInstance;

    useEffect(() => {
        (async () => {
            const { list = [] } = await getClientAppList();
            const appOptions = list.map(({ displayName: label, code: value }) => ({ label, value }));
            setApplications([{ label: 'admin', value: 'admin' }, ...appOptions]);
        })();
    }, []);

    useEffect(() => {
        async function fetchData(pageSize: string, pageNo: string, mappedFilters = {}) {
            setLoading(true);
            const url = new URL(`${baseUrl}/admin/audit/events`);
            url.search = new URLSearchParams({ pageNo, pageSize, sortBy: sortItem, direction: sortDirection, ...mappedFilters }).toString();
            const response = await fetch(url.toString(), getReqOptions());
            const json: AuditEventsResponse = await response.json();
            //Без данного ограничения обновление props'ов Таблички приводит к сбросу внутреннего state'а
            skipPageResetRef.current = true;
            setData(json);
            setLoading(false);
        }
        fetchData(String(pageSize), String(pageIndex), filtersObject);
    }, [pageIndex, pageSize, filtersObject, sortDirection, sortItem]);

    return (
        <div className={styles.container}>
            <Spin tip="Загрузка..." spinning={loading}>
                <Collapse accordion>
                    <Collapse.Panel header="Фильтры" key="1">
                        <AuditFilter submit={setFiltersObject} applications={applications} />
                    </Collapse.Panel>
                </Collapse>
                <CssBaseline />
                <div className={styles.sort}>
                    <div>
                        Сортировать по: {' '}
                        <Select onSelect={setSortItem} value={sortItem} className={styles.sortSelect} options={sortItems} />
                    </div>
                    <div>
                        Направление сортировки: {' '}
                        <Select onSelect={setSortDirection} value={sortDirection} className={styles.sortSelect} options={sortDirectionItems} />
                    </div>
                </div>
                <MaUTable {...getTableProps()}>

                    <TableHead >
                        {
                            headerGroups.map((headerGroup, index) => (
                                <TableRow {...headerGroup.getHeaderGroupProps()} key={index}>
                                    {
                                        headerGroup.headers.map((column, index) => (
                                            <TableCell {...column.getHeaderProps()} key={index}>
                                                {column.render('Header')}
                                            </TableCell>
                                        ))}
                                </TableRow>
                            ))}
                    </TableHead>
                    <TableBody {...getTableBodyProps()}>
                        {
                            rows.map((row, index) => {
                                prepareRow(row);
                                return (
                                    <TableRow {...row.getRowProps()} key={index}>
                                        {
                                            row.cells.map((cell, index) => (
                                                <TableCell {...cell.getCellProps()} key={index}>
                                                    {cell.render('Cell')}
                                                </TableCell>
                                            ))}
                                    </TableRow>
                                );
                            })}
                    </TableBody>
                </MaUTable>
                <div className="pagination">
                    <button onClick={() => gotoPage(0)} disabled={!canPreviousPage}>&lt;&lt;</button>&nbsp;
                    <button onClick={() => previousPage()} disabled={!canPreviousPage}>&lt;</button>&nbsp;
                    <button onClick={() => nextPage()} disabled={!canNextPage}>&gt;</button>&nbsp;
                    <button onClick={() => gotoPage(pageCount - 1)} disabled={!canNextPage}>&gt;&gt;</button>&nbsp;
                    <span>{`Страница ${pageIndex + 1} из ${pageOptions.length} `}</span>
                    <span>
                        | Перейти на страницу:&nbsp;
                        <input
                            type="number"
                            defaultValue={pageIndex + 1}
                            onChange={e => gotoPage(e.target.value ? Number(e.target.value) - 1 : 0)}
                            style={{ width: '100px' }}
                        />
                    </span>&nbsp;
                    <select
                        value={pageSize}
                        onChange={e => setPageSize(Number(e.target.value))}
                    >
                        {[10, 20, 30, 40, 50].map(pageSize => (
                            <option key={pageSize} value={pageSize}>{pageSize}</option>
                        ))}
                    </select>
                </div>
            </Spin>
        </div>
    );
};

export default AuditPage;
