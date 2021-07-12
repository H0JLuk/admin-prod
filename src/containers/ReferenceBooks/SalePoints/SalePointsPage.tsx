import React, { useCallback, useEffect, useState } from 'react';
import { generatePath, RouteComponentProps } from 'react-router-dom';
import { Button, TablePaginationConfig, TableProps } from 'antd';
import HeaderWithActions, { ButtonProps, SearchParams } from '@components/HeaderWithActions';
import TableDeleteModal from '@components/TableDeleteModal';
import SalePointsList from './SalePointsList';
import SalePointsListFilters from './SalePointsListFilters';
import { getSalePoints, deleteSalePoint } from '@apiServices/salePointService';
import { getSearchParamsFromUrl } from '@utils/helper';
import { SALE_POINT_PAGES } from '@constants/route';
import { BUTTON_TEXT, DIRECTION } from '@constants/common';
import { SalePointDto } from '@types';

import styles from './SalePoints.module.css';

type SalePointsPageProps = RouteComponentProps & {
    matchPath: string;
};

const MODAL_TITLE = 'Вы уверены, что хотите удалить эти точки продажи?';
const MODAL_SUCCESS_TITLE = 'Результат удаления точек продаж';

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
    { name: 'salePointName', label: 'По точке продажи' },
    { name: 'parentName', label: 'По родительской точке' },
    { name: 'locationName', label: 'По локации' },
];

const SEARCH_INPUT_PLACEHOLDER = 'Поиск точки продажи';

const DEFAULT_PARAMS: SearchParams = {
    pageNo: 0,
    pageSize: 10,
    sortBy: '',
    direction: DIRECTION.ASC,
    filterText: '',
    totalElements: 0,
    salePointKind: '',
    locationTypeIds: '',
    salePointTypeIds: '',
    // topParentLocationId: '', // TODO: Сделать автозаполнение родительской локации если бэк предоставит URL для получения локации по ID
    // topParentSalePointId: '', // TODO: Сделать автозаполнение родительской точки продажи если бэк предоставит URL для получения точки продажи по ID
};

type SelectedItemsState = {
    rowValues: SalePointDto[];
    rowKeys: number[];
};

const IGNORE_SEARCH_PARAMS = ['locationTypeIds', 'salePointTypeIds'];

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const getURLSearchParams = ({ totalElements, ...rest }: Record<string, string | number>) =>
    new URLSearchParams(rest as Record<string, string>).toString();

const defaultSelected: SelectedItemsState = { rowValues: [], rowKeys: [] };

const SalePointsPage: React.FC<SalePointsPageProps> = ({ matchPath = '', location, history }) => {
    const { search } = location;
    const [loading, setLoading] = useState(false);
    const [salePointsData, setSalePointsData] = useState<SalePointDto[]>([]);
    const [isSelect, setIsSelect] = useState(false);
    const [params, setParams] = useState(DEFAULT_PARAMS);
    const [selectedItems, setSelectedItems] = useState(defaultSelected);

    const loadData = useCallback(async (searchParams = DEFAULT_PARAMS) => {
        const { locationTypeIds = [], salePointTypeIds = [], ...restParams } = searchParams;
        const urlSearchParams = getURLSearchParams(restParams);

        setLoading(true);
        try {
            const locationTypesParam = locationTypeIds.length ? `&locationTypeIds=${locationTypeIds.join('&locationTypeIds=')}` : '';
            const salePointTypesParam = salePointTypeIds.length ? `&salePointTypeIds=${salePointTypeIds.join('&salePointTypeIds=')}` : '';
            const concatSearchParams = `${urlSearchParams}${locationTypesParam}${salePointTypesParam}`;
            const { salePoints, pageNo, totalElements } = await getSalePoints(concatSearchParams);
            /* use `replace` instead of `push` for correct work `history.goBack()` */
            history.replace(`${matchPath}?${concatSearchParams}`);

            clearSelectedItems();
            setParams({
                ...searchParams,
                pageNo,
                totalElements,
            });
            setSalePointsData(salePoints);
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
        const salePointTypeIds = search.split('&').filter(el => el.includes('salePointTypeIds')).reduce<string[]>(
            (result, el) => {
                const [, value] = el.split('=');
                return !value ? result : [...result, value];
            },
            [],
        );
        const searchParams: SearchParams = {
            ...getSearchParamsFromUrl(search, DEFAULT_PARAMS, IGNORE_SEARCH_PARAMS),
            locationTypeIds: !locationTypeIds.length ? '' : locationTypeIds as any,
            salePointTypeIds: !salePointTypeIds.length ? '' : salePointTypeIds as any,
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

    const addSalePoint = () => {
        history.push(`${matchPath}${SALE_POINT_PAGES.ADD_SALE_POINT}`);
    };

    const selectAll = () => {
        if (salePointsData.length !== selectedItems.rowKeys.length) {
            const selectedItemsId = salePointsData.map(({ id }) => id);
            setSelectedItems({ rowKeys: selectedItemsId, rowValues: salePointsData });
            return;
        }
        clearSelectedItems();
    };

    const onRow = (record: SalePointDto) => ({
        onClick: () => {
            if (!isSelect) {
                history.push(generatePath(`${matchPath}${SALE_POINT_PAGES.EDIT_SALE_POINT}`, { salePointId: record.id }), { salePoint: record });
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

    const updateSelected = (rowKeys: React.Key[], rowValues: SalePointDto[]) => {
        setSelectedItems({ rowKeys: rowKeys as number[], rowValues });
    };

    const rowSelection = {
        selectedRowKeys: selectedItems.rowKeys,
        onChange: updateSelected,
    };

    const onChangePage: TableProps<SalePointDto>['onChange'] = ({ current, pageSize }) => {
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

    /* const onChangeParentSalePoint = (newSalePoint: SalePointDto | null) => {
        console.log({newSalePoint});
    }; */

    const pagination: TableProps<SalePointDto>['pagination'] = {
        current: (params.pageNo as number) + 1,
        total: params.totalElements as number,
        pageSize: params.pageSize as number,
        locale,
        showQuickJumper: true,
        showSizeChanger: true,
    };

    const buttons: ButtonProps[] = [];

    if (isSelect) {
        const selectedAll = salePointsData.length === selectedItems.rowValues.length;
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
            onClick: addSalePoint,
            disabled: loading,
        },
        {
            label: BUTTON_TEXT.SELECT,
            onClick: toggleSelect,
            disabled: loading,
        });
    }

    return (
        <>
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
                <SalePointsListFilters
                    params={params}
                    onChangeFilter={onChangeFilter}
                    disabledAllFields={loading}
                    // onChangeParentLocation={onChangeParentLocation}
                    // onChangeParentSalePoint={onChangeParentSalePoint}
                />
                <SalePointsList
                    salePointsList={salePointsData}
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
                            <TableDeleteModal<SalePointDto>
                                listNameKey="name"
                                listIdForRemove={selectedItems.rowKeys}
                                sourceForRemove={selectedItems.rowValues}
                                deleteFunction={deleteSalePoint}
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
        </>
    );
};

export default SalePointsPage;
