import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { useParams, useHistory, useLocation, generatePath, useRouteMatch } from 'react-router-dom';
import HeaderWithActions, { ButtonProps } from '@components/HeaderWithActions';
import PromoCampaignVisibilitySettingTable
    from './PromoCampaignVisibilitySettingTable';
import { Button, message, TablePaginationConfig, TableProps } from 'antd';
import Header from '@components/Header';
import PromoCampaignVisibilitySettingModal from './PromoCampaignVisibilitySettingModal';
import {
    deletePromoCampaignVisibilitySetting,
    editPromoCampaignVisibilitySetting,
    getPromoCampaignVisibilitySettings,
    changeVisibleOfVisibilitySettings,
} from '@apiServices/promoCampaignService';
import { getPathForCreatePromoCampaignVisibititySetting } from '@utils/appNavigation';
import { getSearchParamsFromUrl } from '@utils/helper';
import { VisibilitySettingDto } from '@types';
import { BUTTON_TEXT, DIRECTION } from '@constants/common';
import { SearchParams } from '@components/HeaderWithActions/types';

import styles from './PromoCampaignVisibilitySetting.module.css';

const defaultParams: SearchParams = {
    pageNo: 0,
    pageSize: 10,
    sortBy: 'id',
    direction: DIRECTION.ASC,
    filterText: '',
    totalElements: 0,
};

const locale = {
    items_per_page: '',
    prev_page:      'Назад',
    next_page:      'Вперед',
    jump_to:        'Перейти',
    prev_5:         'Предыдущие 5',
    next_5:         'Следующие 5',
    prev_3:         'Предыдущие 3',
    next_3:         'Следующие 3',
};

const SEARCH_SETTING = 'Поиск настройки';
const HEADER_TITLE = 'Настройки видимости промо-кампании';
const TURN_ON_ALL = 'Включить все';
const TURN_OFF_ALL = 'Выключить все';

const DROPDOWN_SORT_MENU = [
    { name: 'locationName', label: 'По локации' },
    { name: 'salePointName', label: 'По точке продажи' },
    { name: 'visible', label: 'По видимости' },
];

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const getURLSearchParams = ({ totalElements, ...rest }: Record<string, string | number>) =>
    new URLSearchParams(rest as Record<string, string>).toString();

type PromoCampaignVisibilitySettingProps = {
    searchAndSortMode: boolean;
    hideHeader: boolean;
    addNewByModal: boolean;
};

type accessSelectedSettings = VisibilitySettingDto & {
    index: number;
};

const PromoCampaignVisibilitySetting: React.FC<PromoCampaignVisibilitySettingProps> = ({ searchAndSortMode = true, hideHeader, addNewByModal }) => {
    const match = useRouteMatch();
    const { search, state } = useLocation();
    const history = useHistory();
    const { promoCampaignId } = useParams<{ promoCampaignId: string; }>();
    const [ selectedSettings, setSelectedSettings ] = useState<number[] | null>(null);
    const [ loading, setLoading ] = useState(true);
    const [ visibilitySettings, setVisibilitySettings ] = useState<VisibilitySettingDto[]>([]);
    const [ params, setParams ] = useState(defaultParams);
    const [ isModalVisible, setIsModalVisible ] = useState(false);

    const showModal = useCallback(() => setIsModalVisible(true), []);

    const closeModal = useCallback(() => setIsModalVisible(false), []);

    const loadData = useCallback(async (searchParams: SearchParams = defaultParams) => {
        setLoading(true);

        try {
            const urlSearchParams = getURLSearchParams(searchParams);
            const { visibilitySettings: visibilitySettingsList, pageNo, totalElements } = await getPromoCampaignVisibilitySettings(+promoCampaignId, urlSearchParams);

            history.replace(`${match.url}?${urlSearchParams}`, state);
            setParams({ ...searchParams, pageNo, totalElements });
            setVisibilitySettings(visibilitySettingsList);
        } catch (e) {
            console.error(e); // TODO: add error handler
        }

        setLoading(false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [promoCampaignId]);

    const forceUpdate = useCallback(() => loadData(params), [loadData, params]);

    useEffect(() => {
        loadData(getSearchParamsFromUrl(search, defaultParams));
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [loadData]);

    const changeVisible = useCallback(async (visibilitySetting: VisibilitySettingDto) => {
        const { id, locationId, salePointId, visible } = visibilitySetting;
        setLoading(true);

        try {
            await editPromoCampaignVisibilitySetting(id, { promoCampaignId: Number(promoCampaignId), locationId, salePointId, visible });
            setVisibilitySettings((prev) => {
                const index = prev.findIndex((setting) => setting.id === id);
                return [...prev.slice(0, index), { ...prev[index], visible }, ...prev.slice(index + 1)];
            });
        } catch (e) {
            console.error(e);
            message.error(e.message);
        }

        setLoading(false);
    }, [promoCampaignId]);

    const changeVisibleAll = useCallback(async (visible: boolean) => {
        const accessSettings = selectedSettings!.reduce<accessSelectedSettings[]>((result, settingId) => {
            const index = visibilitySettings.findIndex(({ id }) => id === settingId);
            if (visibilitySettings[index].visible !== visible) {
                return [...result, {
                    ...visibilitySettings[index],
                    visible,
                    index,
                }];
            }

            return result;
        }, []);

        setLoading(true);

        try {
            const settings = accessSettings!.reduce((setting, { id }) => ({ ...setting, [id]: visible }), {});
            await changeVisibleOfVisibilitySettings(settings);
            setVisibilitySettings((prev) => {
                const nextState = prev.slice();
                accessSettings.forEach(setting => nextState[setting.index] = { ...nextState[setting.index], visible });
                return nextState;
            });
        } catch (e) {
            message.error(e.message);
        }

        setLoading(false);
    }, [selectedSettings, visibilitySettings]);

    const onDelete = useCallback(async () => {
        setLoading(true);

        try {
            await Promise.all(selectedSettings!.map(deletePromoCampaignVisibilitySetting));
            await loadData(params);
            setSelectedSettings([]);
        } catch (e) {
            console.error(e);
        } finally {
            setLoading(false);
        }

    }, [selectedSettings, params, loadData]);

    const onCreate = useCallback(() => {
        const path = getPathForCreatePromoCampaignVisibititySetting();
        history.push(generatePath(path, { promoCampaignId }));
    }, [history, promoCampaignId]);

    const onEnableSelection = useCallback(() => setSelectedSettings([]), []);
    const onDisableSelection = useCallback(() => setSelectedSettings(null), []);

    const selectAll = useCallback(() => {
        setSelectedSettings(
            (prev) => prev!.length === visibilitySettings.length ? [] : visibilitySettings.map(({ id }) => id),
        );
    }, [visibilitySettings]);

    const rowSelection: TableProps<VisibilitySettingDto>['rowSelection'] = useMemo(() => selectedSettings !== null
        ? {
            selectedRowKeys: selectedSettings,
            onChange: setSelectedSettings as (keys: React.Key[], values: VisibilitySettingDto[]) => void,
        } : undefined,
    [selectedSettings]);

    const selectRow = useCallback((id) => {
        if (selectedSettings !== null) {
            setSelectedSettings(
                (prev) => prev!.includes(id) ? prev!.filter(el => el !== id) : [...prev!, id],
            );
        }
    }, [selectedSettings]);

    const onChangePage: TableProps<VisibilitySettingDto>['onChange'] = async ({ pageSize, current }) => {
        setSelectedSettings((prev) => !prev ? prev : []);
        setLoading(true);
        await loadData({
            ...params,
            pageNo: current! - 1,
            pageSize: pageSize as number,
        });
        setLoading(false);
    };

    const pagination: TablePaginationConfig = useMemo(() => ({
        current: (params.pageNo as number) + 1,
        total: params.totalElements as number,
        pageSize: params.pageSize as number,
        locale,
        showSizeChanger: true,
        showQuickJumper: true,
    }), [params.pageNo, params.pageSize, params.totalElements]);

    const buttons: ButtonProps[] = useMemo(() => {
        const isSelectAll = selectedSettings?.length === visibilitySettings.length;
        if (selectedSettings === null) {

            return [
                {
                    type: 'primary',
                    label: BUTTON_TEXT.ADD,
                    onClick: addNewByModal ? showModal : onCreate,
                    disabled: loading,
                },
                {
                    label: BUTTON_TEXT.SELECT,
                    onClick: onEnableSelection,
                    disabled: loading,
                },
            ];
        }

        return [
            {
                type: 'primary',
                label:  isSelectAll ? BUTTON_TEXT.CANCEL_ALL : BUTTON_TEXT.SELECT_ALL,
                onClick: selectAll, disabled: loading,
            },
            { label: BUTTON_TEXT.CANCEL, onClick: onDisableSelection, disabled: loading },
        ];
    }, [
        selectedSettings,
        loading,
        onEnableSelection,
        selectAll,
        onDisableSelection,
        visibilitySettings,
        addNewByModal,
        onCreate,
        showModal,
    ]);

    const onChangeSort = useCallback(() => {
        setSelectedSettings((prev) => !prev ? null : []);
    }, []);

    return (
        <>
            <div className={styles.page}>
                {!hideHeader && <Header />}
                <HeaderWithActions
                    title={HEADER_TITLE}
                    buttons={buttons}
                    showSorting={searchAndSortMode}
                    showSearchInput={searchAndSortMode && selectedSettings === null}
                    params={params}
                    setParams={setParams}
                    loadData={loadData}
                    onChangeSort={onChangeSort}
                    loading={loading}
                    inputPlaceholder={SEARCH_SETTING}
                    menuItems={DROPDOWN_SORT_MENU}
                    enableAsyncSort
                />
                <div className={styles.tableWrapper}>
                    <PromoCampaignVisibilitySettingTable
                        dataSource={visibilitySettings}
                        selectRow={selectRow}
                        onChangeVisible={changeVisible}
                        loading={loading}
                        rowSelection={rowSelection}
                        pagination={pagination}
                        onChange={onChangePage}
                    />
                </div>
                {selectedSettings && (
                    <div className={styles.footer}>
                        <div className={styles.checked}>
                            {`Выбрано настроек: ${ selectedSettings.length }`}
                            {!!selectedSettings.length && (
                                <>
                                    <Button
                                        type="primary"
                                        onClick={() => changeVisibleAll(true)}
                                    >
                                        {TURN_ON_ALL}
                                    </Button>
                                    <Button onClick={() => changeVisibleAll(false)}>
                                        {TURN_OFF_ALL}
                                    </Button>
                                </>
                            )}
                        </div>
                        {!!selectedSettings.length && (
                            <Button
                                onClick={onDelete}
                                disabled={loading}
                                type="primary"
                                danger
                            >
                                {BUTTON_TEXT.DELETE}
                            </Button>
                        )}
                    </div>
                )}
            </div>
            {addNewByModal && (
                <PromoCampaignVisibilitySettingModal
                    forceUpdate={forceUpdate}
                    promoCampaignId={+promoCampaignId}
                    closeModal={closeModal}
                    isModalVisible={isModalVisible}
                />
            )}
        </>
    );
};

export default PromoCampaignVisibilitySetting;
