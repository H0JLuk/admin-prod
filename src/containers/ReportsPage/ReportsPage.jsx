import React, { Component } from 'react';
import DatePicker from 'react-datepicker';
import moment from 'moment';
import classNames from 'classnames';
import 'react-datepicker/dist/react-datepicker.css';
import { DEFAULT_SLEEP_TIME } from '../../constants/time';
import { sleep } from '../../utils/utils';
import Button from '../../components/Button/Button';
import { getOffers } from '../../api/services/adminService';
import { downloadFile } from '../../utils/helper';
import { getDzoList } from '../../api/services/dzoService';
import { getPromoCampaignList } from '../../api/services/promoCampaignService';
import { getPromoCodeStatistics } from '../../api/services/promoCodeService';
import Header from '../../components/Header/Header';

import styles from './ReportsPage.module.css';

const DATE_FORMAT = 'dd/MM/yyyy';

const OFFERS_NAME = 'offers';
const PROMOCODES_NAME = 'promocodes';

const OFFERS_LABLE = 'Скачать предложения';
const EXPORT_LABLE = 'Скачать выданные промокоды';
const START_DATE_LABLE = 'с';
const END_DATE_LABLE = 'по';

const EXCEL_FILES_TITLE = 'Экспорт предложений';
const FILTER_TITLE = 'Фильтровать по дате';
const UNSPECIFIED_TITLE = 'Не задано';
const EXPORT_TITLE = 'Экспорт использованных промокодов';

const FILTER_ERROR_MESSAGE = 'Введены некоректные данные для фильтра по дате';

class ReportsPage extends Component {

    constructor(props) {
        super(props);
        this.optionRef = React.createRef();
        this.pdfRef = React.createRef();
        this.state = {
            startDate: null,
            endDate: null,
            isFiltered: true,
            dzoList: [],
            dzoId: null,
            promoCampaignList: [],
            filteredPromoCampaignList: [],
            promoCampaignId: null,
            loading: false
        };
    }

    componentDidMount() {
        const currentDate = new Date();
        const startDate = new Date(currentDate.getTime());
        startDate.setDate(startDate.getDate() - 14);
        this.setState({ startDate, endDate: currentDate });

        const loadData = async () => {
            try {
                const { dzoDtoList: dzoList = [] } = await getDzoList() ?? {};
                const { promoCampaignDtoList: promoCampaignList = [] } = await getPromoCampaignList() ?? {};
                this.setState({ dzoList, promoCampaignList });
            } catch (e) {
                console.error(e.message);
            }
        };
        loadData();
    }

    checkDate = (start, end) => {
        const momentStartDate = moment(start);
        const momentEndDate = moment(end);
        if (!momentStartDate.isValid() || !momentEndDate.isValid()
            || momentStartDate > momentEndDate) {
            alert(FILTER_ERROR_MESSAGE);
            return false;
        }
        return true;
    };

    getData = (func, name) => async () => {
        if (typeof(func) !== 'function') {
            return;
        }
        const { startDate, endDate, isFiltered } = this.state;

        if (isFiltered && !this.checkDate(startDate, endDate)) {
            return;
        }

        const startTime = isFiltered ? startDate.getTime() : null;
        const endTime = isFiltered ? endDate.getTime() : null;
        try {
            this.setState({ loading: true });
            func(startTime, endTime).then(data => downloadFile(data, name));
        } catch (e) {
            console.error(e);
        } finally {
            await sleep(DEFAULT_SLEEP_TIME);
            this.setState({ loading: false });
        }
    };

    handleChangeDate = (date, isStartDate) => {
        if (isStartDate) {
            this.setState({ startDate: date });
        } else {
            this.setState({ endDate: date });
        }
    };

    downloadPromoCodes = async () => {
        const { startDate, endDate, dzoId, promoCampaignId } = this.state;
        if (!this.checkDate(startDate, endDate)) {
            return;
        }
        const momentStartDate = moment(startDate).format('DD.MM.YYYY');
        const momentEndDate = moment(endDate).format('DD.MM.YYYY');
        try {
            this.setState({ loading: true });
            const blob = await getPromoCodeStatistics(momentStartDate, momentEndDate, dzoId, promoCampaignId);
            downloadFile(blob, PROMOCODES_NAME);
        } catch (e) {
            console.error(e);
        } finally {
            await sleep(DEFAULT_SLEEP_TIME);
            this.setState({ loading: false });
        }
    };

    handleDZOSelectChange = (event) => {
        const dzoId = Number(event.target.value);
        const filteredPromoCampaignList = this.state.promoCampaignList.filter(item => item.dzoId === dzoId);
        this.optionRef.current.value = '';
        this.setState({ dzoId, filteredPromoCampaignList, promoCampaignId: null });
    };

    handlePromoCampaignSelectChange = (event) => this.setState({ promoCampaignId: event.target.value });

    handleFilterCheckboxChange = () => {
        this.setState(prevState => ({ isFiltered: !prevState.isFiltered }));
    };

    render() {
        const { startDate, endDate, isFiltered, loading } = this.state;

        const picker =
            <div className={ styles.container__block }>
                <label className={ styles.textFieldFormat }>
                    { START_DATE_LABLE }
                </label>
                <DatePicker
                    className={ styles.datepicker }
                    dateFormat={ DATE_FORMAT }
                    selected={ startDate }
                    onChange={ date => { this.handleChangeDate(date, true); } }
                />

                <label className={ styles.textFieldFormat }>
                    { END_DATE_LABLE }
                </label>
                <DatePicker
                    className={ styles.datepicker }
                    dateFormat={ DATE_FORMAT }
                    selected={ endDate }
                    onChange={ date => { this.handleChangeDate(date, false); } }
                />
            </div>;

        return (
            <div className={ styles.container }>
                <Header buttonBack={ false } menuMode />
                <div className={ styles.filesContainer }>
                    <h3>{ EXCEL_FILES_TITLE }</h3>
                    <div className={ styles.container__block }>
                        <p className={ styles.textFieldFormat }>
                            { FILTER_TITLE }
                        </p>
                        <input
                            className={ styles.checkbox }
                            type="checkbox"
                            checked={ isFiltered }
                            onChange={ this.handleFilterCheckboxChange }
                        />
                    </div>

                    { isFiltered ? picker : null }

                    <div className={ styles.container__block }>
                        <Button
                            label={ OFFERS_LABLE }
                            onClick={ this.getData(getOffers, OFFERS_NAME) }
                            className={ styles.container__button }
                            type="green"
                            font="roboto"
                            disabled={ loading }
                        />
                    </div>

                    <hr />
                    <div className={ styles.headerSection }>
                        <h3>{ EXPORT_TITLE }</h3>
                        <div className={ styles.container__block }>
                            <p>ДЗО<br />
                                <select className={ classNames(styles.select, styles.datepicker) }
                                    onChange={ this.handleDZOSelectChange }
                                >
                                    <option key="dzo_empty" value="">{ UNSPECIFIED_TITLE }</option>
                                    { this.state.dzoList.map((option, index) =>
                                        <option key={ `dzo_${index}` } value={ option.dzoId }>{ option.dzoName }</option>)
                                    }
                                </select>
                            </p>
                            <p>Промокампания<br />
                                <select ref={ this.optionRef } className={ classNames(styles.select, styles.datepicker) }
                                    onChange={ this.handlePromoCampaignSelectChange }
                                >
                                    <option key="campaign_empty" value="">{ UNSPECIFIED_TITLE }</option>
                                    { this.state.filteredPromoCampaignList.map((option, index) =>
                                        <option key={ `campaign_${index}` } value={ option.id }>{ option.name }</option>)
                                    }
                                </select>
                            </p>
                        </div>
                        { picker }
                        <div className={ styles.container__block }>
                            <Button
                                onClick={ this.downloadPromoCodes }
                                label={ EXPORT_LABLE }
                                font="roboto"
                                type="green"
                                disabled={ loading }
                            />
                        </div>
                    </div>
                </div>
            </div>
        );
    }

}

export default ReportsPage;
