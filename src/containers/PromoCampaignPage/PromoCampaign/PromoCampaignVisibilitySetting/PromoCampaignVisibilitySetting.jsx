import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { useParams, useRouteMatch, useHistory, useLocation, generatePath } from 'react-router-dom';
import HeaderWithActions from '../../../../components/HeaderWithActions/HeaderWithActions';
import PromoCampaignVisibilitySettingTable
    from './PromoCampaignVisibilitySettingTable/PromoCampaignVisibilitySettingTable';
import { Button } from 'antd';
import debounce from 'lodash/debounce';
import Header from '../../../../components/Header/Header';
import {
    deletePromoCampaignVisibilitySetting,
    editPromoCampaignVisibilitySetting,
    getPromoCampaignVisibilitySettings,
} from '../../../../api/services/promoCampaignService';
import { getPathForCreatePromoCampaignVisibititySetting } from '../../../../utils/appNavigation';

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
const CHOSEN = 'Выбрано';
const BUTTON_DELETE = 'Удалить';

const DROPDOWN_SORT_MENU = [
    { name: 'locationName', label: 'По локации' },
    { name: 'salePointName', label: 'По точке продажи' },
    { name: 'visible', label: 'По видимости' },
];

// eslint-disable-next-line no-unused-vars
const getURLSearchParams = ({ totalElements, ...rest }) => new URLSearchParams(rest).toString();

function PromoCampaignVisibilitySetting({ searchAndSortMode = true, hideHeader }) {
    const match = useRouteMatch();
    const { search, state } = useLocation();
    const history = useHistory();
    const { promoCampaignId } = useParams();
    const [ selectedSettings, setSelectedSettings ] = useState(null);
    const [ loading, setLoading ] = useState(false);
    const [ visibilitySettings, setVisibilitySettings ] = useState([]);
    const [ params, setParams ] = useState(defaultParams);

    const loadData = useCallback(async (searchParams = defaultParams) => {
        const urlSearchParams = getURLSearchParams(searchParams);
        try {
            const { visibilitySettings, pageNo, totalElements } = await getPromoCampaignVisibilitySettings(promoCampaignId, urlSearchParams);
            history.replace(`${match.url}?${urlSearchParams}`, state);
            setParams({ ...searchParams, pageNo, totalElements });
            setVisibilitySettings(visibilitySettings);
        } catch (e) {
            console.error(e);
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [promoCampaignId]);

    // eslint-disable-next-line react-hooks/exhaustive-deps
    const loadDataDebounced = useCallback(debounce(loadData, 500), [loadData]);

    useEffect(() => {
        (async () => {
            const urlSearchParams = new URLSearchParams(search);
            const searchParamsFromUrl = {};
            Object.keys(defaultParams).forEach(key => {
                const searchValue = urlSearchParams.get(key);
                searchParamsFromUrl[key] = searchValue || defaultParams[key];
            });
            await loadData(searchParamsFromUrl);
            setLoading(false);
        })();
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
        } finally {
            setLoading(false);
        }
    }, [promoCampaignId]);

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

    const changeSort = useCallback(async (sortBy) => {
        setLoading(true);

        if (typeof sortBy !== 'string') {
            sortBy = '';
        }
        await loadData({
            ...params,
            sortBy: sortBy || defaultParams.sortBy,
            direction: !sortBy || params.direction === 'DESC' ? 'ASC' : 'DESC',
        });

        setSelectedSettings((state) => !state ? null : []);
        setLoading(false);
    }, [params, loadData]);

    const selectAll = useCallback(() => {
        setSelectedSettings(
            (state) => state.length === visibilitySettings.length ? [] : visibilitySettings.map(({ id }) => id)
        );
    }, [visibilitySettings]);

    const rowSelection = useMemo(() => selectedSettings !== null ? {
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

    const onSearchInputChange = useCallback((value = '', withDebounce = true) => {
        if (loading) {
            return;
        }

        const nextParams = { ...params, filterText: value, pageNo: 0 };

        if (withDebounce) {
            loadDataDebounced(nextParams);
        } else {
            loadData(nextParams);
        }
        setParams(nextParams);
        setSelectedSettings((state) => !state ? null : []);
    }, [loadDataDebounced, params, loading, loadData]);

    const sortingBy = useMemo(() => ({
        menuItems: DROPDOWN_SORT_MENU,
        onMenuItemClick: changeSort,
        sortBy: params.sortBy,
        withReset: true,
    }), [changeSort, params.sortBy]);

    const onChangePage = useCallback(async ({ pageSize, current }) => {
        setSelectedSettings([]);
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
                { type: 'primary', label: BUTTON_ADD, onClick: onCreate, disabled: loading },
                { label: BUTTON_CHOOSE, onClick: onEnableSelection, disabled: loading },
            ];
        }

        return [
            { type: 'primary', label:  isSelectAll ? BUTTON_UNSELECT_ALL : BUTTON_CHOOSE_ALL , onClick: selectAll, disabled: loading },
            { label: BUTTON_CANCEL, onClick: onDisableSelection, disabled: loading },
        ];
    }, [selectedSettings, loading, onCreate, onEnableSelection, selectAll, onDisableSelection, visibilitySettings]);

    const searchInput = useMemo(() => ({
        placeholder: SEARCH_SETTING,
        onChange: onSearchInputChange,
        disabled: loading,
        value: params.filterText,
    }), [onSearchInputChange, loading, params.filterText]);

    return (
        <div className={ styles.page }>
            {!hideHeader && <Header />}
            <HeaderWithActions
                title={ HEADER_TITLE }
                buttons={ buttons }
                searchInput={ searchInput }
                showSorting = { searchAndSortMode }
                showSearchInput={ searchAndSortMode && selectedSettings === null  }
                sortingBy={ sortingBy }
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
            {selectedSettings && (
                <div className={ styles.footer }>
                    <div className={ styles.checked }>
                        { CHOSEN } { selectedSettings.length }
                    </div>
                    {selectedSettings.length > 0 && (
                        <Button
                            className={ styles.redBtn }
                            onClick={ onDelete }
                            disabled={ loading }
                            type="primary"
                        >
                            { BUTTON_DELETE }
                        </Button>
                    )}
                </div>
            )}
        </div>
    );
}

export default PromoCampaignVisibilitySetting;