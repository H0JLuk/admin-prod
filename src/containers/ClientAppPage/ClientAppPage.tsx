import React, { useCallback, useEffect, useState, useMemo, useRef } from 'react';
import { SortableContainer, SortableContainerProps, SortableElement } from 'react-sortable-hoc';
import { SyncOutlined } from '@ant-design/icons';
import { History } from 'history';

import Header from '@components/Header';
import HeaderWithActions, { ButtonProps } from '@components/HeaderWithActions';
import ClientAppItem from './ClientAppItem';

import { getActiveClientApps, reorderClientApp } from '@apiServices/clientAppService';
import { getRole } from '@apiServices/sessionService';
import { arrayMove } from '@utils/helper';
import { CLIENT_APPS_PAGES } from '@constants/route';
import ROLES from '@constants/roles';
import { BUTTON_TEXT } from '@constants/common';
import { ClientAppDto } from '@types';

import style from './ClientAppPage.module.css';

const SortableContainerList = SortableContainer((props: SortableContainerListProps) => <div>{props.children}</div>);
const SortableElementItem = SortableElement(ClientAppItem);

const SEARCH_INPUT_PLACEHOLDER = 'Поиск по названию';

const DROPDOWN_SORT_MENU = [
    { name: 'displayName', label: 'По названию' },
    { name: 'code', label: 'По коду' },
];

type ClientAppPageProps = {
    matchPath: string;
    history: History;
};

type SortableContainerListProps = {
    children: Array<SortableContainerProps>;
};


const ClientAppPage: React.FC<ClientAppPageProps> = ({ matchPath, history }) => {
    const [dataList, setDataList] = useState<ClientAppDto[]>([]);
    const copyDataList = useRef<ClientAppDto[]>([]);
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
        const idMap = dataList.reduce<Record<number, number>>((result, elem, index) => ({ ...result, [elem.id]: index }), {});

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

    const buttons: ButtonProps[] = [];

    if (role === ROLES.ADMIN) {

        if (isSortable) {
            buttons.push(
                { type: 'primary', label: BUTTON_TEXT.SAVE, onClick: onSave },
                { label: BUTTON_TEXT.CANCEL, onClick: onCancelSortable },
            );
        } else {
            buttons.push(
                { type: 'primary', label: BUTTON_TEXT.ADD, onClick: onAddClick },
                { label: BUTTON_TEXT.CHANGE_ORDER, onClick: toggleSortable, disabled: (params) => !!(params?.sortBy || params?.filterText) },
            );
        }
    }

    return (
        <>
            {isLoading && (
                <div className={style.loadingContainer}>
                    <div className={style.loading}>
                        <SyncOutlined spin />
                    </div>
                </div>
            )}
            <div className={style.container}>
                <Header buttonBack={false} />
                <HeaderWithActions<ClientAppDto>
                    buttons={buttons}
                    setDataList={setDataList}
                    matchPath={matchPath}
                    copyDataList={copyDataList.current}
                    inputPlaceholder={SEARCH_INPUT_PLACEHOLDER}
                    filterByFieldKey="displayName"
                    menuItems={DROPDOWN_SORT_MENU}
                />
                <div className={style.content}>
                    <SortableContainerList
                        useWindowAsScrollContainer
                        onSortEnd={onSortEnd}
                    >
                        {dataList.map((item, index) => (
                            <SortableElementItem
                                key={item.id}
                                item={item}
                                isSortable={isSortable}
                                disabled={!isSortable}
                                index={index}
                                matchPath={matchPath}
                                history={history}
                                forceUpdate={loadData}
                                tooltipIsVisible={role === ROLES.ADMIN}
                            />
                        ))}
                    </SortableContainerList>
                </div>
            </div>
        </>
    );
};

export default ClientAppPage;
