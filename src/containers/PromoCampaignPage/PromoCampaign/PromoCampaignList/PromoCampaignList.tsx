import React, { useCallback, useEffect, useRef, useState } from 'react';
import { useHistory, useRouteMatch } from 'react-router-dom';
import { SortableContainer, SortableElement } from 'react-sortable-hoc';
import { SyncOutlined } from '@ant-design/icons';
import PromoCampaignItem from './PromoCampaignListItem';
import HeaderWithActions, { ButtonProps } from '@components/HeaderWithActions';
import Header from '@components/Header';
import { getFilteredPromoCampaignList, reorderPromoCampaigns } from '@apiServices/promoCampaignService';
import { arrayMove, defaultSearchParams } from '@utils/helper';
import { getLinkForCreatePromoCampaign } from '@utils/appNavigation';
import { BUTTON_TEXT } from '@constants/common';
import { PromoCampaignDto } from '@types';

import style from './PromoCampaignList.module.css';

const SortableContainerList = SortableContainer((props: { children: React.ReactNodeArray; }) => <div>{props.children}</div>);
const SortableElementItem = SortableElement(PromoCampaignItem);

const SEARCH_INPUT_PLACEHOLDER = 'Поиск промо-кампании';

const DROPDOWN_SORT_MENU = [
    { name: 'type', label: 'По типу' },
    { name: 'promoCodeType', label: 'По промокоду' },
    { name: 'finishDate', label: 'По дате окончания' },
    { name: 'active', label: 'По статусу' },
];

const PromoCampaignList: React.FC = () => {
    const history = useHistory();
    const match = useRouteMatch();
    const [promoCampaignList, setPromoCampaignList] = useState<PromoCampaignDto[]>([]);
    const copyPromoCampaignList = useRef<PromoCampaignDto[]>([]);
    const [loading, setLoading] = useState(true);
    const [sortable, setSortable] = useState(false);

    const loadData = useCallback(async () => {
        setLoading(true);
        try {
            const { promoCampaignDtoList = [] } = await getFilteredPromoCampaignList(defaultSearchParams);
            setPromoCampaignList(promoCampaignDtoList);
            copyPromoCampaignList.current = promoCampaignDtoList;
        } catch (e) {
            // TODO: add error handler
            console.error(e);
        }

        setLoading(false);
    }, []);

    useEffect(() => {
        loadData();
        // `history.location` need for request data after change client-app in sidebar
    }, [loadData, history.location]);

    const onSortEnd = useCallback(({ oldIndex, newIndex }) => {
        setPromoCampaignList((state) => arrayMove(state, oldIndex, newIndex));
    }, []);

    const toggleSortable = useCallback(() => setSortable((state) => !state), []);

    const updateData = useCallback(() => {
        loadData();
        setSortable(false);
    }, [loadData]);

    const onSave = useCallback(async () => {
        const idMap = promoCampaignList.reduce((result, elem, index) => ({ ...result, [elem.id]: index }), {});
        setLoading(true);
        try {
            await reorderPromoCampaigns(idMap);
            loadData();
        } catch (e) {
            // TODO: Add error handler
            console.warn(e);
        }

        setLoading(false);
        setSortable(false);
    }, [loadData, promoCampaignList]);

    const onAddClick = useCallback(() => {
        history.push(getLinkForCreatePromoCampaign());
    }, [history]);

    const buttons: ButtonProps[] = sortable ? [
        { type: 'primary', label: BUTTON_TEXT.SAVE, onClick: onSave },
        { label: BUTTON_TEXT.CANCEL, onClick: updateData },
    ] : [
        { type: 'primary', label: BUTTON_TEXT.ADD, onClick: onAddClick },
        { label: BUTTON_TEXT.CHANGE_ORDER, onClick: toggleSortable, disabled: (params) => !!(params?.sortBy || params?.filterText) },
    ];

    return (
        <>
            {loading && (
                <div className={style.loadingContainer}>
                    <div className={style.loading}>
                        <SyncOutlined spin />
                    </div>
                </div>
            )}
            <div className={style.container}>
                <Header menuMode buttonBack={false} />
                <HeaderWithActions<PromoCampaignDto>
                    buttons={buttons}
                    showSearchInput={!sortable}
                    showSorting={!sortable}
                    triggerResetParams={history.location}
                    sortByFieldKey="name"
                    setDataList={setPromoCampaignList}
                    copyDataList={copyPromoCampaignList.current}
                    matchPath={match.path}
                    inputPlaceholder={SEARCH_INPUT_PLACEHOLDER}
                    menuItems={DROPDOWN_SORT_MENU}
                    enableHistoryReplace={false}
                />
                <div className={style.content}>
                    <SortableContainerList
                        useWindowAsScrollContainer
                        onSortEnd={onSortEnd}
                    >
                        {promoCampaignList.map((promoCampaign, index) => (
                            <SortableElementItem
                                key={promoCampaign.id}
                                promoCampaign={promoCampaign}
                                onDeleteItem={updateData}
                                index={index}
                                disabled={!sortable}
                                sortable={sortable}
                                matchUrl={match.url}
                            />
                        ))}
                    </SortableContainerList>
                </div>
            </div>
        </>
    );
};

export default PromoCampaignList;
