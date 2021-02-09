import React, { useEffect, useState, useCallback } from 'react';
import { useTable, usePagination } from 'react-table';
import { Select, Spin, Collapse } from 'antd';
import CssBaseline from '@material-ui/core/CssBaseline';
import MaUTable from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';

import { getReqOptions } from '../../api/services';
import ReactJson from 'react-json-view';
import { baseUrl } from '../../api/apiClient';
import AuditFilter from './AuditFilter';
import { getClientAppList } from '../../api/services/clientAppService';

import styles from './AuditPage.module.css';

const initialState = { events: [], totalElements: 0, totalPages: 0,
    numberOfElements: 0, size: 20, number: 0 };

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
        value: 'ASC'
    },
    {
        label: 'По убыванию',
        value: 'DESC'
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
        Cell: ({ row: { original: { details } } }) => details && (<ReactJson
            src={ JSON.parse(details) }
            name={ null }
            enableClipboard={ false }
            displayObjectSize={ false }
            displayDataTypes={ false }
            collapsed={ true }
            iconStyle='circle'
        />
        )
    },
    {
        Header: 'Статус события',
        accessor: 'success',
        Cell: ({ row: { original: { success } } }) => <span>{success ? 'Успешно' : 'Ошибка'}</span>
    },
];

const defaultColumn = {
    Filter: () => null,
};

const AuditPage = () => {

    const [data, setData] = useState(initialState);
    const [applications, setApplications] = useState([]);
    const [sortItem, setSortItem] = useState('happenedAt');
    const [sortDirection, setSortDirection] = useState('DESC');
    const [loading, setLoading] = useState(false);
    const [filtersObject, setFiltersObject] = useState({});
    const { events, totalPages } = data;

    const skipPageResetRef = React.useRef();

    useEffect(() => {
        // After the table has updated, always remove the flag
        skipPageResetRef.current = false;
    });

    const tableInstance = useTable({
        columns,
        data: events,
        initialState: { pageIndex: 0 },
        manualPagination: true,
        pageCount: totalPages,
        defaultColumn,
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
            const { clientApplicationDtoList: appList = [] } = await getClientAppList();
            const appOptions = appList.map(({ displayName: label, code: value }) => ({ label, value }));
            setApplications([{ label: 'admin', value: 'admin' }, ...appOptions]);
        })();
    }, []);

    useEffect(() => {
        async function fetchData(pageSize, pageNo, mappedFilters = {}) {
            setLoading(true);
            const url = new URL(`${baseUrl}/admin/audit/events`);
            url.search = new URLSearchParams({ pageNo, pageSize, sortBy: sortItem, direction: sortDirection, ...mappedFilters }).toString();
            const response = await fetch(url.toString(), getReqOptions());
            const json = await response.json();
            //Без данного ограничения обновление props'ов Таблички приводит к сбросу внутреннего state'а
            skipPageResetRef.current = true;
            setData(json);
            setLoading(false);
        }
        fetchData(pageSize, pageIndex, filtersObject);
    }, [pageIndex, pageSize, filtersObject, sortDirection, sortItem]);

    const onSubmitAuditFilter = useCallback((filtersData = {}) => {
        setFiltersObject(filtersData);
    }, []);

    return (
        <div className={ styles.container }>
            <Spin tip="Загрузка..." spinning={ loading }>
                <Collapse accordion>
                    <Collapse.Panel header="Фильтры" key="1">
                        <AuditFilter submit={ onSubmitAuditFilter } applications={ applications } />
                    </Collapse.Panel>
                </Collapse>
                <CssBaseline />
                <div className={ styles.sort }>
                    <div>
                        Сортировать по: {' '}
                        <Select onSelect={ setSortItem } value={ sortItem } className={ styles.sortSelect } options={ sortItems } />
                    </div>
                    <div>
                        Направление сортировки: {' '}
                        <Select onSelect={ setSortDirection } value={ sortDirection } className={ styles.sortSelect } options={ sortDirectionItems } />
                    </div>
                </div>
                <MaUTable { ...getTableProps() }>

                    <TableHead >
                    {
                        headerGroups.map(headerGroup => (
                            <TableRow { ...headerGroup.getHeaderGroupProps() }>
                                {
                                    headerGroup.headers.map(column => (
                                        <TableCell { ...column.getHeaderProps() }>
                                            {column.render('Header')}
                                        </TableCell>
                                    ))}
                            </TableRow>
                        ))}
                    </TableHead>
                    <TableBody { ...getTableBodyProps() }>
                    {
                        rows.map(row => {
                            prepareRow(row);
                            return (
                                <TableRow { ...row.getRowProps() }>
                                    {
                                        row.cells.map(cell => {
                                            return (
                                                <TableCell { ...cell.getCellProps() }>
                                                    {cell.render('Cell')}
                                                </TableCell>
                                            );
                                        })}
                                </TableRow>
                            );
                        })}
                    </TableBody>
                </MaUTable>
                <div className="pagination">
                    <button onClick={ () => gotoPage(0) } disabled={ !canPreviousPage }>&lt;&lt;</button>&nbsp;
                    <button onClick={ () => previousPage() } disabled={ !canPreviousPage }>&lt;</button>&nbsp;
                    <button onClick={ () => nextPage() } disabled={ !canNextPage }>&gt;</button>&nbsp;
                    <button onClick={ () => gotoPage(pageCount - 1) } disabled={ !canNextPage }>&gt;&gt;</button>&nbsp;
                    <span>{`Страница ${pageIndex + 1} из ${pageOptions.length} `}</span>
                    <span>
                        | Перейти на страницу:&nbsp;
                        <input
                            type="number"
                            defaultValue={ pageIndex + 1 }
                            onChange={ e => gotoPage(e.target.value ? Number(e.target.value) - 1 : 0) }
                            style={ { width: '100px' } }
                        />
                    </span>&nbsp;
                    <select
                        value={ pageSize }
                        onChange={ e => setPageSize(Number(e.target.value)) }
                    >
                        {[10, 20, 30, 40, 50].map(pageSize => (
                            <option key={ pageSize } value={ pageSize }>{pageSize}</option>
                        ))}
                    </select>
                </div>
            </Spin>
        </div>
    );
};

export default AuditPage;
