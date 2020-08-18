import React, {useEffect, useState} from 'react';
import styles from './AuditPage.module.css';
import { useTable } from 'react-table';

const initialState = { content: [], totalElements: 0, totalPages: 0,
    numberOfElements: 0, size: 20, number: 0 };
const AuditPage = () => {

    const [data, setData] = useState(initialState);
    const { content } = data;
    console.log(data);
    useEffect(() => {
        async function fetchData() {
            const url = new URL(`http://localhost:8070/distributor/audit/list`);
            const response = await fetch(url.toString());
            const json = await response.json();
            setData(json);
        }
        fetchData();
    }, []);

    const columns = React.useMemo(
        () => [
            {
                Header: 'ID',
                accessor: 'id',
            },
            {
                Header: 'Тип события',
                accessor: 'type',
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
            },
            {
                Header: 'Успешно',
                accessor: 'success',
            },
        ],
        []
    )
    const olddata = React.useMemo(
        () => [
            {
                "id": 1,
                "type": "LOGIN",
                "clientAppCode": "admin",
                "userLogin": "000000",
                "userIp": "0:0:0:0:0:0:0:1",
                "userAgent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_6) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/84.0.4147.125 Safari/537.36",
                "happenedAt": "2020-08-17T15:24:07.314+00:00",
                "details": null,
                "success": true
            },
            {
                "id": 2,
                "type": "LOGIN",
                "clientAppCode": "admin",
                "userLogin": "000000",
                "userIp": "0:0:0:0:0:0:0:1",
                "userAgent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_6) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/84.0.4147.125 Safari/537.36",
                "happenedAt": "2020-08-17T15:34:07.314+00:00",
                "details": null,
                "success": true
            }
        ],
        []
    )

    const tableInstance = useTable({ columns, data: content });
    const {
        getTableProps,
        getTableBodyProps,
        headerGroups,
        rows,
        prepareRow,
    } = tableInstance

    return (
        <div className={ styles.container }>
            <p>Журнал аудита</p>
            <table {...getTableProps()}>
                <thead>
                {
                    headerGroups.map(headerGroup => (
                        <tr {...headerGroup.getHeaderGroupProps()}>
                            {
                                headerGroup.headers.map(column => (
                                    <th {...column.getHeaderProps()}>
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
                                            <td {...cell.getCellProps()}>
                                                {cell.render('Cell')}
                                            </td>
                                        )
                                    })}
                            </tr>
                        )
                    })}
                </tbody>
            </table>
        </div>
    );
}

export default AuditPage;
