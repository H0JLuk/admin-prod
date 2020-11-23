import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { useParams, useRouteMatch, useHistory } from 'react-router-dom';
import PromoCampaignVisibilitySettingTable
    from './PromoCampaignVisibilitySettingTable/PromoCampaignVisibilitySettingTable';
import Button from '../../../../components/Button/Button';

import styles from './PromoCampaignVisibilitySetting.module.css';
import {
    deletePromoCampaignVisibilitySetting, editPromoCampaignVisibilitySetting,
    getPromoCampaignVisibilitySettings
} from '../../../../api/services/promoCampaignService';

const defaultParams = {
    pageNo: 0,
    pageSize: 10,
    sortBy: 'id',
    direction: 'ASC',
    totalElements: 0,
};

// eslint-disable-next-line
const getURLSearchParams = ({ totalElements, ...rest }) => new URLSearchParams(rest).toString();

function PromoCampaignVisibilitySetting() {
    const match = useRouteMatch();
    const history = useHistory();
    const { promoCampaignId } = useParams();
    const [ selectedSettings, setSelectedSettings ] = useState(null);
    const [ loading, setLoading ] = useState(false);
    const [ visibilitySettings, setVisibilitySettings ] = useState([]);
    const [ params, setParams] = useState(defaultParams);

    const loadData = useCallback(async (searchParams = defaultParams) => {
        const urlSearchParams = getURLSearchParams(searchParams);

        try {
            const { visibilitySettings, totalElements, pageNo } = await getPromoCampaignVisibilitySettings(promoCampaignId, urlSearchParams);

            setParams({
                ...searchParams,
                pageNo,
                totalElements,
            });

            setVisibilitySettings(visibilitySettings);
        } catch (e) {
            console.error(e);
        }
    }, [promoCampaignId]);

    useEffect(() => {
        const load = async () => {
            setLoading(true);
            await loadData();
            setLoading(false);
        };

        load();
    }, [loadData]);

    const changeVisible = useCallback(async (visibilitySetting) => {
        const { id, locationId, salePointId, visible } = visibilitySetting;

        setLoading(true);

        try {
            await editPromoCampaignVisibilitySetting(id, { promoCampaignId: Number(promoCampaignId), locationId, salePointId, visible });
            await loadData(params);
        } catch (e) {
            console.error(e);
        } finally {
            setLoading(false);
        }
    }, [params, loadData, promoCampaignId]);

    const onDelete = useCallback(async () => {
        setLoading(true);

        try {
            await Promise.all(selectedSettings.map(deletePromoCampaignVisibilitySetting));
            await loadData(params);
            setSelectedSettings(null);
        } catch (e) {
            console.error(e);
        } finally {
            setLoading(false);
        }

    }, [selectedSettings, params, loadData]);

    const onCreate = useCallback(() => {
        history.push(`${match.url}/create`);
    }, [history, match.url]);

    const onEnableSelection = useCallback(() => setSelectedSettings([]), []);
    const onDisableSelection = useCallback(() => setSelectedSettings(null), []);

    const changeParams = useCallback(async (pagination, _, sorter) => {
        setLoading(true);

        await loadData({
            ...params,
            pageNo: pagination.current - 1,
            sortBy: sorter.field || 'id',
            direction: sorter.order === 'descend' ? 'DESC' : 'ASC',
        });

        setLoading(false);
    }, [params, loadData]);

    const pagination = useMemo(() => ({
        current: params.pageNo + 1,
        total: params.totalElements,
        pageSize: params.pageSize,
        showSizeChanger: false
    }), [params.pageNo, params.pageSize, params.totalElements]);

    const rowSelection = useMemo(() => selectedSettings !== null ? {
            selectedRowKeys: selectedSettings,
            onChange: (sel) => setSelectedSettings(sel),
        } : undefined,
        [selectedSettings]);

    return (
        <div className={styles.page}>
            <div className={ styles.header } >
                <h1>Настройка видимости промо-кампании</h1>
                <div>
                    {
                        selectedSettings === null ? (
                                <>
                                    <Button type="green" label="ДОБАВИТЬ" className={ styles.button_margin } onClick={ onCreate } />
                                    <Button type="blue"  label="ВЫБРАТЬ" className={ styles.button_margin } onClick={ onEnableSelection } disabled={ loading } />
                                </>
                            ) : (
                                <Button type="blue"  label="ОТМЕНИТЬ" className={ styles.button_margin } onClick={ onDisableSelection } disabled={ loading } />
                            )
                    }
                </div>
            </div>
            <PromoCampaignVisibilitySettingTable dataSource={ visibilitySettings } onChange={ changeParams } onChangeVisible={ changeVisible } loading={ loading } rowSelection={ rowSelection } pagination={ pagination } />
            {
                selectedSettings &&
                <div className={ styles.footer }>
                    <div>ВЫБРАНО {selectedSettings.length}</div>
                    {
                        selectedSettings.length > 0 && <Button type="red" label="УДАЛИТЬ НАСТРОЙКИ" className={ styles.button_margin } onClick={ onDelete } disabled={ loading } />
                    }
                </div>
            }
        </div>
    );
}

export default PromoCampaignVisibilitySetting;