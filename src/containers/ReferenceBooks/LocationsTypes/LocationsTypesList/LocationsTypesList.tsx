import React from 'react';
import { Table, TableProps } from 'antd';
import { getFormattedDate } from '@utils/helper';
import { LocationTypeDto } from '@types';

import styles from './LocationsTypesList.module.css';
import EmptyMessage from '@components/EmptyMessage';

const LOCATION_TYPE_NAME = 'Тип локации';
const LOCATION_TYPE_PRIORITY = 'Приоритет типа локации';
const START_DATE = 'Начало действия';
const END_DATE = 'Окончание действия';


type LocationsTypeListProps = Pick<TableProps<LocationTypeDto>, 'onRow' | 'rowSelection' | 'pagination' | 'onChange' | 'loading'> & {
    locationsList: LocationTypeDto[];
};

const LocationsTypesList: React.FC<LocationsTypeListProps> = ({
    locationsList,
    ...restProps
}) => (
    <div className={styles.tableWrapper}>
        <Table<LocationTypeDto>
            {...restProps}
            rowKey="id"
            className={styles.table}
            dataSource={locationsList}
            showHeader={false}
            locale={{ emptyText: <EmptyMessage /> }}
            pagination={false}
        >
            <Table.Column
                width="30%"
                key="name"
                dataIndex="name"
                render={(item) => columnRender(item, LOCATION_TYPE_NAME)}
            />
            <Table.Column
                width="30%"
                key="priority"
                dataIndex="priority"
                render={(item) => columnRender(item, LOCATION_TYPE_PRIORITY)}
            />
            <Table.Column
                width="20%"
                key="startDate"
                dataIndex="startDate"
                render={(item) => columnRender(getFormattedDate(item), START_DATE)}
            />
            <Table.Column
                width="20%"
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

export default LocationsTypesList;
