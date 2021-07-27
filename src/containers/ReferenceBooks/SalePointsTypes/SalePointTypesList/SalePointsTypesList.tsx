import React from 'react';
import { Table, TableProps } from 'antd';
import { getFormattedDate } from '@utils/helper';
import { SalePointType } from '@types';

import styles from './SalePointsTypesList.module.css';
import EmptyMessage from '@components/EmptyMessage';

const SALE_POINT_TYPE_NAME = 'Тип точки продаж';
const START_DATE = 'Начало действия';
const SALE_POINT_TYPE_PRIORITY = 'Приоритет';
const END_DATE = 'Окончание действия';


type SalePointsTypeListProps = Pick<TableProps<SalePointType>, 'onRow' | 'rowSelection' | 'pagination' | 'onChange' | 'loading'> & {
    salePointsList: SalePointType[];
};

const SalePointsTypesList: React.FC<SalePointsTypeListProps> = ({
    salePointsList,
    ...restProps
}) => (
    <div className={styles.tableWrapper}>
        <Table<SalePointType>
            {...restProps}
            rowKey="id"
            className={styles.table}
            dataSource={salePointsList}
            showHeader={false}
            locale={{ emptyText: <EmptyMessage /> }}
            pagination={false}
        >
            <Table.Column
                width="30%"
                key="name"
                dataIndex="name"
                render={(item) => columnRender(item, SALE_POINT_TYPE_NAME)}
            />
            <Table.Column
                width="20%"
                key="priority"
                dataIndex="priority"
                render={(item) => columnRender(item, SALE_POINT_TYPE_PRIORITY)}
            />
            <Table.Column
                width="25%"
                key="startDate"
                dataIndex="startDate"
                render={(item) => columnRender(getFormattedDate(item), START_DATE)}
            />
            <Table.Column
                width="25%"
                key="endDate"
                dataIndex="endDate"
                render={(item) => columnRender(getFormattedDate(item), END_DATE)}
            />
        </Table>
    </div>
);

const columnRender = (item: string, name: string) => (
    <>
        <div className={styles.tableTitle}>{name}</div>
        <div className={styles.tableCell}>{item}</div>
    </>
);

export default SalePointsTypesList;
