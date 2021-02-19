import React, { useCallback, useEffect, useState, useMemo } from 'react';
import { useLocation } from 'react-router-dom';
import { arrayMove, SortableContainer, SortableElement } from 'react-sortable-hoc';
import { SyncOutlined } from '@ant-design/icons';

import Header from '../../components/Header/Header';
import HeaderWithActions from '../../components/HeaderWithActions/HeaderWithActions';
import ClientAppItem from './ClientAppItem/ClientAppItem';

import { getClientAppList, reorderClientApp } from '../../api/services/clientAppService';
import { sortItemsBySearchParams } from '../../utils/helper';
import { CLIENT_APPS_PAGES } from '../../constants/route';
import { getRole } from '../../api/services/sessionService';
import ROLES from '../../constants/roles';

import style from './ClientAppPage.module.css';

const SortableContainerList = SortableContainer(props => <div>{ props.children }</div>);
const SortableElementItem = SortableElement(ClientAppItem);


const SEARCH_INPUT_PLACEHOLDER = 'Поиск по названию';

const BUTTON_TEXT = {
    SAVE: 'Сохранить',
    ADD: 'Добавить',
    CHANGE_ORDER: 'Изменить порядок',
    CANCEL: 'Отменить',
};

const DROPDOWN_SORT_MENU = [
    { name: 'displayName', label: 'По названию' },
    { name: 'code', label: 'По коду' },
];

const defaultSearchParams = {
    sortBy: '',
    direction: 'ASC',
    filterText: '',
};

const getURLSearchParams = ({ ...rest }) => new URLSearchParams(rest).toString();

const ClientAppPage = ({ matchPath, history }) => {
    const { search } = useLocation();

    const [itemList, setItemList] = useState([]);
    const [copyOfItemList, setCopyOfItemList] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isSortable, setIsSortable] = useState(false);
    const [params, setParams] = useState(defaultSearchParams);

    const role = useMemo(() => getRole(), []);

    const sortClientApp = useCallback((searchParams = defaultSearchParams) => {
        setParams(searchParams);
        history.replace(`${matchPath}?${getURLSearchParams(searchParams)}`);
        if (!searchParams.filterText && !searchParams.sortBy) {
            setItemList(copyOfItemList);
            return;
        }

        setItemList(sortItemsBySearchParams(searchParams, copyOfItemList, 'displayName'));
    }, [copyOfItemList, history, matchPath]);

    const loadData = useCallback(async (params = defaultSearchParams) => {
        setIsLoading(true);

        try {
            history.replace(`${matchPath}?${getURLSearchParams(params)}`);
            const { clientApplicationDtoList: appList = [] } = await getClientAppList();
            const withoutDeletedApps = appList.filter(({ isDeleted }) => !isDeleted);
            setItemList(sortItemsBySearchParams(params, withoutDeletedApps, 'displayName'));
            setCopyOfItemList(withoutDeletedApps);
        } catch (error) {
            console.warn(error);
        }

        setIsLoading(false);
    }, [history, matchPath]);

    useEffect(() => {
        const urlSearchParams = new URLSearchParams(search);
        const searchParamsFromUrl = {};

        Object.keys(defaultSearchParams).forEach((key) => {
            const searchValue = urlSearchParams.get(key);
            searchParamsFromUrl[key] = searchValue || defaultSearchParams[key];
        });

        loadData(searchParamsFromUrl);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [loadData]);

    const onSearchInput = (filterText = '') => {
        const paramsCopy = {
            ...params,
            filterText
        };

        sortClientApp(paramsCopy);
    };

    const toggleSortable = () => setIsSortable((state) => !state);

    const onSortEnd = useCallback(({ oldIndex, newIndex }) => {
        setItemList((state) => arrayMove(state, oldIndex, newIndex));
    }, []);

    const onCancelSortable = async () => {
        setItemList(copyOfItemList);
        setIsSortable(false);
    };

    const onSave = async () => {
        const idMap = itemList.reduce((result, elem, index) => ({ ...result, [elem.id]: index }), {});

        setIsLoading(true);
        try {
            await reorderClientApp({ idMap });
            await loadData();
        } catch (error) {
            console.warn(error);
        }

        setIsLoading(false);
        setIsSortable(false);
    };

    const onAddClick = () => history.push(`${ matchPath }${ CLIENT_APPS_PAGES.ADD_APP }`);

    const onSortChange = useCallback((sortBy) => {
        if (typeof sortBy !== 'string') {
            sortBy = '';
        }

        if (!sortBy && !params.sortBy) return;

        const searchParams = {
            ...params, sortBy,
            direction: !sortBy || params.direction === 'DESC' ? 'ASC' : 'DESC',
        };

        sortClientApp(searchParams);
    }, [params, sortClientApp]);

    const buttons = [];

    if (role === ROLES.ADMIN) {

        if (isSortable) {
            buttons.push(
                { type: 'primary', label: BUTTON_TEXT.SAVE, onClick: onSave },
                { label: BUTTON_TEXT.CANCEL, onClick: onCancelSortable },
            );
        } else {
            buttons.push(
                { type: 'primary', label: BUTTON_TEXT.ADD, onClick: onAddClick },
                { label: BUTTON_TEXT.CHANGE_ORDER, onClick: toggleSortable, disabled: !(!params.sortBy && !params.filterText) },
            );
        }
    }

    const searchInput = {
        placeholder: SEARCH_INPUT_PLACEHOLDER,
        onChange: onSearchInput,
        value: params.filterText,
    };

    const sortingBy = {
        menuItems: DROPDOWN_SORT_MENU,
        onMenuItemClick: onSortChange,
        withReset: true,
        sortBy: params.sortBy,
    };

    return (
        <>
            { isLoading && (
                <div className={ style.loadingContainer }>
                    <div className={ style.loading }>
                        <SyncOutlined spin />
                    </div>
                </div>
            ) }
            <div className={ style.container }>
                <Header buttonBack={ false } />
                <HeaderWithActions
                    buttons={ buttons }
                    searchInput={ searchInput }
                    showSearchInput={ !isSortable }
                    showSorting={ !isSortable }
                    sortingBy={ sortingBy }
                    classNameByInput={ style.searchInput }
                />
                <div className={ style.content }>
                    <SortableContainerList
                        useWindowAsScrollContainer
                        onSortEnd={ onSortEnd }
                    >
                        { itemList.map((item, index) => (
                            <SortableElementItem
                                key={ item.id }
                                item={ item }
                                isSortable={ isSortable }
                                disabled={ !isSortable }
                                index={ index }
                                matchUrl={ matchPath }
                                history={ history }
                                forceUpdate={ loadData }
                                tooltipIsVisible={ role === ROLES.ADMIN }
                            />
                        )) }
                    </SortableContainerList>
                </div>
            </div>
        </>
    );
};

export default ClientAppPage;