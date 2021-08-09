import React from 'react';
import { Table, TableProps } from 'antd';
import EmptyMessage from '@components/EmptyMessage';
import { getFormattedDate } from '@utils/helper';
import { LocationDto } from '@types';

import styles from './LocationsList.module.css';

const LOCATION_NAME = 'Локация';
const PARENT_NAME = 'Родительская локация';
const LOCATION_TYPE = 'Тип локации';
const START_DATE = 'Начало действия';

type LocationsListProps = Pick<TableProps<LocationDto>, 'onRow' | 'rowSelection' | 'pagination' | 'onChange' | 'loading'> & {
    locationsList: LocationDto[];
};

const LocationsList: React.FC<LocationsListProps> = ({
    locationsList,
    ...restProps
}) => (
    <div className={styles.tableWrapper}>
        <Table<LocationDto>
            {...restProps}
            rowKey="id"
            className={styles.table}
            dataSource={locationsList}
            showHeader={false}
            locale={{ emptyText: <EmptyMessage /> }}
        >
            <Table.Column
                width="30%"
                key="locationName"
                dataIndex="name"
                render={(item) => columnRender(item, LOCATION_NAME)}
            />
            <Table.Column
                width="30%"
                key="parentName"
                dataIndex="parentName"
                render={(item) => columnRender(item, PARENT_NAME)}
            />
            <Table.Column
                width="20%"
                key="locationType"
                dataIndex={['type', 'name']}
                render={(item) => columnRender(item, LOCATION_TYPE)}
            />
            <Table.Column
                width="20%"
                key="startDate"
                dataIndex="startDate"
                render={(item) => columnRender(getFormattedDate(item), START_DATE)}
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

export default LocationsList;
