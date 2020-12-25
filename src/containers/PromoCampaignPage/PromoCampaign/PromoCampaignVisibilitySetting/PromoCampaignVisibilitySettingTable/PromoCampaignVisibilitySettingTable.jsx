import React from 'react';
import { Table, Switch } from 'antd';

import styles from './PromoCampaignVisibilitySettingTable.module.css';

const LOCATION = 'Локация';
const SALE_POINT = 'Точка продажи';

const ColumnRender = (item, name) => (
    <>
        <div className={ styles.title }>{ name }</div>
        <div className={ styles.item }>{ item }</div>
    </>
);

const PromoCampaignVisibilitySettingTable = ({
    rowSelection,
    loading,
    dataSource,
    onChangeVisible,
    selectRow,
    pagination,
    onChange,
}) =>  (
        <Table
            className={ styles.table }
            loading={ loading }
            rowKey="id"
            pagination={ pagination }
            rowSelection={ rowSelection }
            dataSource={ dataSource }
            showHeader={ false }
            onRow={ (record) => ({ onClick: () => selectRow(record.id) }) }
            onChange={ onChange }
        >
        <Table.Column
            width="40%"
            key="locationName"
            dataIndex="locationName"
            render = { (item) => ColumnRender(item, LOCATION) }
        />
        <Table.Column
            width="40%"
            key="salePointName"
            dataIndex="salePointName"
            render = { (item) => ColumnRender(item, SALE_POINT) }
        />
        <Table.Column
            width="20%"
            key="visible"
            className={ styles.switch }
            render={ (item) => <Switch checked={ item.visible } onClick={ () => onChangeVisible({ ...item, visible: !item.visible }) } /> }
        />
        </Table>
);

export default PromoCampaignVisibilitySettingTable;
