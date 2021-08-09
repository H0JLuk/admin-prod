import React, { useEffect, useState } from 'react';
import { Spin, Collapse, Table, TableProps } from 'antd';
import ReactJson from 'react-json-view';

import AuditFilter, { SubmitCallbackValues } from './AuditFilter';
import { getClientAppList } from '@apiServices/clientAppService';
import { fetchAuditData } from '@apiServices/auditService';
import { DIRECTION } from '@constants/common';
import { AuditEvent } from '@types';

import styles from './AuditPage.module.css';

const PAGE_CURRENT_DEFAULT = 1;
const PAGE_SIZE_DEFAULT = 10;

export type AuditPageAppType = {
    label: string;
    value: string;
};

type DataType = {
    data: AuditEvent[];
    pagination: Exclude<TableProps<AuditEvent>['pagination'], false | undefined>;
};

const antColumns: TableProps<AuditEvent>['columns'] = [
    {
        title: 'ID',
        dataIndex: 'id',
        width: '6%',
    },
    {
        title: 'Тип события',
        dataIndex: 'type',
        sorter: true,
        width: '13%',
    },
    {
        title: 'Приложение',
        dataIndex: 'clientAppCode',
        sorter: true,
        width: '11%',
    },
    {
        title: 'Пользователь',
        dataIndex: 'userLogin',
        sorter: true,
        width: '11%',
    },
    {
        title: 'IP пользователя',
        dataIndex: 'userIp',
        sorter: true,
        width: '14%',
    },
    {
        title: 'ID запроса',
        dataIndex: 'requestId',
        width: '12%',
    },
    {
        title: 'Дата',
        dataIndex: 'happenedAt',
        sorter: true,
        width: '12%',
    },
    {
        title: 'Детали',
        dataIndex: 'details',
        width: '21%',
        // eslint-disable-next-line react/display-name
        render: (details: string | null) => details && (
            <div className={styles.reactJson}>
                <ReactJson
                    src={JSON.parse(details)}
                    name={null}
                    enableClipboard={false}
                    displayObjectSize={false}
                    displayDataTypes={false}
                    collapsed
                    iconStyle="circle"
                />
            </div>
        ),
    },
    {
        title: 'Статус события',
        dataIndex: 'success',
        sorter: true,
        width: '7%',
        // eslint-disable-next-line react/display-name
        render: (success: boolean) => <span>{success ? 'Успешно' : 'Ошибка'}</span>,
    },
];

const locale = {
    items_per_page: '',
    prev_page:      'Назад',
    next_page:      'Вперед',
    jump_to:        'Перейти',
    prev_5:         'Предыдущие 5',
    next_5:         'Следующие 5',
    prev_3:         'Предыдущие 3',
    next_3:         'Следующие 3',
};

const antInitialData: DataType = {
    data: [],
    pagination: {
        showSizeChanger: true,
        showQuickJumper: true,
        locale,
        pageSize: PAGE_SIZE_DEFAULT,
        current: PAGE_CURRENT_DEFAULT,
        total: 0,
    },
};

const AuditPage = () => {
    const [data, setData] = useState(antInitialData);
    const [applications, setApplications] = useState<AuditPageAppType[]>([]);
    const [sort, setSort] = useState({ item: 'happenedAt', direction: DIRECTION.DESC });
    const [loading, setLoading] = useState(false);
    const [filtersObject, setFiltersObject] = useState({} as SubmitCallbackValues);

    useEffect(() => {
        (async () => {
            const { list = [] } = await getClientAppList();
            const appOptions = list.map(({ displayName: label, code: value }) => ({ label, value }));
            setApplications([{ label: 'admin', value: 'admin' }, ...appOptions]);
        })();
    }, []);

    const handleTableChange: TableProps<AuditEvent>['onChange'] = ({ current = 1, pageSize = 10 }, filters, sorter) => {
        if (!Array.isArray(sorter)) {
            const { order, field } = sorter;
            const item = (order && field as string) || '';
            const direction = order === 'ascend' ? DIRECTION.ASC : DIRECTION.DESC;
            setSort({ item, direction });
            setData((prev) => ({
                ...prev,
                pagination: {
                    ...prev.pagination,
                    current,
                    pageSize,
                },
            }));
        }
    };

    useEffect(() => {
        async function fetchData(pageSize: string, pageNo: string, mappedFilters = {}) {
            setLoading(true);
            const { events, totalPages, totalElements } = await fetchAuditData(pageSize, pageNo, sort.item, sort.direction, mappedFilters);

            setData((prev) => ({
                data: events,
                pagination: {
                    ...prev.pagination,
                    page: +pageNo,
                    pageTotal: totalPages,
                    total: totalElements,
                },
            }));
            setLoading(false);
        }
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        fetchData(String(data.pagination.pageSize), String(data.pagination.current! - 1), filtersObject);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [filtersObject, sort, data.pagination.pageSize, data.pagination.current]);

    return (
        <div className={styles.container}>
            <Spin tip="Загрузка..." spinning={loading}>
                <Collapse accordion className={styles.antCollapse}>
                    <Collapse.Panel header="Фильтры" key="1">
                        <AuditFilter
                            submit={setFiltersObject}
                            applications={applications}
                        />
                    </Collapse.Panel>
                </Collapse>

                <Table<AuditEvent>
                    columns={antColumns}
                    rowKey="id"
                    dataSource={data.data}
                    pagination={data.pagination}
                    onChange={handleTableChange}
                />
            </Spin>
        </div>
    );
};

export default AuditPage;
