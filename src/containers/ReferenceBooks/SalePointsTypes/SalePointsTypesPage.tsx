import React, { useCallback, useEffect, useRef, useState } from 'react';
import { generatePath, RouteComponentProps } from 'react-router-dom';
import { Button } from 'antd';
import HeaderWithActions, { ButtonProps } from '@components/HeaderWithActions';
import { SALE_POINT_TYPES_PAGES } from '@constants/route';
import TableDeleteModal from '@components/TableDeleteModal';
import { SalePointType } from '@types';
import { BUTTON_TEXT } from '@constants/common';

import styles from './SalePointsTypesPage.module.css';
import { deleteSalePointType, getSalePointTypesList } from '@apiServices/salePointService';
import SalePointsTypesList from './SalePointTypesList';

type SalePointPageProps = RouteComponentProps & {
    matchPath: string;
};

const MODAL_TITLE = 'Вы уверены, что хотите удалить эти точки продаж?';
const MODAL_SUCCESS_TITLE = 'Результат удаления точек продаж';

const SEARCH_INPUT_PLACEHOLDER = 'Поиск точки продаж';

const DROPDOWN_SORT_MENU = [
    { name: 'name', label: 'По названию' },
    { name: 'priority', label: 'По приоритету' },
    { name: 'startDate', label: 'По дате начала' },
    { name: 'endDate', label: 'По дате окончания' },
];

type SelectedItemsState = {
    rowValues: SalePointType[];
    rowKeys: number[];
};

const defaultSelected: SelectedItemsState = { rowValues: [], rowKeys: [] };

const SalePointsTypesPage: React.FC<SalePointPageProps> = ({ matchPath = '', history }) => {
    const [loading, setLoading] = useState(false);
    const [salePointsTypesData, setSalePointsTypesData] = useState<SalePointType[]>([]);
    const copySalePointTypesData = useRef<SalePointType[]>([]);
    const [isSelect, setIsSelect] = useState(false);
    const [selectedItems, setSelectedItems] = useState(defaultSelected);

    const loadData = useCallback(async () => {
        setLoading(true);
        try {
            const { list } = await getSalePointTypesList();
            setSalePointsTypesData(list);
            copySalePointTypesData.current = list;
            clearSelectedItems();
        } catch (error) {
            console.warn(error);
        }
        setLoading(false);
    }, []);

    useEffect(() => {
        loadData();
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
        history.push(`${matchPath}${SALE_POINT_TYPES_PAGES.ADD_SALE_POINT_TYPE}`);
    };

    const selectAll = () => {
        if (salePointsTypesData.length !== selectedItems.rowKeys.length) {
            const selectedItemsId = salePointsTypesData.map(({ id }) => id);
            setSelectedItems({ rowKeys: selectedItemsId, rowValues: salePointsTypesData });
            return;
        }
        clearSelectedItems();
    };

    const onRow = (record: SalePointType) => ({
        onClick: () => {
            if (!isSelect) {
                history.push(generatePath(`${matchPath}${SALE_POINT_TYPES_PAGES.EDIT_SALE_POINT_TYPE}`, { salePointTypeId: record.id }), { salePointType: record });
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

    const updateSelected = (rowKeys: React.Key[], rowValues: SalePointType[]) => {
        setSelectedItems({ rowKeys: rowKeys as number[], rowValues });
    };

    const rowSelection = {
        selectedRowKeys: selectedItems.rowKeys,
        onChange: updateSelected,
    };

    const buttons: ButtonProps[] = [];

    if (isSelect) {
        const selectedAll = salePointsTypesData.length === selectedItems.rowValues.length;
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
        <div className={styles.container}>
            <HeaderWithActions<SalePointType>
                buttons={buttons}
                sortByFieldKey="name"
                initialSortBy="name"
                setDataList={setSalePointsTypesData}
                copyDataList={copySalePointTypesData.current}
                matchPath={matchPath}
                inputPlaceholder={SEARCH_INPUT_PLACEHOLDER}
                menuItems={DROPDOWN_SORT_MENU}
                onChangeInput={clearSelectedItems}
            />
            <SalePointsTypesList
                salePointsList={salePointsTypesData}
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
                        <TableDeleteModal<SalePointType>
                            listNameKey="name"
                            listIdForRemove={selectedItems.rowKeys}
                            sourceForRemove={selectedItems.rowValues}
                            deleteFunction={deleteSalePointType}
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

export default SalePointsTypesPage;
