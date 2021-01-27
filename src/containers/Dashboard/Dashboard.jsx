import { RedoOutlined } from '@ant-design/icons';
import React, { useEffect, useState } from 'react';
import { generatePath, useHistory } from 'react-router-dom';
import { Menu, Dropdown, Button } from 'antd';
import { getDashboardInfo } from '../../api/services/adminService';
import { getClientAppList } from '../../api/services/clientAppService';
import { getDzoList } from '../../api/services/dzoService';
import { getPromoCampaignById } from '../../api/services/promoCampaignService';
import { saveAppCode } from '../../api/services/sessionService';
import useBodyClassForSidebar from '../../hooks/useBodyClassForSidebar';
import Header from '../../components/Header/Header';
import { DEFAULT_SLEEP_TIME } from '../../constants/time';
import { sleep } from '../../utils/utils';
import DashboardFilterTag from './DashboardFilterTag';
import { WITHOUT_FILTER, BY_APP, BY_DZO } from './dashboardFilterTypes';
import DashboardItem from './DashboardItem';
import downArrowImage from '../../static/svgs/arrow-down.svg';
import { getPathForPromoCampaignInfo } from '../../utils/appNavigation';
import styles from './Dashboard.module.css';

const DEFAULT_FILTER_NAME = 'Фильтровать';
const RELOAD_BUTTON_LABEL = 'Обновить';

const menuObj = [
    { label: BY_APP, value: 'По приложению' },
    { label: BY_DZO, value: 'По ДЗО' },
    { label: WITHOUT_FILTER, value: 'По умолчанию' },
];

const DashboardFilterMenu = ({ onClick }) => (
    <Menu onClick={ onClick }>
        {menuObj.map(({ label, value }) => (
            <Menu.Item key={ label }>{ value }</Menu.Item>
        ))}
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

    useBodyClassForSidebar();

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
            await sleep(DEFAULT_SLEEP_TIME);
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
                setFilteredList(
                    filterIdList.length
                        ? list.filter(({ clientApplicationId: id } = {}) => filterIdList.includes(id))
                        : list
                );
                break;
            case BY_DZO:
                setFilteredList(
                    filterIdList.length
                        ? list.filter(({ dzoId } = {}) => filterIdList.includes(dzoId))
                        : list
                );
                break;
            case WITHOUT_FILTER:
            default:
                setFilteredList(list);
        }
    }, [list, filterType, filterIdList]);

    const onItemClick = async (appCode, promoCampaignId) => {
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

    const onMenuItemClick = (e) => setFilterType(e?.key);

    const onFilterTagClick = (id, selected) =>
        setFilterIdList(selected ? [...filterIdList, id] : filterIdList.filter((elem) => elem !== id));

    return (
        <div className={ styles.page }>
            <Header buttonBack={ false } />
            <div className={ styles.header } >
                <h3>Дашборд</h3>
                <div className={ styles.navigationPanel }>
                    <Button type="primary" onClick={ loadData } loading={ loading } icon={ <RedoOutlined /> }>
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
