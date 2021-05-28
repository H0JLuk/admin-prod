import React from 'react';
import { Table } from 'antd';
import { getFormattedDate } from '../../../../utils/helper';
import { CONSENTS_LABELS, EMPTY_VALUE } from '../../../../constants/consentsConstants';

import styles from './ConsentsListTable.module.css';

const { Column } = Table;

const ConsentsListTable = ({
    consentsList,
    rowSelection,
    loading,
    onRow,
}) => {
    return (
        <div className={ styles.wrapper }>
            <Table
                loading={ loading }
                showHeader={ false }
                dataSource={ consentsList }
                className={ styles.table }
                rowKey="id"
                onRow={ onRow }
                rowSelection={ rowSelection }
                pagination={ false }
            >
                <Column
                    width="40%"
                    dataIndex="version"
                    render={ columnRenderConsents }
                />
                <Column
                    width="40%"
                    dataIndex="clientApplicationsNames"
                    render={ (item) => columnRender(item, CONSENTS_LABELS.CLIENT_APPS_DTO_LIST) }
                />
                <Column
                    width="20%"
                    dataIndex="createDate"
                    render={ (item) => columnRender(getFormattedDate(item), CONSENTS_LABELS.CREATE_DATE) }
                />
            </Table>
        </div>
    );
};

const columnRender = (item, name) => (
    <>
        <div className={ styles.tableTitle }>{ name }</div>
        <div className={ styles.tableCell }>
            { !item ? <i>{ EMPTY_VALUE[name] }</i> : item }
        </div>
    </>
);

const columnRenderConsents = (item) => (
    <div className={ styles.tableCell }>
        { CONSENTS_LABELS.INFO_TITLE } { item }
    </div>
);

export default ConsentsListTable;
