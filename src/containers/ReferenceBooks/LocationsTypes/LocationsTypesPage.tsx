import React, { useCallback, useEffect, useRef, useState } from 'react';
import { generatePath, RouteComponentProps } from 'react-router-dom';
import { Button } from 'antd';
import { deleteLocationType, getLocationTypeList } from '@apiServices/locationService';
import HeaderWithActions, { ButtonProps } from '@components/HeaderWithActions';
import LocationsTypesList from './LocationsTypesList';
import { LOCATIONS_TYPES_PAGES } from '@constants/route';
import TableDeleteModal from '@components/TableDeleteModal';
import { LocationTypeDto } from '@types';
import { BUTTON_TEXT } from '@constants/common';

import styles from './LocationsTypePage.module.css';

type LocationPageProps = RouteComponentProps & {
    matchPath: string;
};

const MODAL_TITLE = 'Вы уверены, что хотите удалить эти локации?';
const MODAL_SUCCESS_TITLE = 'Результат удаления локаций';

const SEARCH_INPUT_PLACEHOLDER = 'Поиск локации';

const DROPDOWN_SORT_MENU = [
    { name: 'name', label: 'По названию' },
    { name: 'priority', label: 'По приоритету' },
    { name: 'startDate', label: 'По дате начала' },
    { name: 'endDate', label: 'По дате окончания' },
];

type SelectedItemsState = {
    rowValues: LocationTypeDto[];
    rowKeys: number[];
};

const defaultSelected: SelectedItemsState = { rowValues: [], rowKeys: [] };

const LocationsTypesPage: React.FC<LocationPageProps> = ({ matchPath = '', history }) => {

    const [loading, setLoading] = useState(false);
    const [locationsTypesData, setLocationsTypesData] = useState([] as LocationTypeDto[]);
    const copyLocationsTypesData = useRef<LocationTypeDto[]>([]);
    const [isSelect, setIsSelect] = useState(false);
    const [selectedItems, setSelectedItems] = useState(defaultSelected);

    const loadData = useCallback(async () => {
        setLoading(true);
        try {
            const { list: locationTypes } = await getLocationTypeList();
            clearSelectedItems();
            setLocationsTypesData(locationTypes);
            copyLocationsTypesData.current = locationTypes;
        } catch (error) {
            console.warn(error);
        }
        setLoading(false);
    }, []);

    useEffect(() => {
        loadData();
    }, [loadData]);

    const toggleSelect = () => {
        setIsSelect(prev => !prev);
    };

    const cancelSelectedItems = () => {
        toggleSelect();
        setSelectedItems(defaultSelected);
    };

    const clearSelectedItems = () => {
        setSelectedItems(defaultSelected);
    };

    const addLocation = () => {
        history.push(`${matchPath}${LOCATIONS_TYPES_PAGES.ADD_LOCATION_TYPE}`);
    };

    const selectAll = () => {
        if (locationsTypesData.length !== selectedItems.rowKeys.length) {
            const selectedItemsId = locationsTypesData.map(({ id }) => id);
            setSelectedItems({ rowKeys: selectedItemsId, rowValues: locationsTypesData });
            return;
        }
        clearSelectedItems();
    };

    const onRow = (record: LocationTypeDto) => ({
        onClick: () => {
            if (!isSelect) {
                history.push(generatePath(`${matchPath}${LOCATIONS_TYPES_PAGES.EDIT_LOCATION_TYPE}`, { locationTypeId: record.id }), { locationType: record });
                return;
            }

            const rowKeys = !selectedItems.rowKeys.includes(record.id)
                ? [...selectedItems.rowKeys, record.id]
                : selectedItems.rowKeys.filter((selectedItemId) => selectedItemId !== record.id);

            const rowValues = !selectedItems.rowValues.includes(record)
                ? [...selectedItems.rowValues, record]
                : selectedItems.rowValues.filter((selectedItem) => selectedItem.id !== record.id);

            setSelectedItems({ rowKeys, rowValues });
        },
    });

    const refreshTable = () => {
        loadData();
        clearSelectedItems();
    };

    const updateSelected = (rowKeys: React.Key[], rowValues: LocationTypeDto[]) => {
        setSelectedItems({ rowKeys: rowKeys as number[], rowValues });
    };

    const rowSelection = {
        selectedRowKeys: selectedItems.rowKeys,
        onChange: updateSelected,
    };

    const buttons: ButtonProps[] = [];

    if (isSelect) {
        const selectedAll = locationsTypesData.length === selectedItems.rowValues.length;
        buttons.push({
            type: 'primary',
            label: selectedAll ? BUTTON_TEXT.CANCEL_ALL : BUTTON_TEXT.SELECT_ALL,
            onClick: selectAll,
            disabled: loading,
        },
        {
            label: BUTTON_TEXT.CANCEL,
            onClick: cancelSelectedItems,
            disabled: loading,
        });
    } else {
        buttons.push({
            type: 'primary',
            label: BUTTON_TEXT.ADD,
            onClick: addLocation,
            disabled: loading,
        },
        {
            label: BUTTON_TEXT.SELECT,
            onClick: toggleSelect,
            disabled: loading,
        });
    }

    return (
        <div className={styles.container}>
            <HeaderWithActions<LocationTypeDto>
                loadData={loadData}
                setDataList={setLocationsTypesData}
                copyDataList={copyLocationsTypesData.current}
                matchPath={matchPath}
                onChangeInput={clearSelectedItems}
                inputPlaceholder={SEARCH_INPUT_PLACEHOLDER}
                menuItems={DROPDOWN_SORT_MENU}
                sortByFieldKey="name"
                initialSortBy="name"
                buttons={buttons}
                loading={loading}
            />
            <LocationsTypesList
                locationsList={locationsTypesData}
                loading={loading}
                onRow={onRow}
                rowSelection={isSelect ? rowSelection : undefined}
            />
            {isSelect && (
                <div className={styles.footer}>
                    <div className={styles.space}>
                        <div className={styles.section}>
                            <span className={styles.label}>
                                Выбрано {selectedItems.rowKeys.length}
                            </span>
                        </div>
                        <TableDeleteModal<LocationTypeDto>
                            listNameKey="name"
                            listIdForRemove={selectedItems.rowKeys}
                            sourceForRemove={selectedItems.rowValues}
                            deleteFunction={deleteLocationType}
                            refreshTable={refreshTable}
                            modalSuccessTitle={MODAL_SUCCESS_TITLE}
                            modalTitle={MODAL_TITLE}
                        >
                            <Button
                                type="primary"
                                disabled={!selectedItems.rowKeys.length}
                                danger
                            >
                                {BUTTON_TEXT.DELETE}
                            </Button>
                        </TableDeleteModal>
                    </div>
                </div>
            )}
        </div>
    );
};

export default LocationsTypesPage;
