import React, { useEffect, useState, useMemo } from 'react';
import styles from './AuditPage.module.css';
import { useTable, usePagination, useFilters } from 'react-table';
// import DatePicker from "react-datepicker";
import { getReqOptions } from '../../api/services';
import ReactJson from 'react-json-view';
import SelectColumnFilter from './SelectColumnFilter';
import { baseUrl } from '../../api/apiClient';

import CssBaseline from '@material-ui/core/CssBaseline';
import MaUTable from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
const initialState = { events: [], totalElements: 0, totalPages: 0,
    numberOfElements: 0, size: 20, number: 0 };

// const DATE_FORMAT = 'dd.MM.yyyy';

// const a = (<DatePicker
//     className={ styles.datepicker }
//     dateFormat={ DATE_FORMAT }
//     selected={ endDate }
//     onChange={ date => { this.handleChangeDate(date, false); } }
// />)

const AuditPage = () => {

    const [data, setData] = useState(initialState);
    const { events, totalPages } = data;
    const defaultColumn = useMemo(
        () => ({
            Filter: () => null,
        }),
        []
    );

    const columns = useMemo(
        () => [
            {
                Header: 'ID',
                accessor: 'id',
            },
            {
                Header: 'Тип события',
                accessor: 'type',
                Filter: SelectColumnFilter,
                filter: 'includes',
            },
            {
                Header: 'Пользователь',
                accessor: 'userLogin',
            },
            {
                Header: 'ip пользователя',
                accessor: 'userIp',
            },
            {
                Header: 'Время',
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
                Header: 'Успешно',
                accessor: 'success',
                Cell: ({ row: { original: { success } } }) => <span>{success ? 'Успешно' : 'Не успешно'}</span>
            },
        ],
        []
    );
    const skipPageResetRef = React.useRef();

    useEffect(() => {
        // After the table has updated, always remove the flag
        skipPageResetRef.current = false;
    });

    const tableInstance = useTable({ columns, data: events, initialState: { pageIndex: 0 }, manualPagination: true,
        pageCount: totalPages, defaultColumn,
        autoResetPage: !skipPageResetRef.current,
        autoResetExpanded: !skipPageResetRef.current,
        autoResetGroupBy: !skipPageResetRef.current,
        autoResetSelectedRows: !skipPageResetRef.current,
        autoResetSortBy: !skipPageResetRef.current,
        autoResetFilters: !skipPageResetRef.current,
        autoResetRowState: !skipPageResetRef.current,
    }, useFilters, usePagination);
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
        state: { pageIndex, pageSize, filters },
    } = tableInstance;


    const filtersHash = useMemo(() => filters.reduce((sum, cur) => sum + cur.value, ''), [filters]);
    const filtersObject = useMemo(() => filters.map(el => ({ [el.id]: el.value }))
        .reduce((result, cur) => ({ ...result, ...cur }), {}), [filtersHash]);
    // console.log(filtersHash);

    useEffect(() => {
        async function fetchData(pageSize, pageNo, mappedFilters = {}) {
            const url = new URL(`${baseUrl}/admin/audit/events`);
            url.search = new URLSearchParams({ pageNo, pageSize, ...mappedFilters }).toString();
            const response = await fetch(url.toString(), getReqOptions());
            const json = await response.json();
            //Без данного ограничения обновление props'ов Таблички приводит к сбросу внутреннего state'а
            skipPageResetRef.current = true;
            setData(json);
        }
        fetchData(pageSize, pageIndex, filtersObject);
    }, [pageIndex, pageSize, filtersObject]);

    // console.table({pageIndex, pageSize, filters});
    return (
        <div className={ styles.container }>
            <CssBaseline />
            <MaUTable { ...getTableProps() }>

                <TableHead >
                {
                    headerGroups.map(headerGroup => (
                        <TableRow { ...headerGroup.getHeaderGroupProps() }>
                            {
                                headerGroup.headers.map(column => (
                                    <TableCell { ...column.getHeaderProps() }>
                                        {column.render('Header')}
                                        {column.canFilter ? column.render('Filter') : null}
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
        </div>
    );
};

//
// function DefaultColumnFilter({
//                                  column: { filterValue, preFilteredRows, setFilter },
//                              }) {
//     const count = preFilteredRows.length
//
//     return (
//         <input
//             value={filterValue || ''}
//             onChange={e => {
//                 setFilter(e.target.value || undefined)
//             }}
//         />
//     )
// }

export default AuditPage;
