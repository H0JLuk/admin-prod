import React, { useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';
import cn from 'classnames';
import { Menu, Dropdown } from 'antd';
import { getDashboardInfo } from '../../api/services/adminService';
import { getClientAppList } from '../../api/services/clientAppService';
import { getDzoList } from '../../api/services/dzoService';
import { getAppCode, saveAppCode } from '../../api/services/sessionService';
import Button from '../../components/Button/Button';
import { goBack, goPromoCampaigns, goToClientApps } from '../../utils/appNavigation';
import DashboardFilterTag from './DashboardFilterTag';
import { WITHOUT_FILTER, BY_APP, BY_DZO } from './dashboardFilterTypes';
import DashboardItem from './DashboardItem';
import downArrowImage from '../../static/svgs/arrow-down.svg';
import styles from './Dashboard.module.css';

const DEFAULT_FILTER_NAME = 'Фильтровать';
const RELOAD_BUTTON_LABEL = 'Обновить';
const CLOSE_BUTTON_LABEL = 'Закрыть';

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
    }, [filterType]);

    useEffect(() => {
        switch (filterType) {
            case BY_APP:
                setFilteredList(list.filter((elem) => filterIdList.includes(elem?.clientApplicationId)));
                break;
            case BY_DZO:
                setFilteredList(list.filter((elem) => filterIdList.includes(elem?.dzoId)));
                break;
            case WITHOUT_FILTER:
            default:
                setFilteredList(list);
        }
    }, [list, filterType, dzoList, appList, filterIdList]);

    const onCloseClick = () => getAppCode() ? goBack(history) : goToClientApps(history);

    // TODO: сделать переход на конкретную промо-кампанию после редизайна
    const onItemClick = (appCode, promoCampaignId) => {
        // console.log({ currentAppCode: getAppCode(), newAppCode: appCode, promoCampaignId });
        saveAppCode(appCode);
        goPromoCampaigns(history);
    };

    const onMenuItemClick = (e) => setFilterType(e?.key);

    const onFilterTagClick = (id, selected) =>
        setFilterIdList(selected ? [...filterIdList, id] : filterIdList.filter((elem) => elem !== id));

    return (
        <div className={ styles.page }>
            <div className={ styles.header } >
                <h3>Дашборд</h3>
                <div className={ styles.navigationPanel }>
                    <Button type="green"
                            label={ RELOAD_BUTTON_LABEL }
                            className={ styles.button }
                            onClick={ loadData }
                            disabled={ loading }
                    />
                    <Dropdown trigger={ ['click'] } overlay={ <DashboardFilterMenu onClick={ onMenuItemClick } /> }>
                        <div className={ styles.menuFilter }>
                            <p>{filterName}</p>
                            <img src={ downArrowImage } alt="" />
                        </div>
                    </Dropdown>
                    <Button type="blue"
                            label={ CLOSE_BUTTON_LABEL }
                            className={ cn(styles.button, styles.exit) }
                            onClick={ onCloseClick }
                    />
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
