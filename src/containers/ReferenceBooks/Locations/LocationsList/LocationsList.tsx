import React from 'react';
import { Empty, Table, TableProps } from 'antd';
import { getFormattedDate } from '@utils/helper';
import { LocationDto } from '@types';

import styles from './LocationsList.module.css';

const LOCATION_NAME = 'Локация';
const LOCATION_TYPE = 'Тип локации';
const START_DATE = 'Начало действия';

const EMPTY_TABLE = {
    firstMessagePart: 'Мы ничего не нашли.',
    secondMessagePart: 'Измените значение поиска и попробуйте еще раз',
};

// TODO: Заменить компонентом после мержа ветки WDZO-2164
const EmptyMessage = (
    <Empty description={null} >
        <div>{EMPTY_TABLE.firstMessagePart}</div>
        <div>{EMPTY_TABLE.secondMessagePart}</div>
    </Empty>
);

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
            locale={{ emptyText: EmptyMessage }}
        >
            <Table.Column
                width="40%"
                key="locationName"
                dataIndex="name"
                render={(item) => columnRender(item, LOCATION_NAME)}
            />
            <Table.Column
                width="40%"
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
