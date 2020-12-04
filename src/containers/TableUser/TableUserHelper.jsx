import React from 'react';
import TableUserHeadInput from './TableUserHeadInput';
import TableUserHeadStatus from './TableUserHeadStatus';
import UserBlockStatus from '../../components/UserBlockStatus/UserBlockStatus';

import styles from './TableUser.module.css';

const LOGIN = 'Логин';
const LOCATIONS = 'Локации';
const SALE_POINTS = 'Точки продаж';

const RenderCellStatus = (blocked) => (
    <UserBlockStatus
        className={ styles.cellRight }
        blocked={ blocked }
        withText
    />
);

export function getColumnsForTable({
    filterInput,
    handleSearch,
    sorted,
}) {
    return [
        {
            title: <TableUserHeadInput
                title={ LOGIN }
                valueSet={ filterInput.personalNumber }
                value={ filterInput.personalNumber }
                inputName="personalNumber"
                onChange={ handleSearch }
            />,
            dataIndex: 'personalNumber',
            className: styles.loginCol,
        },
        {
            title: <TableUserHeadInput
                title={ LOCATIONS }
                valueSet={ filterInput.locationName }
                value={ filterInput.locationName }
                inputName="locationName"
                onChange={ handleSearch }
            />,
            dataIndex: 'locationName',
        },
        {
            title: <TableUserHeadInput
                title={ SALE_POINTS }
                valueSet={ filterInput.salePointName }
                value={ filterInput.salePointName }
                inputName="salePointName"
                onChange={ handleSearch }
            />,
            dataIndex: 'salePointName',
            className: styles.salePointCol,
        },
        {
            title: <TableUserHeadStatus
                className={ styles.statusFilter }
                sortValue={ filterInput.blocked }
                onClick={ sorted }
            />,
            dataIndex: 'blocked',
            showSorterTooltip: false,
            render: RenderCellStatus,
            className: styles.statusCol,
        },
    ];
}
