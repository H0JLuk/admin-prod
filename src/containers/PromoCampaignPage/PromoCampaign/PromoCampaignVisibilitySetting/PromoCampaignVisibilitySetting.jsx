import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { useParams, useHistory, useLocation, generatePath, useRouteMatch } from 'react-router-dom';
import HeaderWithActions from '../../../../components/HeaderWithActions/HeaderWithActions';
import PromoCampaignVisibilitySettingTable
    from './PromoCampaignVisibilitySettingTable/PromoCampaignVisibilitySettingTable';
import { Button, message } from 'antd';
import Header from '../../../../components/Header/Header';
import PromoCampaignVisibilitySettingModal from './PromoCampaignVisibilitySettingModal/PromoCampaignVisibilitySettingModal';
import {
    deletePromoCampaignVisibilitySetting,
    editPromoCampaignVisibilitySetting,
    getPromoCampaignVisibilitySettings,
    changeVisibleOfVisibilitySettings
} from '../../../../api/services/promoCampaignService';
import { getPathForCreatePromoCampaignVisibititySetting } from '../../../../utils/appNavigation';
import { getSearchParamsFromUrl } from '../../../../utils/helper';

import styles from './PromoCampaignVisibilitySetting.module.css';

const defaultParams = {
    pageNo: 0,
    pageSize: 10,
    sortBy: 'id',
    direction: 'ASC',
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
const BUTTON_ADD = 'Добавить';
const HEADER_TITLE = 'Настройки видимости промо-кампании';
const BUTTON_CHOOSE = 'Выбрать';
const BUTTON_CHOOSE_ALL = 'Выбрать все';
const BUTTON_UNSELECT_ALL = 'Отменить выбор';
const BUTTON_CANCEL = 'Отмена';
const BUTTON_DELETE = 'Удалить';
const TURN_ON_ALL = 'Включить все';
const TURN_OFF_ALL = 'Выключить все';

const DROPDOWN_SORT_MENU = [
    { name: 'locationName', label: 'По локации' },
    { name: 'salePointName', label: 'По точке продажи' },
    { name: 'visible', label: 'По видимости' },
];

// eslint-disable-next-line no-unused-vars
const getURLSearchParams = ({ totalElements, ...rest }) => new URLSearchParams(rest).toString();

const PromoCampaignVisibilitySetting = ({ searchAndSortMode = true, hideHeader, addNewByModal }) => {
    const match = useRouteMatch();
    const { search, state } = useLocation();
    const history = useHistory();
    const { promoCampaignId } = useParams();
    const [ selectedSettings, setSelectedSettings ] = useState(null);
    const [ loading, setLoading ] = useState(true);
    const [ visibilitySettings, setVisibilitySettings ] = useState([]);
    const [ params, setParams ] = useState(defaultParams);
    const [ isModalVisible, setIsModalVisible ] = useState(false);

    const showModal = useCallback(() => setIsModalVisible(true), []);

    const closeModal = useCallback(() => setIsModalVisible(false), []);

    const loadData = useCallback(async (searchParams = defaultParams) => {
        setLoading(true);

        try {
            const urlSearchParams = getURLSearchParams(searchParams);
            const { visibilitySettings, pageNo, totalElements } = await getPromoCampaignVisibilitySettings(promoCampaignId, urlSearchParams);

            history.replace(`${match.url}?${urlSearchParams}`, state);
            setParams({ ...searchParams, pageNo, totalElements });
            setVisibilitySettings(visibilitySettings);
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

    const changeVisible = useCallback(async (visibilitySetting) => {
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

    const changeVisibleAll = useCallback(async (visible) => {
        const accessSettings = selectedSettings.reduce((result, settingId) => {
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
            const settings = accessSettings.reduce((setting, { id }) => ({ ...setting, [id]: visible }), {});
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
            await Promise.all(selectedSettings.map(deletePromoCampaignVisibilitySetting));
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
            (state) => state.length === visibilitySettings.length ? [] : visibilitySettings.map(({ id }) => id)
        );
    }, [visibilitySettings]);

    const rowSelection = useMemo(() => selectedSettings !== null
        ? {
            selectedRowKeys: selectedSettings,
            onChange: setSelectedSettings,
        } : undefined,
    [selectedSettings]);

    const selectRow = useCallback((id) => {
        if (selectedSettings !== null) {
            setSelectedSettings(
                (state) => state.includes(id) ? state.filter(el => el !== id) : [...state, id]
            );
        }
    }, [selectedSettings]);

    const onChangePage = useCallback(async ({ pageSize, current }) => {
        setSelectedSettings((prev) => !prev ? prev : []);
        setLoading(true);
        await loadData({
            ...params,
            pageNo: current - 1,
            pageSize,
        });
        setLoading(false);
    }, [loadData, params]);

    /** @type {import('antd/lib/pagination').PaginationConfig} */
    const pagination = useMemo(() => ({
        current: params.pageNo + 1,
        total: params.totalElements,
        pageSize: params.pageSize,
        locale,
        showSizeChanger: true,
        showQuickJumper: true,
    }), [params.pageNo, params.pageSize, params.totalElements]);

    const buttons = useMemo(() => {
        const isSelectAll = selectedSettings?.length === visibilitySettings.length;
        if (selectedSettings === null) {

            return [
                {
                    type: 'primary',
                    label: BUTTON_ADD,
                    onClick: addNewByModal ? showModal : onCreate,
                    disabled: loading,
                },
                {
                    label: BUTTON_CHOOSE,
                    onClick: onEnableSelection,
                    disabled: loading,
                },
            ];
        }

        return [
            {
                type: 'primary',
                label:  isSelectAll ? BUTTON_UNSELECT_ALL : BUTTON_CHOOSE_ALL,
                onClick: selectAll, disabled: loading,
            },
            { label: BUTTON_CANCEL, onClick: onDisableSelection, disabled: loading },
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
        showModal
    ]);

    const onChangeSort = useCallback(() => {
        setSelectedSettings((state) => !state ? null : []);
    }, []);

    const searchAndSortParams = {
        params,
        setParams,
        loadData,
        onChangeSort,
        loading,
        inputPlaceholder: SEARCH_SETTING,
        menuItems: DROPDOWN_SORT_MENU,
    };

    return (
        <>
            <div className={ styles.page }>
                { !hideHeader && <Header /> }
                <HeaderWithActions
                    title={ HEADER_TITLE }
                    buttons={ buttons }
                    showSorting={ searchAndSortMode }
                    showSearchInput={ searchAndSortMode && selectedSettings === null }
                    { ...searchAndSortParams }
                    enableAsyncSort
                />
                <div className={ styles.tableWrapper }>
                    <PromoCampaignVisibilitySettingTable
                        dataSource={ visibilitySettings }
                        selectRow={ selectRow }
                        onChangeVisible={ changeVisible }
                        loading={ loading }
                        rowSelection={ rowSelection }
                        pagination={ pagination }
                        onChange={ onChangePage }
                    />
                </div>
                { selectedSettings && (
                    <div className={ styles.footer }>
                        <div className={ styles.checked }>
                            { `Выбрано настроек: ${ selectedSettings.length }` }
                            { selectedSettings.length > 0 && (
                                <>
                                    <Button
                                        type="primary"
                                        onClick={ () => changeVisibleAll(true) }
                                    >
                                        { TURN_ON_ALL }
                                    </Button>
                                    <Button onClick={ () => changeVisibleAll(false) }>
                                        { TURN_OFF_ALL }
                                    </Button>
                                </>
                            ) }
                        </div>
                        { selectedSettings.length > 0 && (
                            <Button
                                onClick={ onDelete }
                                disabled={ loading }
                                type="primary"
                                danger
                            >
                                { BUTTON_DELETE }
                            </Button>
                        ) }
                    </div>
                ) }
            </div>
            { addNewByModal && (
                <PromoCampaignVisibilitySettingModal
                    forceUpdate={ forceUpdate }
                    promoCampaignId={ promoCampaignId }
                    closeModal={ closeModal }
                    isModalVisible={ isModalVisible }
                />
            ) }
        </>
    );
};

export default PromoCampaignVisibilitySetting;
