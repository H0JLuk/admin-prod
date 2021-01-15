import React, { useEffect, useState } from 'react';
import { generatePath, useHistory } from 'react-router-dom';
import { Menu, Dropdown, Button } from 'antd';
import { getDashboardInfo } from '../../api/services/adminService';
import { getClientAppList } from '../../api/services/clientAppService';
import { getDzoList } from '../../api/services/dzoService';
import { getPromoCampaignById } from '../../api/services/promoCampaignService';
import { getRole, saveAppCode } from '../../api/services/sessionService';
import Header from '../../components/Header/Redisegnedheader/Header';
import ROLES from '../../constants/roles';
import { PROMO_CAMPAIGN_PAGES, ROUTE, ROUTE_ADMIN, ROUTE_OWNER } from '../../constants/route';
import DashboardFilterTag from './DashboardFilterTag';
import { WITHOUT_FILTER, BY_APP, BY_DZO } from './dashboardFilterTypes';
import DashboardItem from './DashboardItem';
import downArrowImage from '../../static/svgs/arrow-down.svg';
import styles from './Dashboard.module.css';

const DEFAULT_FILTER_NAME = 'Фильтровать';
const RELOAD_BUTTON_LABEL = 'Обновить';

const DashboardFilterMenu = ({ onClick }) => (
    <Menu onClick={ onClick }>
        <Menu.Item key={ BY_APP }>По приложению</Menu.Item>
        <Menu.Item key={ BY_DZO }>По ДЗО</Menu.Item>
        <Menu.Item key={ WITHOUT_FILTER }>Сбросить</Menu.Item>
    </Menu>
);

const DashboardFilterList = ({ list, filterIdList, onClick }) => {
    return (
        <div className={ styles.filtersBlock }>
            {list.map((elem, index) => (
                <DashboardFilterTag
                    key={ index }
                    { ...elem }
                    handleClick={ onClick }
                    selected={ filterIdList.includes(elem.id) }
                />
            ))}
        </div>
    );
};

const Dashboard = () => {
    const history = useHistory();
    const [filterType, setFilterType] = useState(WITHOUT_FILTER);
    const [filterIdList, setFilterIdList] = useState([]);
    const [filterName, setFilterName] = useState(DEFAULT_FILTER_NAME);
    const [list, setList] = useState([]);
    const [filteredList, setFilteredList] = useState([]);
    const [filterTagList, setFilterTagList] = useState([]);
    const [appList, setAppList] = useState([]);
    const [dzoList, setDzoList] = useState([]);
    const [loading, setLoading] = useState(false);

    const loadData = async () => {
        setLoading(true);
        try {
            const response = await getDashboardInfo();
            setList(response);
            const { clientApplicationDtoList: clientAppList = [] } = await getClientAppList() ?? {};
            setAppList(clientAppList.map(({ id, name }) => ({ id, name })));
            const { dzoDtoList = [] } = await getDzoList() ?? {};
            setDzoList(dzoDtoList.map(({ dzoId: id, dzoName: name }) => ({ id, name })));
        } catch (e) {
            console.error(e?.message);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadData();
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
                setFilteredList(list.filter(({ clientApplicationId: id } = {}) => filterIdList.includes(id)));
                break;
            case BY_DZO:
                setFilteredList(list.filter(({ dzoId } = {}) => filterIdList.includes(dzoId)));
                break;
            case WITHOUT_FILTER:
            default:
                setFilteredList(list);
        }
    }, [list, filterType, dzoList, appList, filterIdList]);

    const onItemClick = async (appCode, promoCampaignId) => {
        saveAppCode(appCode);
        try {
            const path = generatePath(`${ROUTE.REDESIGNED}${getRole() === ROLES.ADMIN
                    ? ROUTE_ADMIN.PROMO_CAMPAIGN
                    : ROUTE_OWNER.PROMO_CAMPAIGN
            }${PROMO_CAMPAIGN_PAGES.PROMO_CAMPAIGN_INFO}`, { promoCampaignId });
            const { promoCampaignDtoList = [] } = await getPromoCampaignById(promoCampaignId) ?? {};
            const promoCampaign = promoCampaignDtoList[0];
            if (promoCampaign) {
                history.push(path, { promoCampaign });
            }
        } catch (e) {
            console.error(e?.message);
        }
    };

    const onMenuItemClick = (e) => setFilterType(e?.key);

    const onFilterTagClick = (id, selected) =>
        setFilterIdList(selected ? [...filterIdList, id] : filterIdList.filter((elem) => elem !== id));

    return (
        <div className={ styles.page }>
            <Header buttonBack={ false } />
            <div className={ styles.header } >
                <h3>Дашборд</h3>
                <div className={ styles.navigationPanel }>
                    <Button type="primary" onClick={ loadData } disabled={ loading }>
                        { RELOAD_BUTTON_LABEL }
                    </Button>
                    <Dropdown trigger={ ['click'] } overlay={ <DashboardFilterMenu onClick={ onMenuItemClick } /> }>
                        <div className={ styles.menuFilter }>
                            <p>{filterName}</p>
                            <img src={ downArrowImage } alt="" />
                        </div>
                    </Dropdown>
                </div>
                <DashboardFilterList list={ filterTagList } filterIdList={ filterIdList } onClick={ onFilterTagClick } />
            </div>
            <div className={ styles.content }>
                {filteredList.map((elem, index) => (
                    <DashboardItem key={ index } handleClick={ onItemClick } { ...elem } />
                ))}
            </div>
        </div>
    );
};

export default Dashboard;