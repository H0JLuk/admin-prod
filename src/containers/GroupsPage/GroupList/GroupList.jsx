import React, { useEffect, useRef, useState } from 'react';
import cn from 'classnames';
import { useHistory, useLocation } from 'react-router-dom';
import { Button, Radio } from 'antd';
import { SyncOutlined } from '@ant-design/icons';

import Header from '../../../components/Header/Header';
import HeaderWithActions from '../../../components/HeaderWithActions/HeaderWithActions';
import TableDeleteModal from '../../../components/TableDeleteModal/TableDeleteModal';
import { getCampaignGroupList, deleteCampaignGroup } from '../../../api/services/campaignGroupService';
import { defaultSearchParams, getSearchParamsFromUrl, sortItemsBySearchParams } from '../../../utils/helper';
import { GROUPS_PAGES } from '../../../constants/route';
import { EmptyGroup, GroupListByType } from './GroupListComponents';
import {
    TYPES,
    BUTTON,
    SEARCH_INPUT,
    DROPDOWN_SORT_MENU,
    GROUP_OPTIONS,
    TITLE,
    PRE_TITLE,
    RESET_LABEL,
    DIRECTION,
    sortByFieldKey,
    groupTypes,
} from './groupListConstants';

import styles from './GroupList.module.css';

const getURLSearchParams = (params) => new URLSearchParams(params).toString();

const GroupList = ({ matchPath }) => {
    const [loading, setLoading] = useState(true);
    const copyBundleList = useRef([]);
    const copyRelatedCampaigns = useRef([]);
    const [groupBundlesList, setBundlesList] = useState([]);
    const [groupPromoCampaignsList, setPromoCampaignsList] = useState([]);

    const checkedItems = useRef({});
    const [selectedItems, setSelectedItems] = useState(null);
    const [selectedSection, setSelectedSection] = useState(TYPES.IDEA);
    const [modalIsOpen, setModalIsOpen] = useState(false);

    const [params, setParams] = useState(defaultSearchParams);
    const history = useHistory();
    const { search } = useLocation();

    const dataList = selectedSection === TYPES.IDEA ? groupBundlesList : groupPromoCampaignsList;
    const { current: copyDataList } = selectedSection === TYPES.IDEA ? copyBundleList : copyRelatedCampaigns;
    const setDataList = selectedSection === TYPES.IDEA ? setBundlesList : setPromoCampaignsList;

    const isSelect = selectedItems !== null;

    const toggleSelect = () => clearSelectedItems(isSelect);
    const toggleModal = () => setModalIsOpen(prev => !prev);

    const loadData = async (searchParams = defaultSearchParams) => {
        const urlSearchParams = getURLSearchParams(searchParams);
        setLoading(true);
        try {
            const { groups = [] } = await getCampaignGroupList();
            const { bundles, relatedCampaigns } = groups.reduce((result, group) => {
                const key = group.type === TYPES.IDEA ? groupTypes.BUNDLE : groupTypes.RELATED_CAMPAIGN;
                return {
                    ...result,
                    [key]: [...result[key], { ...group, linksLength: group.links.length }],
                };
            }, { bundles: [], relatedCampaigns: [] });

            copyBundleList.current = bundles;
            copyRelatedCampaigns.current = relatedCampaigns;
            setBundlesList(sortItemsBySearchParams(searchParams, bundles, sortByFieldKey.NAME));
            setPromoCampaignsList(sortItemsBySearchParams(searchParams, relatedCampaigns, sortByFieldKey.NAME));
            setParams({ ...searchParams });
            history.replace(`${matchPath}?${urlSearchParams}`);
        } catch (err) {
            console.error(err);
        }
        setLoading(false);
    };

    useEffect(() => {
        loadData(getSearchParamsFromUrl(search, defaultSearchParams));
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const handleSelectItem = (selectItem) => {
        setSelectedItems(prev => {
            const { id: selectedId, checked } = selectItem;
            checkedItems.current[selectedId] = checked;

            if (checked) {
                return [...prev, selectItem];
            }

            return prev.filter(({ id }) => id !== selectedId);
        });
    };

    const clearSelectedItems = (offSelect, saveSelecting) => {
        checkedItems.current = {};
        setSelectedItems(prev => offSelect || (saveSelecting && !prev) ? null : []);
    };

    const handleSelectAllItem = () => {
        const isAllChecked = dataList.length === selectedItems.length;
        if (isAllChecked) {
            clearSelectedItems();
        } else {
            const newSelectedItems = dataList.map(({ id, name }) => {
                checkedItems.current[id] = true;
                return { id, name };
            });
            setSelectedItems(newSelectedItems);
        }
    };

    const handleChangeSection = (e) => {
        const sectionType = e.target.value;
        clearSelectedItems(true);
        setSelectedSection(sectionType);
        sortData();
    };

    const refreshList = () => {
        loadData(params);
        clearSelectedItems(true);
    };

    const sortData = (searchParams = defaultSearchParams) => {
        setParams(searchParams);
        history.replace(`${matchPath}?${getURLSearchParams(searchParams)}`);

        if (!searchParams.filterText && !searchParams.sortBy) {
            setDataList(copyDataList);
            return;
        }

        setDataList(sortItemsBySearchParams(searchParams, copyDataList, sortByFieldKey.NAME));
    };

    const handleSearch = (filterText = '') => {
        clearSelectedItems(false, true);
        sortData({ ...params, filterText });
    };

    const changeSort = (sortBy) => {
        if (typeof sortBy !== 'string') {
            sortBy = '';
        }

        if (!sortBy && !params.sortBy) return;

        const searchParams = {
            ...params, sortBy,
            direction: !sortBy || params.direction === DIRECTION.DESC ? DIRECTION.ASC : DIRECTION.DESC,
        };
        sortData(searchParams);
    };

    const onAddGroupClick = () => {
        history.push(`${matchPath}${GROUPS_PAGES.ADD_GROUP}?type=${selectedSection.toLowerCase()}`);
    };

    const buttons = [
        isSelect ? {
            type: 'primary',
            label: dataList.length && dataList.length === selectedItems.length
                ? BUTTON.CHOOSE_ALL_REMOVE
                : BUTTON.CHOOSE_ALL,
            onClick: handleSelectAllItem,
        } : {
            type: 'primary',
            label: BUTTON.ADD,
            onClick: onAddGroupClick,
        },
        {
            label: isSelect ? BUTTON.CANCEL : BUTTON.CHOOSE,
            onClick: toggleSelect,
        }
    ];

    const searchInput = {
        placeholder: selectedSection === TYPES.IDEA ? SEARCH_INPUT.BUNDLE_SEARCH : SEARCH_INPUT.PROMO_SEARCH,
        value: params.filterText,
        onChange: handleSearch,
    };

    const sortingBy = {
        menuItems: DROPDOWN_SORT_MENU,
        onMenuItemClick: changeSort,
        sortBy: params.sortBy,
        withReset: params.sortBy !== '',
    };

    return (
        <div className={ cn(styles.container, { [styles.notEmpty]: !!copyDataList.length && !loading }) }>
            <Header buttonBack={ false } menuMode />
            <Radio.Group
                onChange={ handleChangeSection }
                value={ selectedSection }
                className={ styles.section }
                options={ GROUP_OPTIONS }
                optionType="button"
            />
            { loading ? (
                <div className={ styles.loadingContainer }>
                    <div className={ styles.loading }>
                        <SyncOutlined spin />
                    </div>
                </div>
            ) : !copyDataList.length ? (
                <EmptyGroup
                    onCreateClick={ onAddGroupClick }
                    title={
                        selectedSection === TYPES.IDEA
                            ? TITLE.EMPTY_BUNDLES
                            : TITLE.EMPTY_PROMO_CAMPAIGNS
                    }
                    preTitle={
                        selectedSection === TYPES.IDEA
                            ? PRE_TITLE.CREATE_BUNDLE
                            : PRE_TITLE.CREATE_PROMO_CAMPAIGN
                    }
                />
            ) : (
                <>
                    <HeaderWithActions
                        title={ selectedSection === TYPES.IDEA ? TITLE.BUNDLE : TITLE.PROMO_CAMPAIGNS }
                        buttons={ buttons }
                        searchInput={ searchInput }
                        showSearchInput={ true }
                        showSorting
                        sortingBy={ sortingBy }
                        classNameByInput={ styles.searchInput }
                        resetLabel={ RESET_LABEL }
                    />
                    <div className={ styles.content }>
                        <GroupListByType
                            type={ selectedSection }
                            checkedItems={ checkedItems.current }
                            dataList={ dataList }
                            matchPath={ matchPath }
                            select={ isSelect }
                            handleSelectItem={ handleSelectItem }
                        />
                    </div>
                    { isSelect && (
                        <div className={ styles.footer }>
                            <span>{ `Выбрано групп: ${selectedItems.length}` }</span>
                            <Button
                                disabled={ !selectedItems.length }
                                onClick={ toggleModal }
                                type="primary"
                                danger
                            >
                                { BUTTON.DELETE }
                            </Button>
                        </div>
                    ) }
                    <TableDeleteModal
                        modalClose={ toggleModal }
                        sourceForRemove={ selectedItems || [] }
                        listIdForRemove={ (selectedItems || []).map(item => item.id) }
                        deleteFunction={ deleteCampaignGroup }
                        refreshTable={ refreshList }
                        modalSuccessTitle={ TITLE.MODAL_SUCCESS_TITLE }
                        visible={ modalIsOpen }
                        modalTitle={ TITLE.MODAL_TITLE }
                        listNameKey={ sortByFieldKey.NAME }
                    />
                </>
            ) }
        </div>
    );
};

export default GroupList;
