import React, { useCallback, useEffect, useState } from 'react';
import { generatePath } from 'react-router-dom';
import { Button } from 'antd';

import Header from '../../../components/Header/Header';
import ButtonsBlock from '../../../components/HeaderWithActions/ButtonsBlock';
import ConsentsListTable from './ConsentsListTable/ConsentsListTable';
import TableDeleteModal from '../../../components/TableDeleteModal/TableDeleteModal';
import { getConsentsList, deleteConsent } from '../../../api/services/consentsService';
import { CONSENTS_PAGES } from '../../../constants/route';
import { BUTTON_TEXT, CONSENTS_LABELS } from '../../../constants/consentsConstants';

import styles from './ConsentsList.module.css';

const defaultSelected = { rowValues: [], rowKeys: [] };

const ConsentsList = ({ matchPath, history }) => {
    const [loadingTable, setLoadingTable] = useState(true);
    const [select, setSelect] = useState(false);
    const [consentsList, setConsentsList] = useState([]);
    const [selectedItems, setSelectedItems] = useState(defaultSelected);
    const [isModalView, setIsModalView] = useState(false);

    const loadConsentsList = useCallback(async () => {
        try {
            const { list = [] } = await getConsentsList();

            const consentsData = list.map((consent) => ({
                ...consent,
                clientApplicationsNames: consent.clientApplications
                    .map((apps) => apps.displayName).join(', ')
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
                <Header />
                <div className={ styles.header }>
                    <div className={ styles.emptyConsentsTitle }>{ CONSENTS_LABELS.EMPTY_CONSENTS_TITLE }</div>
                    <div className={ styles.emptyConsentsDescription }>{ CONSENTS_LABELS.EMPTY_CONSENTS_DESCRIPTION }</div>
                    <Button type="primary" onClick={ onAddConsent } >{ BUTTON_TEXT.ADD }</Button>
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

    const updateSelected = (rowKeys, rowValues) => {
        setSelectedItems({ rowKeys, rowValues });
    };

    const rowSelection = {
        selectedRowKeys: selectedItems.rowKeys,
        onChange: updateSelected,
    };

    const onRow = (consentData) => ({
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

    const toggleModal = () => {
        setIsModalView(!isModalView);
    };

    const refreshTable = () => {
        loadConsentsList();
        clearSelectedItems();
    };

    const buttons = [];

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
        <div className={ styles.container }>
            <Header buttonBack={ false } />
            <div className={ styles.header }>
                <div className={ styles.headerTitle }>{ CONSENTS_LABELS.CONSENTS_TITLE }</div>
                <div className={ styles.buttons }>
                    <ButtonsBlock buttons={ buttons } />
                </div>
            </div>
            <ConsentsListTable
                loading={ loadingTable }
                consentsList={ consentsList }
                rowSelection={ select && rowSelection }
                onRow={ onRow }
            />
            { select && (
                <div className={ styles.footer }>
                    <div className={ styles.section }>
                        <span className={ styles.label }>
                            { BUTTON_TEXT.CHOSEN } { selectedItems.rowKeys.length }
                        </span>
                    </div>
                    <Button
                        disabled={ !selectedItems.rowKeys.length }
                        danger
                        type="primary"
                        onClick={ toggleModal }
                    >
                        { BUTTON_TEXT.DELETE }
                    </Button>
                </div>
            ) }
            { /* TODO: Подумать над тем как вынести кнопку вызова модалки в компонент с модалкой */ }
            <TableDeleteModal
                listNameKey="version"
                listIdForRemove={ selectedItems.rowKeys }
                sourceForRemove={ selectedItems.rowValues }
                modalClose={ toggleModal }
                deleteFunction={ deleteConsent }
                refreshTable={ refreshTable }
                modalSuccessTitle={ CONSENTS_LABELS.MODAL_SUCCESS_TITLE }
                modalTitle={ CONSENTS_LABELS.DELETE_LIST_MODAL_TITLE }
                visible={ isModalView }
            />
        </div>
    );
};

export default ConsentsList;