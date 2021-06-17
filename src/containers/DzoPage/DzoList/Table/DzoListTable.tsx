import React from 'react';
import { Table, Empty, TableProps } from 'antd';
import { IDzoItem } from '@types';

import styles from './DzoListTable.module.css';

type IDzoListTable = TableProps<IDzoItem> & {
    dzoList: IDzoItem[];
};

const { Column } = Table;

const EMPTY_TABLE = {
    firstMessagePart: 'Мы ничего не нашли.',
    secondMessagePart: 'Измените значение поиска и попробуйте еще раз',
};

const EmptyMessage = (
    <Empty description={null} >
        <div>{EMPTY_TABLE.firstMessagePart}</div>
        <div>{EMPTY_TABLE.secondMessagePart}</div>
    </Empty>
);

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
            locale={{ emptyText: EmptyMessage }}
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
