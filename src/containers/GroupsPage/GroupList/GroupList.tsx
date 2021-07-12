import React, { useCallback, useEffect, useRef, useState } from 'react';
import cn from 'classnames';
import { useHistory } from 'react-router-dom';
import { Button, Radio, RadioChangeEvent } from 'antd';
import { SyncOutlined } from '@ant-design/icons';
import Header from '@components/Header';
import HeaderWithActions, { ButtonProps } from '@components/HeaderWithActions';
import TableDeleteModal from '@components/TableDeleteModal';
import { getCampaignGroupList, deleteCampaignGroup } from '@apiServices/campaignGroupService';
import { GROUPS_PAGES } from '@constants/route';
import { EmptyGroup, GroupListByType } from './GroupListComponents';
import {
    SEARCH_INPUT,
    DROPDOWN_SORT_MENU,
    GROUP_OPTIONS,
    TITLE,
    PRE_TITLE,
    RESET_LABEL,
    groupTypes,
} from './groupListConstants';
import { BUTTON_TEXT } from '@constants/common';
import { BundleTypes } from '../groupPageConstants';
import { BundleDtoWithLinksLength, BundlesRelatedCampaigns, CheckedItem } from './types';

import styles from './GroupList.module.css';

type GroupListProps = {
    matchPath: string;
};

const GroupList: React.FC<GroupListProps> = ({ matchPath }) => {
    const [loading, setLoading] = useState(true);
    const copyBundleList = useRef<BundleDtoWithLinksLength[]>([]);
    const copyRelatedCampaigns = useRef<BundleDtoWithLinksLength[]>([]);
    const [groupBundlesList, setBundlesList] = useState<BundleDtoWithLinksLength[]>([]);
    const [groupPromoCampaignsList, setPromoCampaignsList] = useState<BundleDtoWithLinksLength[]>([]);

    const checkedItems = useRef<Record<number, boolean>>({});
    const [selectedItems, setSelectedItems] = useState<CheckedItem[] | null>(null);
    const [selectedSection, setSelectedSection] = useState(BundleTypes.IDEA);

    const history = useHistory();

    const dataList = selectedSection === BundleTypes.IDEA ? groupBundlesList : groupPromoCampaignsList;
    const { current: copyDataList } = selectedSection === BundleTypes.IDEA ? copyBundleList : copyRelatedCampaigns;
    const setDataList = selectedSection === BundleTypes.IDEA ? setBundlesList : setPromoCampaignsList;

    const isSelect = selectedItems !== null;

    const toggleSelect = () => clearSelectedItems(isSelect);

    const loadData = async () => {
        setLoading(true);
        try {
            const { groups = [] } = await getCampaignGroupList();
            const { bundles, relatedCampaigns } = groups.reduce<BundlesRelatedCampaigns>((result, group) => {
                const key = group.type === BundleTypes.IDEA ? groupTypes.BUNDLE : groupTypes.RELATED_CAMPAIGN;
                return {
                    ...result,
                    [key]: [...result[key], { ...group, linksLength: group.links.length }],
                };
            }, { bundles: [], relatedCampaigns: [] });

            copyBundleList.current = bundles;
            copyRelatedCampaigns.current = relatedCampaigns;
            setBundlesList(bundles);
            setPromoCampaignsList(relatedCampaigns);
        } catch (err) {
            console.error(err);
        }
        setLoading(false);
    };

    useEffect(() => {
        loadData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const clearSelectedItems = (offSelect?: boolean, saveSelecting?: boolean) => {
        checkedItems.current = {};
        setSelectedItems(prev => offSelect || (saveSelecting && !prev) ? null : []);
    };

    const handleSelectItem = (selectItem: CheckedItem) => {
        setSelectedItems(prev => {
            if (!prev) {
                return prev;
            }

            const { id: selectedId, checked } = selectItem;
            checkedItems.current[selectedId] = checked;

            if (checked) {
                return [...prev, selectItem];
            }

            return prev.filter(({ id }) => id !== selectedId);
        });
    };

    const handleSelectAllItem = () => {
        const isAllChecked = dataList.length === selectedItems?.length;
        if (isAllChecked) {
            clearSelectedItems();
        } else {
            const newSelectedItems = dataList.map(({ id, name }) => {
                checkedItems.current[id] = true;
                return { id, name, checked: true };
            });
            setSelectedItems(newSelectedItems);
        }
    };

    const handleChangeSection = (e: RadioChangeEvent) => {
        const sectionType = e.target.value;
        clearSelectedItems(true);
        setSelectedSection(sectionType);
    };

    const refreshList = () => {
        loadData();
        clearSelectedItems(true);
    };

    const onAddGroupClick = () => {
        history.push(`${matchPath}${GROUPS_PAGES.ADD_GROUP}?type=${selectedSection}`);
    };

    const buttons: ButtonProps[] = [
        isSelect ? {
            type: 'primary',
            label: dataList.length && dataList.length === selectedItems?.length
                ? BUTTON_TEXT.CANCEL_ALL
                : BUTTON_TEXT.SELECT_ALL,
            onClick: handleSelectAllItem,
        } : {
            type: 'primary',
            label: BUTTON_TEXT.ADD,
            onClick: onAddGroupClick,
        },
        {
            label: isSelect ? BUTTON_TEXT.CANCEL : BUTTON_TEXT.SELECT,
            onClick: toggleSelect,
        },
    ];

    const onChangeInput = useCallback(() => {
        clearSelectedItems(false, true);
    }, []);

    return (
        <div className={cn(styles.container, { [styles.notEmpty]: copyDataList.length && !loading })}>
            <Header buttonBack={false} menuMode />
            <Radio.Group
                onChange={handleChangeSection}
                value={selectedSection}
                className={styles.section}
                options={GROUP_OPTIONS}
                optionType="button"
            />
            {loading ? (
                <div className={styles.loadingContainer}>
                    <div className={styles.loading}>
                        <SyncOutlined spin />
                    </div>
                </div>
            ) : !copyDataList.length ? (
                <EmptyGroup
                    onCreateClick={onAddGroupClick}
                    title={
                        selectedSection === BundleTypes.IDEA
                            ? TITLE.EMPTY_BUNDLES
                            : TITLE.EMPTY_PROMO_CAMPAIGNS
                    }
                    preTitle={
                        selectedSection === BundleTypes.IDEA
                            ? PRE_TITLE.CREATE_BUNDLE
                            : PRE_TITLE.CREATE_PROMO_CAMPAIGN
                    }
                />
            ) : (
                <>
                    <HeaderWithActions<BundleDtoWithLinksLength>
                        title={selectedSection === BundleTypes.IDEA ? TITLE.BUNDLE : TITLE.PROMO_CAMPAIGNS}
                        buttons={buttons}
                        triggerResetParams={selectedSection}
                        resetLabel={RESET_LABEL}
                        setDataList={setDataList}
                        copyDataList={copyDataList}
                        matchPath={matchPath}
                        inputPlaceholder={selectedSection === BundleTypes.IDEA ? SEARCH_INPUT.BUNDLE_SEARCH : SEARCH_INPUT.PROMO_SEARCH}
                        sortByFieldKey="name"
                        menuItems={DROPDOWN_SORT_MENU}
                        onChangeInput={onChangeInput}
                    />
                    <div className={styles.content}>
                        <GroupListByType
                            type={selectedSection}
                            checkedItems={checkedItems.current}
                            dataList={dataList}
                            matchPath={matchPath}
                            select={isSelect}
                            handleSelectItem={handleSelectItem}
                        />
                    </div>
                    {isSelect && (
                        <div className={styles.footer}>
                            <span>{`Выбрано групп: ${selectedItems!.length}`}</span>
                            <TableDeleteModal<CheckedItem>
                                sourceForRemove={selectedItems || []}
                                listIdForRemove={(selectedItems || []).map(item => item.id)}
                                deleteFunction={deleteCampaignGroup}
                                refreshTable={refreshList}
                                modalSuccessTitle={TITLE.MODAL_SUCCESS_TITLE}
                                modalTitle={TITLE.MODAL_TITLE}
                                listNameKey="name"
                            >
                                <Button
                                    type="primary"
                                    disabled={!selectedItems?.length}
                                    danger
                                >
                                    {BUTTON_TEXT.DELETE}
                                </Button>
                            </TableDeleteModal>
                        </div>
                    )}
                </>
            )}
        </div>
    );
};

export default GroupList;
