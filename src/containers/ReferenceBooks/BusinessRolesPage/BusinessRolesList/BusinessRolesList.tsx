import React, { useEffect, useRef, useState } from 'react';
import { generatePath, RouteComponentProps } from 'react-router-dom';
import { Button } from 'antd';
import { deleteBusinessRole, getBusinessRoles } from '@apiServices/businessRoleService';
import HeaderWithActions, { ButtonProps } from '@components/HeaderWithActions';
import TableDeleteModal from '@components/TableDeleteModal';
import BusinessRolesTable from './BusinessRolesTable';
import { BUSINESS_ROLE_PAGES } from '@constants/route';
import { BUTTON_TEXT } from '@constants/common';
import { BusinessRoleDto } from '@types';

import styles from './BusinessRolesList.module.css';

type ISelectedItems = {
    rowKeys: React.Key[];
    rowValues: BusinessRoleDto[];
};

const BUSINESS_ROLES_TITLE = 'Список бизнес-ролей';

const SEARCH_INPUT_PLACEHOLDER = 'Поиск по бизнес-ролям';

const DROPDOWN_SORT_MENU = [
    { name: 'name', label: 'По названию' },
    { name: 'startDate', label: 'По дате начала' },
    { name: 'endDate', label: 'По дате окончания' },
];

const MODAL_TITLE = 'Вы уверены, что хотите удалить эти бизнес-роли?';
const MODAL_SUCCESS_TITLE = 'Результат удаления бизнес-ролей';

const defaultSelected: ISelectedItems = { rowValues: [], rowKeys: [] };

export interface BusinessRolesListProps extends RouteComponentProps {
    matchPath: string;
}

const BusinessRolesList: React.FC<BusinessRolesListProps> = ({
    matchPath,
    history,
}) => {
    const [loadingTable, setLoadingTable] = useState(true);
    const [businessRolesList, setBusinessRolesList] = useState<BusinessRoleDto[]>([]);
    const copyBusinessRolesList = useRef<BusinessRoleDto[]>([]);
    const [isSelect, setSelect] = useState(false);
    const [selectedItems, setSelectedItems] = useState<ISelectedItems>(defaultSelected);

    const loadingData = async () => {
        setLoadingTable(true);
        try {
            const { list } = await getBusinessRoles();
            setBusinessRolesList(list);
            copyBusinessRolesList.current = list;
            clearSelectedItems();
        } catch (error) {
            console.warn(error);
        }
        setLoadingTable(false);
    };

    useEffect(() => {
        loadingData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const onAddBusinessRoles = () => history.push(generatePath(`${matchPath}${BUSINESS_ROLE_PAGES.ADD_BUSINESS_ROLE}`), { dzoCodes: copyBusinessRolesList.current });

    const toggleSelect = () => {
        setSelect(!isSelect);
        clearSelectedItems();
    };

    const clearSelectedItems = () => setSelectedItems(defaultSelected);

    const handleSelectAllItem = () => {
        if (businessRolesList.length !== selectedItems.rowKeys.length) {
            setSelectedItems({ rowKeys: businessRolesList.map(({ id }) => id), rowValues: businessRolesList });
            return;
        }
        clearSelectedItems();
    };

    const refreshTable = () => {
        loadingData();
        clearSelectedItems();
    };

    const updateSelected = (rowKeys: React.Key[], rowValues: BusinessRoleDto[]) => {
        setSelectedItems({ rowKeys, rowValues });
    };

    const rowSelection = {
        selectedRowKeys: selectedItems.rowKeys,
        onChange: updateSelected,
    };

    const onRow = (businessRoleData: BusinessRoleDto) => ({
        onClick: () => {
            const { id } = businessRoleData;

            if (!isSelect) {
                history.push(generatePath(`${matchPath}${BUSINESS_ROLE_PAGES.INFO_BUSINESS_ROLE}`, { businessRoleId: id }));
                return;
            }

            const rowKeys = !selectedItems.rowKeys.includes(id)
                ? [...selectedItems.rowKeys, id]
                : selectedItems.rowKeys.filter((selectedItemId) => selectedItemId !== id);
            const rowValues = !selectedItems.rowValues.includes(businessRoleData)
                ? [...selectedItems.rowValues, businessRoleData]
                : selectedItems.rowValues.filter((selectedItem) => selectedItem.id !== id);
            setSelectedItems({ rowKeys, rowValues });
        },
    });

    const buttons: ButtonProps[] = [
        isSelect ? {
            type: 'primary',
            label: businessRolesList.length && businessRolesList.length === selectedItems.rowKeys.length
                ? BUTTON_TEXT.CANCEL_ALL
                : BUTTON_TEXT.SELECT_ALL,
            onClick: handleSelectAllItem,
        } : {
            type: 'primary',
            label: BUTTON_TEXT.ADD,
            onClick: onAddBusinessRoles,
        },
        {
            label: isSelect ? BUTTON_TEXT.CANCEL : BUTTON_TEXT.SELECT,
            onClick: toggleSelect,
        },
    ];

    return (
        <div className={styles.container}>
            <HeaderWithActions<BusinessRoleDto>
                title={BUSINESS_ROLES_TITLE}
                buttons={buttons}
                setDataList={setBusinessRolesList}
                copyDataList={copyBusinessRolesList.current}
                matchPath={matchPath}
                inputPlaceholder={SEARCH_INPUT_PLACEHOLDER}
                sortByFieldKey="name"
                menuItems={DROPDOWN_SORT_MENU}
                onChangeInput={clearSelectedItems}
            />
            <BusinessRolesTable
                loading={loadingTable}
                businessRolesList={businessRolesList}
                rowSelection={isSelect ? rowSelection : undefined}
                onRow={onRow}
            />
            {isSelect && (
                <div className={styles.footer}>
                    <div className={styles.space}>
                        <div className={styles.section}>
                            <span className={styles.label}>
                                {BUTTON_TEXT.CHOSEN} {selectedItems.rowKeys.length}
                            </span>
                        </div>
                        <TableDeleteModal<BusinessRoleDto>
                            listNameKey="name"
                            listIdForRemove={selectedItems.rowKeys as number[]}
                            sourceForRemove={selectedItems.rowValues}
                            deleteFunction={deleteBusinessRole}
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

export default BusinessRolesList;
