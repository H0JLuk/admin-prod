import React from 'react';
import { Table, TableProps } from 'antd';
import { SalePointDto } from '@types';
import { SALE_POINT_TYPE, SALE_POINT_TYPE_RU } from '@constants/common';
import EmptyMessage from '@components/EmptyMessage';

import styles from './SalePointsList.module.css';

const SALE_POINT_NAME = 'Точка продажи';
const SALE_POINT_TYPE_LABEL = 'Тип';
const SALE_POINT_KIND = 'Вид точки продажи';
const LOCATION_NAME = 'Локация';

type LocationsListProps = Pick<TableProps<SalePointDto>, 'onRow' | 'rowSelection' | 'pagination' | 'onChange' | 'loading'> & {
    salePointsList: SalePointDto[];
};

const SalePointsList: React.FC<LocationsListProps> = ({
    salePointsList = [],
    ...restProps
}) => (
    <div className={styles.tableWrapper}>
        <Table<SalePointDto>
            {...restProps}
            rowKey="id"
            className={styles.table}
            dataSource={salePointsList}
            showHeader={false}
            locale={{ emptyText: <EmptyMessage /> }}
        >
            <Table.Column
                width="20%"
                key="salePointName"
                dataIndex="name"
                render={(item) => columnRender(item, SALE_POINT_NAME)}
            />
            <Table.Column
                width="15%"
                key="salePointType"
                dataIndex={['type', 'name']}
                render={(item) => columnRender(item, SALE_POINT_TYPE_LABEL)}
            />
            <Table.Column
                width="45%"
                key="locationName"
                dataIndex={['location', 'name']}
                render={(item, row: SalePointDto) => {
                    const parentName = row.location.parentName ? `, ${row.location.parentName}` : '';
                    const locationType = row.location.type.name || '';
                    return columnRender(`${locationType} ${item}${parentName}`, LOCATION_NAME);
                }}
            />
            <Table.Column
                width="15%"
                key="salePointKind"
                dataIndex={['type', 'kind']}
                render={(item: SALE_POINT_TYPE) => columnRender(SALE_POINT_TYPE_RU[item], SALE_POINT_KIND)}
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

export default SalePointsList;
