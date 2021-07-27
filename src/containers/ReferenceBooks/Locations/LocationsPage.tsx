import React, { useCallback, useEffect, useState } from 'react';
import { generatePath, RouteComponentProps } from 'react-router-dom';
import { Button, TableProps, TablePaginationConfig } from 'antd';
import { getLocations, deleteLocation } from '@apiServices/locationService';
import HeaderWithActions, { ButtonProps, SearchParams } from '@components/HeaderWithActions';
import LocationsList from './LocationsList';
import { getSearchParamsFromUrl } from '@utils/helper';
import { LOCATIONS_PAGES } from '@constants/route';
import TableDeleteModal from '@components/TableDeleteModal';
import LocationsListFilters from './LocationsListFilters';
import { LocationDto } from '@types';
import { BUTTON_TEXT, DIRECTION } from '@constants/common';

import styles from './LocationsPage.module.css';

type LocationPageProps = RouteComponentProps & {
    matchPath: string;
};

const MODAL_TITLE = 'Вы уверены, что хотите удалить эти локации?';
const MODAL_SUCCESS_TITLE = 'Результат удаления локаций';

const locale: TablePaginationConfig['locale'] = {
    items_per_page: '',
    prev_page:      'Назад',
    next_page:      'Вперед',
    jump_to:        'Перейти',
    prev_5:         'Предыдущие 5',
    next_5:         'Следующие 5',
    prev_3:         'Предыдущие 3',
    next_3:         'Следующие 3',
};

const DROPDOWN_SORT_MENU = [
    { name: 'locationName', label: 'По локации' },
    { name: 'parentName', label: 'По родительской локации' },
];

const SEARCH_INPUT_PLACEHOLDER = 'Поиск локации';

const DEFAULT_PARAMS: SearchParams = {
    pageNo: 0,
    pageSize: 10,
    sortBy: 'locationName',
    direction: DIRECTION.ASC,
    filterText: '',
    totalElements: 0,
    locationTypeIds: '',
    // topParentLocationId: '', // TODO: Сделать автозаполнение родительской локации если бэк предоставит URL для получения локации по ID
};

type SelectedItemsState = {
    rowValues: LocationDto[];
    rowKeys: number[];
};

const IGNORE_SEARCH_PARAMS = ['locationTypeIds'];

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const getURLSearchParams = ({ totalElements, ...rest }: Record<string, string | number>) =>
    new URLSearchParams(rest as Record<string, string>).toString();

const defaultSelected: SelectedItemsState = { rowValues: [], rowKeys: [] };

const LocationsPage: React.FC<LocationPageProps> = ({ matchPath = '', location, history }) => {
    const { search } = location;
    const [loading, setLoading] = useState(false);
    const [locationsData, setLocationsData] = useState([] as LocationDto[]);
    const [isSelect, setIsSelect] = useState(false);
    const [params, setParams] = useState(DEFAULT_PARAMS);
    const [selectedItems, setSelectedItems] = useState(defaultSelected);

    const loadData = useCallback(async (searchParams = DEFAULT_PARAMS) => {
        const { locationTypeIds = [], ...restParams } = searchParams;
        const urlSearchParams = getURLSearchParams(restParams);

        setLoading(true);
        try {
            const locationTypesParam = locationTypeIds.length ? `&locationTypeIds=${locationTypeIds.join('&locationTypeIds=')}` : '';
            const concatSearchParams = `${urlSearchParams}${locationTypesParam}`;
            const { locations, totalElements, pageNo } = await getLocations(concatSearchParams);
            /* use `replace` instead of `push` for correct work `history.goBack()` */
            history.replace(`${matchPath}?${concatSearchParams}`);

            clearSelectedItems();
            setParams({
                ...searchParams,
                pageNo,
                totalElements,
            });
            setLocationsData(locations);
        } catch (error) {
            console.warn(error);
        }
        setLoading(false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    useEffect(() => {
        const locationTypeIds = search.split('&').filter(el => el.includes('locationTypeIds')).reduce<string[]>(
            (result, el) => {
                const [, value] = el.split('=');
                return !value ? result : [...result, value];
            },
            [],
        );
        const searchParams: SearchParams = {
            ...getSearchParamsFromUrl(search, DEFAULT_PARAMS, IGNORE_SEARCH_PARAMS),
            locationTypeIds: !locationTypeIds.length ? '' : locationTypeIds as any,
        };
        loadData(searchParams);
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

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
        history.push(`${matchPath}${LOCATIONS_PAGES.ADD_LOCATION}`);
    };

    const selectAll = () => {
        if (locationsData.length !== selectedItems.rowKeys.length) {
            const selectedItemsId = locationsData.map(({ id }) => id);
            setSelectedItems({ rowKeys: selectedItemsId, rowValues: locationsData });
            return;
        }
        clearSelectedItems();
    };

    const onRow = (record: LocationDto) => ({
        onClick: () => {
            if (!isSelect) {
                history.push(generatePath(`${matchPath}${LOCATIONS_PAGES.EDIT_LOCATION}`, { locationId: record.id }), { location: record });
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
        loadData(params);
        clearSelectedItems();
    };

    const updateSelected = (rowKeys: React.Key[], rowValues: LocationDto[]) => {
        setSelectedItems({ rowKeys: rowKeys as number[], rowValues });
    };

    const rowSelection = {
        selectedRowKeys: selectedItems.rowKeys,
        onChange: updateSelected,
    };

    const onChangePage: TableProps<LocationDto>['onChange'] = ({ current, pageSize }) => {
        loadData({
            ...params,
            pageNo: current! - 1,
            pageSize: (pageSize as number),
        });
    };

    const onChangeFilter = (requestOptions: SearchParams) => {
        const newParams: SearchParams = { ...requestOptions, pageNo: 0 };

        IGNORE_SEARCH_PARAMS.forEach(key => {
            const paramValue = newParams[key];
            if (!paramValue || (Array.isArray(paramValue) && !paramValue.length)) {
                delete newParams[key];
            }
        });
        loadData(newParams);
    };

    /* const onChangeParentLocation = (newLocation: LocationDto | null) => {
        console.log({newLocation});
    }; */

    const pagination: TableProps<LocationDto>['pagination'] = {
        current: (params.pageNo as number) + 1,
        total: params.totalElements as number,
        pageSize: params.pageSize as number,
        locale,
        showQuickJumper: true,
        showSizeChanger: true,
    };

    const buttons: ButtonProps[] = [];

    if (isSelect) {
        const selectedAll = locationsData.length === selectedItems.rowValues.length;
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
            <HeaderWithActions
                params={params}
                setParams={setParams}
                loadData={loadData}
                onChangeSort={clearSelectedItems}
                inputPlaceholder={SEARCH_INPUT_PLACEHOLDER}
                menuItems={DROPDOWN_SORT_MENU}
                buttons={buttons}
                loading={loading}
                enableAsyncSort
            />
            <LocationsListFilters
                params={params}
                onChangeFilter={onChangeFilter}
                disabledAllFields={loading}
                // onChangeParentLocation={onChangeParentLocation}
            />
            <LocationsList
                locationsList={locationsData}
                loading={loading}
                onRow={onRow}
                rowSelection={isSelect ? rowSelection : undefined}
                pagination={pagination}
                onChange={onChangePage}
            />
            {isSelect && (
                <div className={styles.footer}>
                    <div className={styles.space}>
                        <div className={styles.section}>
                            <span className={styles.label}>
                                Выбрано {selectedItems.rowKeys.length}
                            </span>
                        </div>
                        <TableDeleteModal<LocationDto>
                            listNameKey="name"
                            listIdForRemove={selectedItems.rowKeys}
                            sourceForRemove={selectedItems.rowValues}
                            deleteFunction={deleteLocation}
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

export default LocationsPage;
