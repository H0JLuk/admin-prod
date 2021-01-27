import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { useHistory, useRouteMatch } from 'react-router-dom';
import { SortableContainer, SortableElement } from 'react-sortable-hoc';
import { SyncOutlined } from '@ant-design/icons';
import debounce from 'lodash/debounce';
import PromoCampaignItem from './PromoCampaignListItem/PromoCampaignListItem';
import HeaderWithActions from '../../../../components/HeaderWithActions/HeaderWithActions';
import Header from '../../../../components/Header/Header';
import { getFilteredPromoCampaignList, reorderPromoCampaigns } from '../../../../api/services/promoCampaignService';
import { arrayMove } from '../../../../utils/helper';
import { getLinkForCreatePromoCampaign } from '../../../../utils/appNavigation';

import style from './PromoCampaignList.module.css';

const SortableContainerList = SortableContainer(props => <div>{ props.children }</div>);
const SortableElementItem = SortableElement(PromoCampaignItem);

const SEARCH_INPUT_PLACEHOLDER = 'Поиск промо-кампании';

const BUTTON_TEXT = {
    SAVE: 'Сохранить',
    ADD: 'Добавить',
    CHANGE_ORDER: 'Изменить порядок',
    CANCEL: 'Отменить',
};

const DROPDOWN_SORT_MENU = [
    { name: 'type', label: 'По типу' },
    { name: 'promoCodeType', label: 'По промокоду' },
    { name: 'finishDate', label: 'По дате окончания' },
    { name: 'active', label: 'По статусу' },
];

const defaultSearchParams = {
    sortBy: '',
    direction: 'ASC',
    filterText: '',
};

const PromoCampaignList = () => {
    const history = useHistory();
    const match = useRouteMatch();
    const [items, setItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const [sortable, setSortable] = useState(false);
    const [params, setParams] = useState(defaultSearchParams);

    const loadData = useCallback(async (searchParams = defaultSearchParams) => {
        try {
            const { promoCampaignDtoList = [] } = await getFilteredPromoCampaignList(searchParams);

            setParams(searchParams);
            setItems(promoCampaignDtoList);
        } catch (e) {
            // TODO: add error handler
            console.error(e);
        }
    }, []);

    useEffect(() => {
        (async () => {
            await loadData();
            setLoading(false);
        })();
        // `history.location` need for request data after change client-app in sidebar
    }, [loadData, history.location]);

    // eslint-disable-next-line react-hooks/exhaustive-deps
    const loadDataDebounced = useCallback(debounce(loadData, 500), [loadData]);

    const onSortEnd = useCallback(({ oldIndex, newIndex }) => {
        setItems((state) => arrayMove(state, oldIndex, newIndex));
    }, []);

    const toggleSortable = useCallback(() => setSortable((state) => !state), []);

    const forceUpdateData = useCallback(async () => {
        setLoading(true);
        await loadData(params);
        setLoading(false);
    }, [loadData, params]);

    const onCancelSortable = useCallback(async () => {
        await forceUpdateData();
        setSortable(false);
    }, [forceUpdateData]);

    const onSortChange = useCallback(async (sortBy) => {
        if (typeof sortBy !== 'string') {
            sortBy = '';
        }

        setLoading(true);
        try {
            await loadData({
                ...params,
                sortBy: sortBy || '',
                direction: !sortBy || params.direction === 'DESC' ? 'ASC' : 'DESC',
            });
        } catch (e) {
            // TODO: add error handler
            console.error(e);
        }

        setLoading(false);
    }, [loadData, params]);

    const onSearchInput = useCallback((filterText = '') => {
        setParams({ ...params, filterText });
        loadDataDebounced({ ...params, filterText });
    }, [loadDataDebounced, params]);

    const onSave = useCallback(async () => {
        const idMap = items.reduce((result, elem, index) => ({ ...result, [elem.id]: index }), {});
        setLoading(true);
        try {
            await reorderPromoCampaigns(idMap);
        } catch (e) {
            // TODO: Add error handler
            console.warn(e);
        }

        setLoading(false);
        setSortable(false);
    }, [items]);

    const onAddClick = useCallback(() => {
        history.push(getLinkForCreatePromoCampaign());
    }, [history]);

    const buttons = useMemo(() => {
        if (sortable) {
            return [
                { type: 'primary', label: BUTTON_TEXT.SAVE, onClick: onSave },
                { label: BUTTON_TEXT.CANCEL, onClick: onCancelSortable },
            ];
        }

        return [
            { type: 'primary', label: BUTTON_TEXT.ADD, onClick: onAddClick },
            { label: BUTTON_TEXT.CHANGE_ORDER, onClick: toggleSortable, disabled: !(!params.sortBy && !params.filterText) },
        ];
    }, [sortable, params, onSave, toggleSortable, onAddClick, onCancelSortable]);

    const searchInput = useMemo(() => ({
        placeholder: SEARCH_INPUT_PLACEHOLDER,
        onChange: onSearchInput,
        value: params.filterText,
    }), [onSearchInput, params.filterText]);

    const sortingBy = useMemo(() => ({
        menuItems: DROPDOWN_SORT_MENU,
        onMenuItemClick: onSortChange,
        withReset: true,
        sortBy: params.sortBy,
    }), [onSortChange, params.sortBy]);

    return (
        <>
            {loading && (
                <div className={ style.loadingContainer }>
                    <div className={ style.loading }>
                        <SyncOutlined spin />
                    </div>
                </div>
            )}
            <div className={ style.container }>
                <Header menuMode buttonBack={ false } />
                <HeaderWithActions
                    buttons={ buttons }
                    searchInput={ searchInput }
                    showSearchInput={ !sortable }
                    showSorting={ !sortable }
                    sortingBy={ sortingBy }
                    classNameByInput={ style.searchInput }
                />
                <div className={ style.content }>
                    <SortableContainerList
                        useWindowAsScrollContainer
                        onSortEnd={ onSortEnd }
                    >
                        {items.map((promoCampaign, index) => (
                            <SortableElementItem
                                key={ promoCampaign.id }
                                promoCampaign={ promoCampaign }
                                onDeleteItem={ forceUpdateData }
                                index={ index }
                                disabled={ !sortable }
                                sortable={ sortable }
                                matchUrl={ match.url }
                            />
                        ))}
                    </SortableContainerList>
                </div>
            </div>
        </>
    );
};

export default PromoCampaignList;
