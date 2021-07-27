import React, { useEffect, useRef, useState } from 'react';
import { generatePath, useHistory } from 'react-router-dom';
import { Button } from 'antd';
import { deleteDzo, getAllDzoList, getDzoList } from '@apiServices/dzoService';
import DzoListTable from './Table/DzoListTable';
import Header from '@components/Header';
import TableDeleteModal from '@components/TableDeleteModal';
import HeaderWithActions, { ButtonProps } from '@components/HeaderWithActions';
import { DZO_PAGES } from '@constants/route';
import { requestsWithMinWait } from '@utils/utils';
import { BUTTON_TEXT } from '@constants/common';
import { DzoDto } from '@types';

import styles from './DzoList.module.css';

type IDzoPageProp = {
    matchPath: string;
};

type ISelectedItems = {
    rowKeys: React.Key[];
    rowValues: DzoDto[];
};

const MODAL_TITLE = 'Вы уверены, что хотите удалить эти ДЗО?';
const MODAL_SUCCESS_TITLE = 'Результат удаления ДЗО';

const DZO_TITLE = 'Список ДЗО';

const DROPDOWN_SORT_MENU = [
    { name: 'dzoName', label: 'По названию' },
    { name: 'dzoId', label: 'По ID' },
    { name: 'dzoCode', label: 'По коду' },
];

const SEARCH_INPUT_PLACEHOLDER = 'Поиск по названию дзо';

const defaultSelected = { rowValues: [], rowKeys: [] };

const DzoPage: React.FC<IDzoPageProp> = ({ matchPath }) => {
    const history = useHistory();
    const [loadingTable, setLoadingTable] = useState(true);
    const [dzoList, setDzoList] = useState<DzoDto[]>([]);
    const copyDzoList = useRef<DzoDto[]>([]);
    const [select, setSelect] = useState(false);
    const [selectedItems, setSelectedItems] = useState<ISelectedItems>(defaultSelected);
    const dzoCodes = useRef<string[]>([]);

    const onAddDzo = () => history.push(generatePath(`${matchPath}${DZO_PAGES.ADD_DZO}`), { dzoCodes: dzoCodes.current });

    const loadDzoList = async () => {
        setLoadingTable(true);
        try {
            const requests = Promise.all([getDzoList(), getAllDzoList()]);
            const [
                { dzoDtoList = [] },
                { dzoDtoList: allDzo = [] },
            ] = await requestsWithMinWait(requests, 0);
            dzoCodes.current = allDzo.map(({ dzoCode }) => dzoCode);
            copyDzoList.current = dzoDtoList;
            setDzoList(dzoDtoList);
            clearSelectedItems();
        } catch (e) {
            console.warn(e);
        }
        setLoadingTable(false);
    };

    useEffect(() => {
        loadDzoList();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const clearSelectedItems = () => {
        setSelectedItems(defaultSelected);
    };

    const clearSelectsRow = () => {
        setSelect(false);
        clearSelectedItems();
    };

    const onSelect = () => setSelect(true);

    const updateSelected = (rowKeys: React.Key[], rowValues: DzoDto[]) => {
        setSelectedItems({ rowKeys, rowValues });
    };

    const rowSelection = {
        selectedRowKeys: selectedItems.rowKeys,
        onChange: updateSelected,
    };

    const selectAll = () => {
        if (dzoList.length !== selectedItems.rowKeys.length) {
            setSelectedItems({ rowKeys: dzoList.map(({ dzoId }) => dzoId), rowValues: dzoList });
            return;
        }
        clearSelectedItems();
    };

    const onRow = (dzoData: DzoDto) => ({
        onClick: () => {
            const { dzoId } = dzoData;

            if (!select) {
                history.push(generatePath(`${matchPath}${DZO_PAGES.DZO_INFO}`, { dzoId }), { dzoData });
                return;
            }

            const rowKeys = !selectedItems.rowKeys.includes(dzoId as never)
                ? [...selectedItems.rowKeys, dzoId]
                : selectedItems.rowKeys.filter((selectedItemId) => selectedItemId !== dzoId);
            const rowValues = !selectedItems.rowValues.includes(dzoData as never)
                ? [...selectedItems.rowValues, dzoData]
                : selectedItems.rowValues.filter((selectedItem) => selectedItem.dzoId !== dzoId);
            setSelectedItems({ rowKeys, rowValues });
        },
    });

    const refreshTable = () => {
        loadDzoList();
        clearSelectedItems();
    };

    const buttons: ButtonProps[] = [];

    if (select) {
        const selectedAll = dzoList.length === selectedItems.rowKeys.length;
        buttons.push({
            type: 'primary',
            label: selectedAll ? BUTTON_TEXT.CANCEL_ALL : BUTTON_TEXT.SELECT_ALL,
            onClick: selectAll,
            disabled: loadingTable,
        },
        {
            label: BUTTON_TEXT.CANCEL,
            onClick: clearSelectsRow,
            disabled: loadingTable,
        });
    } else {
        buttons.push(
            { type: 'primary', label: BUTTON_TEXT.ADD, onClick: onAddDzo, disabled: loadingTable },
            { label: BUTTON_TEXT.SELECT, onClick: onSelect, disabled: loadingTable },
        );
    }

    return (
        <>
            <div className={styles.container}>
                <Header />
                {<HeaderWithActions<DzoDto>
                    title={DZO_TITLE}
                    buttons={buttons}
                    setDataList={setDzoList}
                    copyDataList={copyDzoList.current}
                    matchPath={matchPath}
                    inputPlaceholder={SEARCH_INPUT_PLACEHOLDER}
                    filterByFieldKey="dzoName"
                    menuItems={DROPDOWN_SORT_MENU}
                    onChangeInput={clearSelectedItems}
                />}
                <DzoListTable
                    loading={loadingTable}
                    dzoList={dzoList}
                    rowSelection={select ? rowSelection : undefined}
                    onRow={onRow}
                />
                {select && (
                    <div className={styles.footer}>
                        <div className={styles.space}>
                            <div className={styles.section}>
                                <span className={styles.label}>
                                    {BUTTON_TEXT.CHOSEN} {selectedItems.rowKeys.length}
                                </span>
                            </div>
                            <TableDeleteModal<DzoDto>
                                listNameKey="dzoName"
                                listIdForRemove={selectedItems.rowKeys as number[]}
                                sourceForRemove={selectedItems.rowValues}
                                deleteFunction={deleteDzo}
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

export default DzoPage;
