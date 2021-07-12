import React from 'react';
import { Table, TableProps } from 'antd';
import EmptyMessage from '@components/EmptyMessage';
import { getFormattedDate } from '@utils/helper';
import { BusinessRoleDto } from '@types';

import styles from './BusinessRolesTable.module.css';

type IBusinessRolesListTable = {
    businessRolesList: BusinessRoleDto[];
    rowSelection: TableProps<BusinessRoleDto>['rowSelection'];
    onRow: TableProps<BusinessRoleDto>['onRow'];
    loading: boolean;
};

const { Column } = Table;

const BUSINESS_ROLES_NAME = 'Название';
const BUSINESS_ROLES_ID = 'Начало действия';

const BusinessRolesTable: React.FC<IBusinessRolesListTable> = ({
    businessRolesList,
    rowSelection,
    onRow,
    loading,
}) => (
    <div className={styles.tableWrapper}>
        <Table
            loading={loading}
            showHeader={false}
            dataSource={businessRolesList}
            rowKey="id"
            className={styles.table}
            rowSelection={rowSelection}
            onRow={onRow}
            locale={{ emptyText: <EmptyMessage /> }}
            pagination={false}
        >
            <Column width="80%" dataIndex="name" render={(item) => columnRender(item, BUSINESS_ROLES_NAME)} />
            <Column width="20%" dataIndex="startDate" render={(item) => columnRender(getFormattedDate(item), BUSINESS_ROLES_ID)} />
        </Table>
    </div>
);

const columnRender = (item: string, name: string) => (
    <>
        <div className={styles.tableTitle}>{name}</div>
        <div className={styles.tableCell}>{item}</div>
    </>
);

export default BusinessRolesTable;
