import React, { useCallback, useEffect, useState } from 'react';
import { generatePath, RouteComponentProps } from 'react-router-dom';
import { Button, TableProps } from 'antd';

import Header from '@components/Header';
import ButtonsBlock, { ButtonProps } from '@components/HeaderWithActions/ButtonsBlock';
import ConsentsListTable from './ConsentsListTable';
import TableDeleteModal from '@components/TableDeleteModal';
import { getConsentsList, deleteConsent } from '@apiServices/consentsService';
import { CONSENTS_PAGES } from '@constants/route';
import { BUTTON_TEXT } from '@constants/common';
import { CONSENTS_LABELS } from '@constants/consentsConstants';
import { ConsentDto } from '@types';

import styles from './ConsentsList.module.css';

type ConsentsListProps = RouteComponentProps & {
    matchPath: string;
};

type SelectedItems = {
    rowKeys: number[];
    rowValues: ConsentDto[];
};

type ConsentListState = ConsentDto & {
    clientApplicationsNames: string;
};

const defaultSelected: SelectedItems = {
    rowValues: [],
    rowKeys: [],
};

const ConsentsList: React.FC<ConsentsListProps> = ({ matchPath, history }) => {
    const [loadingTable, setLoadingTable] = useState(true);
    const [select, setSelect] = useState(false);
    const [consentsList, setConsentsList] = useState<ConsentListState[]>([]);
    const [selectedItems, setSelectedItems] = useState(defaultSelected);

    const loadConsentsList = useCallback(async () => {
        try {
            const { list = [] } = await getConsentsList();

            const consentsData = list.map((consent) => ({
                ...consent,
                clientApplicationsNames: consent.clientApplications
                    .map((apps) => apps.displayName).join(', '),
            }));

            setConsentsList(consentsData);
        } catch (e) {
            console.warn(e);
        }
        setLoadingTable(false);
    }, []);

    useEffect(() => {
        loadConsentsList();
    }, [loadConsentsList]);

    const onAddConsent = () => history.push(`${matchPath}${CONSENTS_PAGES.ADD_CONSENT}`);

    if (consentsList.length === 0 && !loadingTable) {
        return (
            <>
                <Header buttonBack={false} />
                <div className={styles.header}>
                    <div className={styles.emptyConsentsTitle}>
                        {CONSENTS_LABELS.EMPTY_CONSENTS_TITLE}
                    </div>
                    <div className={styles.emptyConsentsDescription}>
                        {CONSENTS_LABELS.EMPTY_CONSENTS_DESCRIPTION}
                    </div>
                    <Button type="primary" onClick={onAddConsent}>
                        {BUTTON_TEXT.ADD}
                    </Button>
                </div>
            </>
        );
    }

    const clearSelectedItems = () => {
        setSelectedItems(defaultSelected);
    };

    const onSelect = () => setSelect(true);

    const selectAll = () => {
        if (consentsList.length !== selectedItems.rowKeys.length) {
            setSelectedItems({ rowKeys: consentsList.map(({ id }) => id), rowValues: consentsList });
            return;
        }
        clearSelectedItems();
    };

    const clearSelectsRow = () => {
        setSelect(false);
        clearSelectedItems();
    };

    const updateSelected = (rowKeys: React.Key[], rowValues: ConsentDto[]) => {
        setSelectedItems({ rowKeys: rowKeys as number[], rowValues });
    };

    const rowSelection: TableProps<ConsentDto>['rowSelection'] = {
        selectedRowKeys: selectedItems.rowKeys,
        onChange: updateSelected,
    };

    const onRow: TableProps<ConsentDto>['onRow'] = (consentData) => ({
        onClick: () => {
            const { id } = consentData;

            if (select) {
                const rowKeys = !selectedItems.rowKeys.includes(id)
                    ? [...selectedItems.rowKeys, id]
                    : selectedItems.rowKeys.filter((selectedItemId) => selectedItemId !== id);
                const rowValues = !selectedItems.rowValues.includes(consentData)
                    ? [...selectedItems.rowValues, consentData]
                    : selectedItems.rowValues.filter((selectedItem) => selectedItem.id !== id);
                setSelectedItems({ rowKeys, rowValues });
            } else {
                history.push(generatePath(`${matchPath}${CONSENTS_PAGES.INFO_CONSENT}`, { consentId: id }));
            }
        },
    });

    const refreshTable = () => {
        loadConsentsList();
        clearSelectedItems();
    };

    const buttons: ButtonProps[] = [];

    if (select) {
        const selectedAll = consentsList.length === selectedItems.rowKeys.length;
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
            { type: 'primary', label: BUTTON_TEXT.ADD, onClick: onAddConsent, disabled: loadingTable },
            { label: BUTTON_TEXT.SELECT, onClick: onSelect, disabled: loadingTable },
        );
    }

    return (
        <div className={styles.container}>
            <Header buttonBack={false} />
            <div className={styles.header}>
                <div className={styles.headerTitle}>
                    {CONSENTS_LABELS.CONSENTS_TITLE}
                </div>
                <div className={styles.buttons}>
                    <ButtonsBlock buttons={buttons} />
                </div>
            </div>
            <ConsentsListTable
                loading={loadingTable}
                consentsList={consentsList}
                rowSelection={(select && rowSelection) || undefined}
                onRow={onRow}
            />
            {select && (
                <div className={styles.footer}>
                    <div className={styles.section}>
                        <span className={styles.label}>
                            {BUTTON_TEXT.CHOSEN} {selectedItems.rowKeys.length}
                        </span>
                    </div>
                    <TableDeleteModal<ConsentDto>
                        listNameKey="version"
                        listIdForRemove={selectedItems.rowKeys}
                        sourceForRemove={selectedItems.rowValues}
                        deleteFunction={deleteConsent}
                        refreshTable={refreshTable}
                        modalSuccessTitle={CONSENTS_LABELS.MODAL_SUCCESS_TITLE}
                        modalTitle={CONSENTS_LABELS.DELETE_LIST_MODAL_TITLE}
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
            )}
        </div>
    );
};

export default ConsentsList;
