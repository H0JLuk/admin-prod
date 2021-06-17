import React from 'react';
import { Table, Switch, TablePaginationConfig, TableProps } from 'antd';
import { VisibilitySettingDto } from '@types';

import styles from './PromoCampaignVisibilitySettingTable.module.css';

const LOCATION = 'Локация';
const SALE_POINT = 'Точка продажи';

const ColumnRender = (item: string, name: string) => (
    <>
        <div className={styles.title}>{name}</div>
        <div className={styles.item}>{item}</div>
    </>
);

type PromoCampaignVisibilitySettingTableProps = {
    rowSelection: TableProps<VisibilitySettingDto>['rowSelection'];
    loading: boolean;
    dataSource: VisibilitySettingDto[];
    onChangeVisible: (val: VisibilitySettingDto) => void;
    selectRow: (id: number) => void;
    pagination: TablePaginationConfig;
    onChange: TableProps<VisibilitySettingDto>['onChange'];
};

const PromoCampaignVisibilitySettingTable: React.FC<PromoCampaignVisibilitySettingTableProps> = ({
    rowSelection,
    loading,
    dataSource,
    onChangeVisible,
    selectRow,
    pagination,
    onChange,
}) => (
    <Table<VisibilitySettingDto>
        className={styles.table}
        loading={loading}
        rowKey="id"
        pagination={pagination}
        rowSelection={rowSelection}
        dataSource={dataSource}
        showHeader={false}
        onRow={(record) => ({ onClick: () => selectRow(record.id) })}
        onChange={onChange}
    >
        <Table.Column
            width="40%"
            key="locationName"
            dataIndex="locationName"
            render={(item) => ColumnRender(item, LOCATION)}
        />
        <Table.Column
            width="40%"
            key="salePointName"
            dataIndex="salePointName"
            render={(item) => ColumnRender(item, SALE_POINT)}
        />
        <Table.Column
            width="20%"
            key="visible"
            className={styles.switch}
            render={(item) => (
                <Switch
                    checked={item.visible}
                    onClick={(_, e) => {
                        e.stopPropagation();
                        onChangeVisible({ ...item, visible: !item.visible });
                    }}
                />
            )}
        />
    </Table>
);

export default PromoCampaignVisibilitySettingTable;
