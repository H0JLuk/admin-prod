import React, {useEffect, useState} from 'react';
import styles from './AuditPage.module.css';
import { useTable, usePagination } from 'react-table';
// import DatePicker from "react-datepicker";
import {getReqOptions} from "../../api/services";
import ReactJson from "react-json-view";
import SelectColumnFilter from "./SelectColumnFilter";
import {baseUrl} from "../../api/apiClient";

const initialState = { events: [], totalElements: 0, totalPages: 0,
    numberOfElements: 0, size: 20, number: 0 };

const DATE_FORMAT = 'dd.MM.yyyy';

// const a = (<DatePicker
//     className={ styles.datepicker }
//     dateFormat={ DATE_FORMAT }
//     selected={ endDate }
//     onChange={ date => { this.handleChangeDate(date, false); } }
// />)
const AuditPage = () => {

    const [data, setData] = useState(initialState);
    const { events, totalPages } = data;
    console.log(data);

    const columns = React.useMemo(
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
                Cell: ({row: {original: {details}}}) => details && (<ReactJson
                    src={JSON.parse(details)}
                    name={null}
                    enableClipboard={false}
                    displayObjectSize={false}
                    displayDataTypes={false}
                    collapsed={true}
                    iconStyle='circle'
                />
                )
            },
            {
                Header: 'Успешно',
                accessor: 'success',
                Cell: ({row: {original: {success}}}) => <span>{success ? 'Успешно' : 'Не успешно'}</span>
            },
        ],
        []
    )

    const tableInstance = useTable({ columns, data: events, initialState: { pageIndex: 0 }, manualPagination: true,
        pageCount: totalPages }, usePagination);
    const {
        getTableProps,
        getTableBodyProps,
        headerGroups,
        rows,
        prepareRow,
        page,
        canPreviousPage,
        canNextPage,
        pageOptions,
        pageCount,
        gotoPage,
        nextPage,
        previousPage,
        setPageSize,
        state: { pageIndex, pageSize },
    } = tableInstance

    useEffect(() => {
        async function fetchData(pageSize, pageNo) {
            const url = new URL(`${baseUrl}/admin/audit/events`);
            url.search = new URLSearchParams({pageNo, pageSize}).toString();

            const response = await fetch(url.toString(), getReqOptions());
            const json = await response.json();
            setData(json);
        }
        fetchData(pageSize, pageIndex);
    }, [pageIndex, pageSize, totalPages]);

    console.table({pageIndex, pageSize});
    return (
        <div className={ styles.container }>
            <p>Журнал аудита</p>
            <table {...getTableProps()} className={styles.table}>

                <thead >
                {
                    headerGroups.map(headerGroup => (
                        <tr {...headerGroup.getHeaderGroupProps()}>
                            {
                                headerGroup.headers.map(column => (
                                    <th {...column.getHeaderProps()} className={styles['table-header']}>
                                        {column.render('Header')}
                                    </th>
                                ))}
                        </tr>
                    ))}
                </thead>
                <tbody {...getTableBodyProps()}>
                {
                    rows.map(row => {
                        prepareRow(row)
                        return (
                            <tr {...row.getRowProps()}>
                                {
                                    row.cells.map(cell => {
                                        return (
                                            <td {...cell.getCellProps()} className={styles['table-cell']}>
                                                {cell.render('Cell')}
                                            </td>
                                        )
                                    })}
                            </tr>
                        )
                    })}
                </tbody>
            </table>
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
        </div>
    );
}

export default AuditPage;
