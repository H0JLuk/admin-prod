import React from 'react';
import { Table, Switch } from 'antd';

const PromoCampaignVisibilitySettingTable = ({
    rowSelection,
    loading,
    dataSource,
    pagination,
    onChangeVisible,
    onChange
}) => (
    <Table
        loading={ loading }
        sortDirections={ ['descend'] }
        rowKey="id"
        pagination={ pagination }
        rowSelection={ rowSelection }
        dataSource={ dataSource }
        onChange={ onChange }
    >
        <Table.Column
            width="40%"
            title="Локация"
            key="locationName"
            // sorter={true}
            dataIndex="locationName"
        />
        <Table.Column
            width="40%"
            title="Точка продажи"
            key="salePointName"
            dataIndex="salePointName"
            // sorter={true}
        />
        <Table.Column
            width="20%"
            title="Включить видимость"
            key="visible"
            render={ (item) => <Switch checked={ item.visible } onClick={ () => onChangeVisible({ ...item, visible: !item.visible }) } /> }
        />
    </Table>
);

export default PromoCampaignVisibilitySettingTable;