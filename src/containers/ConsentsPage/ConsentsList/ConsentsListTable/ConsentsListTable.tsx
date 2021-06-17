import React from 'react';
import { Table, TableProps } from 'antd';
import { getFormattedDate } from '@utils/helper';
import { CONSENTS_LABELS, EMPTY_VALUE } from '@constants/consentsConstants';
import { ConsentDto } from '@types';

import styles from './ConsentsListTable.module.css';

const { Column } = Table;

type ConsentsListTableProps = {
    consentsList: ConsentDto[];
    rowSelection?: TableProps<ConsentDto>['rowSelection'];
    loading: boolean;
    onRow: TableProps<ConsentDto>['onRow'];
};

const ConsentsListTable: React.FC<ConsentsListTableProps> = ({
    consentsList,
    rowSelection,
    loading,
    onRow,
}) => (
    <div className={styles.wrapper}>
        <Table<ConsentDto>
            loading={loading}
            showHeader={false}
            dataSource={consentsList}
            className={styles.table}
            rowKey="id"
            onRow={onRow}
            rowSelection={rowSelection}
            pagination={false}
        >
            <Column
                width="40%"
                dataIndex="version"
                render={columnRenderConsents}
            />
            <Column
                width="40%"
                dataIndex="clientApplicationsNames"
                render={(item: string) => columnRender(item, CONSENTS_LABELS.CLIENT_APPS_DTO_LIST)}
            />
            <Column
                width="20%"
                dataIndex="createDate"
                render={(item: string) => columnRender(getFormattedDate(item), CONSENTS_LABELS.CREATE_DATE)}
            />
        </Table>
    </div>
);

const columnRender = (item: string, name: string) => (
    <>
        <div className={styles.tableTitle}>{name}</div>
        <div className={styles.tableCell}>
            {!item ? <i>{EMPTY_VALUE[name]}</i> : item}
        </div>
    </>
);

const columnRenderConsents = (item: string) => (
    <div className={styles.tableCell}>
        {CONSENTS_LABELS.INFO_TITLE} {item}
    </div>
);

export default ConsentsListTable;
