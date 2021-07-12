import React from 'react';
import { Table, TableProps } from 'antd';
import EmptyMessage from '@components/EmptyMessage';
import { DzoDto } from '@types';

import styles from './DzoListTable.module.css';

type IDzoListTable = TableProps<DzoDto> & {
    dzoList: DzoDto[];
    rowSelection: TableProps<DzoDto>['rowSelection'];
    onRow: TableProps<DzoDto>['onRow'];
    loading: boolean;
};

const { Column } = Table;

const DZO_NAME = 'Название';
const DZO_ID = 'ID';
const DZO_CODE = 'Код';


const DzoListTable: React.FC<IDzoListTable> = ({
    dzoList,
    rowSelection,
    onRow,
    loading,
}) => (
    <div className={styles.tableWrapper}>
        <Table
            loading={loading}
            showHeader={false}
            dataSource={dzoList}
            rowKey="dzoId"
            className={styles.table}
            rowSelection={rowSelection}
            onRow={onRow}
            locale={{ emptyText: <EmptyMessage /> }}
            pagination={false}
        >
            <Column width="45%" dataIndex="dzoName" render={(item) => columnRender(item, DZO_NAME)} />
            <Column width="40%" dataIndex="dzoId" render={(item) => columnRender(item, DZO_ID)} />
            <Column width="15%" dataIndex="dzoCode" render={(item) => columnRender(item, DZO_CODE)} />
        </Table>
    </div>
);

const columnRender = (item: string, name: string) => (
    <>
        <div className={styles.tableTitle}>{name}</div>
        <div className={styles.tableCell}>{item}</div>
    </>
);

export default DzoListTable;
