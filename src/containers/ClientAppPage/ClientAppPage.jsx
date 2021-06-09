import React, { useCallback, useEffect, useState, useMemo, useRef } from 'react';
import { SortableContainer, SortableElement } from 'react-sortable-hoc';
import { SyncOutlined } from '@ant-design/icons';

import Header from '../../components/Header/Header';
import HeaderWithActions from '../../components/HeaderWithActions/HeaderWithActions';
import ClientAppItem from './ClientAppItem/ClientAppItem';

import { getActiveClientApps, reorderClientApp } from '../../api/services/clientAppService';
import { CLIENT_APPS_PAGES } from '../../constants/route';
import { getRole } from '../../api/services/sessionService';
import ROLES from '../../constants/roles';
import { arrayMove } from '../../utils/helper';

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

const sortByFieldKey = {
    NAME: 'displayName',
};

const ClientAppPage = ({ matchPath, history }) => {
    const [dataList, setDataList] = useState([]);
    const copyDataList = useRef([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isSortable, setIsSortable] = useState(false);

    const role = useMemo(() => getRole(), []);

    const loadData = useCallback(async () => {
        setIsLoading(true);

        try {
            const clientAppList = await getActiveClientApps();
            copyDataList.current = clientAppList;
            setDataList(clientAppList);
        } catch (error) {
            console.warn(error);
        }

        setIsLoading(false);
    }, []);

    useEffect(() => {
        loadData();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [loadData]);

    const toggleSortable = () => setIsSortable((state) => !state);

    const onSortEnd = useCallback(({ oldIndex, newIndex }) => {
        setDataList((state) => arrayMove(state, oldIndex, newIndex));
    }, []);

    const onCancelSortable = async () => {
        setDataList(copyDataList.current);
        setIsSortable(false);
    };

    const onSave = async () => {
        const idMap = dataList.reduce((result, elem, index) => ({ ...result, [elem.id]: index }), {});

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
                { label: BUTTON_TEXT.CHANGE_ORDER, onClick: toggleSortable, disabled: (params) => !!(params.sortBy || params.filterText) },
            );
        }
    }

    const searchAndSortParams = {
        setDataList,
        matchPath,
        copyDataList: copyDataList.current,
        inputPlaceholder: SEARCH_INPUT_PLACEHOLDER,
        sortByFieldKey: sortByFieldKey.NAME,
        menuItems: DROPDOWN_SORT_MENU,
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
                    { ...searchAndSortParams }
                />
                <div className={ style.content }>
                    <SortableContainerList
                        useWindowAsScrollContainer
                        onSortEnd={ onSortEnd }
                    >
                        { dataList.map((item, index) => (
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
