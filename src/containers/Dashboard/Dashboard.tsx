import { RedoOutlined } from '@ant-design/icons';
import React, { useEffect, useState } from 'react';
import { generatePath, useHistory } from 'react-router-dom';
import { Menu, Dropdown, Button, Alert, MenuProps } from 'antd';
import { getDashboardInfo } from '@apiServices/adminService';
import { getActiveClientApps } from '@apiServices/clientAppService';
import { getDzoList } from '@apiServices/dzoService';
import { getPromoCampaignById } from '@apiServices/promoCampaignService';
import { saveAppCode } from '@apiServices/sessionService';
import useBodyClassForSidebar from '@hooks/useBodyClassForSidebar';
import Header from '@components/Header';
import { requestsWithMinWait } from '@utils/utils';
import DashboardFilterTag from './DashboardFilterTag';
import { DASHBOARD_FILTERS } from './dashboardFilterTypes';
import DashboardItem from './DashboardItem';
import { getPathForPromoCampaignInfo } from '@utils/appNavigation';
import { ClientAppDto, PromoCampaignReport } from '@types';
import downArrowImage from '@svgs/arrow-down.svg';

import styles from './Dashboard.module.css';

interface IFilterList {
    id: number;
    displayName: string;
}

interface IDashboardFilterList {
    list: IFilterList[];
    filterIdList: number[];
    onClick: (id: number, selected: boolean) => void;
}

interface IDashboardFilterMenu {
    onClick: MenuProps['onClick'];
}

type IFilterTagItem = Pick<ClientAppDto, 'id' | 'displayName'>;

const DEFAULT_FILTER_NAME = 'Фильтровать';
const RELOAD_BUTTON_LABEL = 'Обновить';

const EMPTY_DASHBOARD = {
    MESSAGE: 'Отличная работа!',
    DESCRIPTION: 'У нас все под контролем.',
};

const { WITHOUT_FILTER, BY_APP, BY_DZO } = DASHBOARD_FILTERS;

const menuObj = [
    { label: BY_APP, value: 'По приложению' },
    { label: BY_DZO, value: 'По ДЗО' },
    { label: WITHOUT_FILTER, value: 'По умолчанию' },
];


const DashboardFilterMenu: React.FC<IDashboardFilterMenu> = ({ onClick }) => (
    <Menu onClick={onClick}>
        {menuObj.map(({ label, value }) => (
            <Menu.Item key={label}>{value}</Menu.Item>
        ))}
    </Menu>
);

const DashboardFilterList: React.FC<IDashboardFilterList> = ({ list, filterIdList, onClick }) => (
    <div className={styles.filtersBlock}>
        {list.map((elem, index) => (
            <DashboardFilterTag
                key={index}
                {...elem}
                handleClick={onClick}
                selected={filterIdList.includes(elem.id)}
            />
        ))}
    </div>
);

const Dashboard = () => {
    const history = useHistory();
    const [filterType, setFilterType] = useState<DASHBOARD_FILTERS>(WITHOUT_FILTER);
    const [filterIdList, setFilterIdList] = useState<number[]>([]);
    const [filterName, setFilterName] = useState(DEFAULT_FILTER_NAME);
    const [list, setList] = useState<PromoCampaignReport[]>([]);
    const [filteredList, setFilteredList] = useState<PromoCampaignReport[]>([]);
    const [filterTagList, setFilterTagList] = useState<IFilterTagItem[]>([]);
    const [appList, setAppList] = useState<IFilterTagItem[]>([]);
    const [dzoList, setDzoList] = useState<IFilterTagItem[]>([]);
    const [loadingPage, setLoadingPage] = useState(true);
    const [loading, setLoading] = useState(false);

    useBodyClassForSidebar();

    const loadData = async () => {
        setLoading(true);
        try {
            const requests = Promise.all([getDashboardInfo(), getActiveClientApps(), getDzoList()]);
            const [
                dashboardInfo,
                clientAppList,
                { dzoDtoList = [] },
            ] = await requestsWithMinWait(requests);

            setList(dashboardInfo);
            setAppList(clientAppList.map(({ id, displayName }) => ({ id, displayName })));
            setDzoList(dzoDtoList.map(({ dzoId: id, dzoName: displayName }) => ({ id, displayName })));
        } catch (e) {
            console.error(e?.message);
        }
        setLoading(false);
    };

    useEffect(() => {
        (async () => {
            await loadData();
            setLoadingPage(false);
        })();
    }, []);

    useEffect(() => {
        switch (filterType) {
            case BY_APP:
                setFilterName('Приложение');
                setFilterTagList(appList);
                break;
            case BY_DZO:
                setFilterName('ДЗО');
                setFilterTagList(dzoList);
                break;
            case WITHOUT_FILTER:
            default:
                setFilterName(DEFAULT_FILTER_NAME);
                setFilterTagList([]);
        }
        setFilterIdList([]);
    }, [appList, dzoList, filterType]);

    useEffect(() => {
        switch (filterType) {
            case BY_APP:
                setFilteredList(
                    filterIdList.length
                        ? list.filter(({ clientApplicationId: id }) => filterIdList.includes(id))
                        : list,
                );
                break;
            case BY_DZO:
                setFilteredList(
                    filterIdList.length
                        ? list.filter(({ dzoId }) => filterIdList.includes(dzoId))
                        : list,
                );
                break;
            case WITHOUT_FILTER:
            default:
                setFilteredList(list);
        }
    }, [list, filterType, filterIdList]);

    const onItemClick = async (appCode: string, promoCampaignId: number) => {
        saveAppCode(appCode);
        try {
            const path = generatePath(`${ getPathForPromoCampaignInfo() }`, { promoCampaignId });
            const { promoCampaignDtoList = [] } = await getPromoCampaignById(promoCampaignId) ?? {};
            const promoCampaign = promoCampaignDtoList[0];
            if (promoCampaign) {
                history.push(path, { promoCampaign });
            }
        } catch (e) {
            console.error(e?.message);
        }
    };

    const onMenuItemClick: MenuProps['onClick'] = (e) => setFilterType(e.key as DASHBOARD_FILTERS);

    const onFilterTagClick = (id: number, selected: boolean) =>
        setFilterIdList(selected ? [...filterIdList, id] : filterIdList.filter((elem) => elem !== id));

    return (
        <div className={styles.page}>
            <Header buttonBack={false} />
            <div className={styles.header} >
                <h3>Дашборд</h3>
                <div className={styles.navigationPanel}>
                    <Button
                        type="primary"
                        onClick={loadData}
                        loading={loading}
                        icon={<RedoOutlined />}
                    >
                        {RELOAD_BUTTON_LABEL}
                    </Button>
                    <Dropdown
                        trigger={['click']}
                        overlay={<DashboardFilterMenu onClick={onMenuItemClick} />}
                    >
                        <div className={styles.menuFilter}>
                            <p>{filterName}</p>
                            <img src={downArrowImage} alt="" />
                        </div>
                    </Dropdown>
                </div>
                <DashboardFilterList
                    list={filterTagList}
                    filterIdList={filterIdList}
                    onClick={onFilterTagClick}
                />
            </div>
            {!loadingPage && (
                filteredList.length ? (
                    <div className={styles.content}>
                        {filteredList.map((elem, index) => (
                            <DashboardItem key={index} handleClick={onItemClick} {...elem} />
                        ))}
                    </div>
                ) : (
                    <Alert
                        className={styles.message}
                        message={EMPTY_DASHBOARD.MESSAGE}
                        description={EMPTY_DASHBOARD.DESCRIPTION}
                        type="success"
                        showIcon
                    />
                )
            )}
        </div>
    );
};

export default Dashboard;
