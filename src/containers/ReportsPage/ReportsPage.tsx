import React, { ChangeEvent, Component } from 'react';
import moment, { Moment } from 'moment';
import classNames from 'classnames';
import { Button, DatePicker } from 'antd';
import localeDatePicker from 'antd/es/date-picker/locale/ru_RU';
import Header from '@components/Header';
import AutoCompleteComponent from '@components/AutoComplete';
import AutocompleteOptionLabel from '@components/AutoComplete/AutocompleteLocationAndSalePoint/AutocompleteOptionLabel';
import { getOffers } from '@apiServices/adminService';
import { getPromoCampaignList } from '@apiServices/promoCampaignService';
import { getSalePointsByText } from '@apiServices/salePointService';
import { getDzoList } from '@apiServices/dzoService';
import { getSalesReport } from '@apiServices/salesReportService';
import { getPromoCodeStatistics } from '@apiServices/promoCodeService';
import { DEFAULT_SLEEP_TIME } from '@constants/common';
import { getStringOptionValueByDescription, sleep } from '@utils/utils';
import { downloadFile } from '@utils/helper';
import { PromoCampaignDto, DzoDto, SalePointDto } from '@types';
import {
    DATE_FORMAT,
    DATE_LABELS,
    OFFERS,
    PROMOCODES,
    REPORTS,
    FILTER_TITLE,
    UNSPECIFIED_TITLE,
    FILTER_ERROR_MESSAGE,
} from './ReportsPageContants';

import styles from './ReportsPage.module.css';

type ReportsPageState = {
    startDate: Moment | null;
    endDate: Moment | null;
    isFiltered: boolean;
    dzoList: DzoDto[];
    dzoId: number | null;
    salesDzoId: number | null;
    promoCampaignList: PromoCampaignDto[];
    filteredPromoCampaignList: PromoCampaignDto[];
    filteredPromoCampaignListSales: PromoCampaignDto[];
    promoCampaignId: number | null;
    salesPromoCampaignId: number | null;
    salePointOfferId: number | null;
    salePointPromoId: number | null;
    salesReportSalePointId: number | null;
    loading: boolean;
};
class ReportsPage extends Component<Record<string, unknown>, ReportsPageState> {
    optionRef: React.RefObject<HTMLSelectElement>;
    pdfRef: React.RefObject<HTMLInputElement>;
    salesPromoRef: React.RefObject<HTMLSelectElement>;
    constructor(props: Record<string, unknown>) {
        super(props);
        this.optionRef = React.createRef();
        this.pdfRef = React.createRef();
        this.salesPromoRef = React.createRef();
        this.state = {
            startDate: null,
            endDate: null,
            isFiltered: true,
            dzoList: [],
            dzoId: null,
            salesDzoId: null,
            promoCampaignList: [],
            filteredPromoCampaignList: [],
            filteredPromoCampaignListSales: [],
            promoCampaignId: null,
            salesPromoCampaignId: null,
            loading: false,
            salePointOfferId: null,
            salePointPromoId: null,
            salesReportSalePointId: null,
        };
    }

    componentDidMount() {
        const currentDate = moment();
        const startDate = moment().subtract(14, 'days');
        this.setState({ startDate, endDate: currentDate });
        const loadData = async () => {
            try {
                const { dzoDtoList: dzoList = [] } = await getDzoList() ?? {};
                const { promoCampaignDtoList: promoCampaignList = [] } = await getPromoCampaignList() ?? {};
                this.setState({ dzoList, promoCampaignList });
            } catch (e) {
                const error = (e as Error).message;
                console.error(error);
            }
        };
        loadData();
    }

    checkDate = (start: Moment | null, end: Moment | null) => {
        const momentStartDate = moment(start);
        const momentEndDate = moment(end);
        if (
            !momentStartDate.isValid() ||
            !momentEndDate.isValid() ||
            momentStartDate > momentEndDate
        ) {
            alert(FILTER_ERROR_MESSAGE);
            return false;
        }
        return true;
    };

    getData = (func: (start: number | null, end: number | null, salePointId?: number | null) => Promise<BlobPart>, name: string) => async () => {
        if (typeof(func) !== 'function') {
            return;
        }

        const {
            startDate,
            endDate,
            isFiltered,
            salePointOfferId,
        } = this.state;

        if (isFiltered && !this.checkDate(startDate, endDate)) {
            return;
        }

        const startTime = isFiltered && startDate ? startDate.valueOf() : null;
        const endTime = isFiltered && endDate ? endDate.valueOf() : null;
        try {
            this.setState({ loading: true });
            func(startTime, endTime, salePointOfferId).then(data => downloadFile(data, name));
        } catch (e) {
            console.error(e);
        } finally {
            await sleep(DEFAULT_SLEEP_TIME);
            this.setState({ loading: false });
        }
    };

    handleChangeDate = (date: Moment | null, isStartDate: boolean) => {
        if (isStartDate) {
            this.setState({ startDate: date });
        } else {
            this.setState({ endDate: date });
        }
    };

    downloadPromoCodes = async () => {
        const {
            startDate,
            endDate,
            dzoId,
            promoCampaignId,
            salePointPromoId,
        } = this.state;

        if (!this.checkDate(startDate, endDate)) {
            return;
        }

        const momentStartDate = moment(startDate).format('DD.MM.YYYY');
        const momentEndDate = moment(endDate).format('DD.MM.YYYY');

        try {
            this.setState({ loading: true });
            const blob = await getPromoCodeStatistics(
                momentStartDate,
                momentEndDate,
                dzoId!,
                promoCampaignId!,
                salePointPromoId!,
            );
            downloadFile(blob, PROMOCODES.NAME);
        } catch (e) {
            console.error(e);
        } finally {
            await sleep(DEFAULT_SLEEP_TIME);
            this.setState({ loading: false });
        }
    };

    downloadSalesReport = async () => {
        const {
            startDate,
            endDate,
            salesDzoId,
            salesPromoCampaignId,
            salesReportSalePointId,
        } = this.state;

        if (!this.checkDate(startDate, endDate)) {
            return;
        }

        const start = moment(startDate).format('DD.MM.YYYY');
        const end = moment(endDate).format('DD.MM.YYYY');

        const isNumber = (value: number | null): value is number => typeof value === 'number';

        const salesReportArgs = {
            start,
            end,
            ...(isNumber(salesDzoId) && { dzoId: salesDzoId }),
            ...(isNumber(salesPromoCampaignId) && { promoCampaignId: salesPromoCampaignId }),
            ...(isNumber(salesReportSalePointId) && { salePointId: salesReportSalePointId }),
        };

        try {
            this.setState({ loading: true });
            const blob = await getSalesReport(salesReportArgs);
            downloadFile(blob, REPORTS.NAME);
        } catch (e) {
            console.error(e);
        } finally {
            await sleep(DEFAULT_SLEEP_TIME);
            this.setState({ loading: false });
        }
    };

    handleDZOSelectChangePromo = (event: ChangeEvent<HTMLSelectElement>) => {
        const dzoId = event.target.value ? Number(event.target.value) : null;
        const filteredPromoCampaignList = this.state.promoCampaignList.filter(item => item.dzoId === dzoId);
        if (this.optionRef.current) {
            this.optionRef.current.value = '';
        }
        this.setState({ dzoId, filteredPromoCampaignList, promoCampaignId: null });
    };

    handleDZOSelectChangeSales = (event: ChangeEvent<HTMLSelectElement>) => {
        const salesDzoId = event.target.value ? Number(event.target.value) : null;
        const filteredPromoCampaignListSales = this.state.promoCampaignList.filter(item => item.dzoId === salesDzoId);
        if (this.salesPromoRef.current) {
            this.salesPromoRef.current.value = '';
        }
        this.setState({ salesDzoId, filteredPromoCampaignListSales, salesPromoCampaignId: null });
    };

    handlePromoCampaignSelectChange = (event: ChangeEvent<HTMLSelectElement>) => {
        const promoCampaignId = event.target.value ? Number(event.target.value) : null;
        this.setState({ promoCampaignId });
    };

    handlePromoCampaignSalesSelect = (event: ChangeEvent<HTMLSelectElement>) => {
        const salesPromoCampaignId = event.target.value ? Number(event.target.value) : null;
        this.setState({ salesPromoCampaignId });
    };

    handleFilterCheckboxChange = () => {
        this.setState(prevState => ({ isFiltered: !prevState.isFiltered }));
    };
    handleSalePointPromoSelect = (data: SalePointDto | null) => this.setState({ salePointPromoId: data ? data.id : null });
    handleSalePointOfferSelect = (data: SalePointDto | null) => this.setState({ salePointOfferId: data ? data.id : null });
    handleSalePointSalesSelect = (data: SalePointDto | null) => this.setState({ salesReportSalePointId: data ? data.id : null });

    render() {
        const { startDate, endDate, isFiltered, loading } = this.state;

        const picker = (
            <div className={styles.container__block}>
                <label className={styles.textFieldFormat}>
                    {DATE_LABELS.START}
                </label>
                <DatePicker
                    className={styles.datepicker}
                    locale={localeDatePicker}
                    format={DATE_FORMAT}
                    value={startDate}
                    onChange={date => { this.handleChangeDate(date, true); }}
                />

                <label className={styles.textFieldFormat}>
                    {DATE_LABELS.END}
                </label>
                <DatePicker
                    className={styles.datepicker}
                    locale={localeDatePicker}
                    format={DATE_FORMAT}
                    value={endDate}
                    onChange={date => { this.handleChangeDate(date, false); }}
                />
            </div>
        );

        return (
            <div className={styles.container}>
                <Header buttonBack={false} menuMode />
                <div className={styles.filesContainer}>
                    <h3>{OFFERS.TITLE}</h3>
                    <div className={styles.container__block}>
                        <div className={styles.container__block__wrapper}>
                            <p className={styles.textFieldFormat}>
                                {FILTER_TITLE}
                            </p>
                            <input
                                className={styles.checkbox}
                                type="checkbox"
                                checked={isFiltered}
                                onChange={this.handleFilterCheckboxChange}
                            />
                        </div>
                        <div className={styles.autocomplete}>
                            Точка продажи<br />
                            <AutoCompleteComponent<SalePointDto>
                                onSelect={this.handleSalePointOfferSelect}
                                requestFunction={getSalePointsByText}
                                placeholder={UNSPECIFIED_TITLE}
                                renderOptionStringValue={getStringOptionValueByDescription}
                                renderOptionItemLabel={({ name, parentName }: any, value: string) => (
                                    <AutocompleteOptionLabel
                                        name={name}
                                        parentName={parentName}
                                        highlightValue={value}
                                        highlightClassName={styles.highlight}
                                    />
                                )}
                            />
                        </div>
                    </div>

                    {isFiltered ? picker : null}

                    <div className={styles.container__block}>
                        <Button
                            onClick={this.getData(getOffers, OFFERS.NAME)}
                            className={styles.container__button}
                            type="primary"
                            disabled={loading}
                        >
                            {OFFERS.LABEL}
                        </Button>
                    </div>

                    <hr />
                    <div className={styles.headerSection}>
                        <h3>{PROMOCODES.TITLE}</h3>
                        <div className={styles.container__block}>
                            <p>ДЗО<br />
                                <select className={classNames(styles.select, styles.datepicker)}
                                    onChange={this.handleDZOSelectChangePromo}
                                >
                                    <option key="dzo_empty" value="">{UNSPECIFIED_TITLE}</option>
                                    {this.state.dzoList.map((option, index) =>
                                        <option key={`dzo_${index}`} value={option.dzoId}>{option.dzoName}</option>)
                                    }
                                </select>
                            </p>
                            <p>Промокампания<br />
                                <select ref={this.optionRef} className={classNames(styles.select, styles.datepicker)}
                                    onChange={this.handlePromoCampaignSelectChange}
                                >
                                    <option key="campaign_empty" value="">{UNSPECIFIED_TITLE}</option>
                                    {this.state.filteredPromoCampaignList.map((option, index) =>
                                        <option key={`campaign_${index}`} value={option.id}>{option.name}</option>)
                                    }
                                </select>
                            </p>
                            <div className={styles.autocomplete}>
                                Точка продажи<br />
                                <AutoCompleteComponent<SalePointDto>
                                    onSelect={this.handleSalePointPromoSelect}
                                    requestFunction={getSalePointsByText}
                                    placeholder={UNSPECIFIED_TITLE}
                                    renderOptionStringValue={getStringOptionValueByDescription}
                                    renderOptionItemLabel={({ name, parentName }: any, value: string) => (
                                        <AutocompleteOptionLabel
                                            name={name}
                                            parentName={parentName}
                                            highlightValue={value}
                                            highlightClassName={styles.highlight}
                                        />
                                    )}
                                />
                            </div>
                        </div>
                        {picker}
                        <div className={styles.container__block}>
                            <Button
                                onClick={this.downloadPromoCodes}
                                type="primary"
                                disabled={loading}
                            >
                                {PROMOCODES.LABEL}
                            </Button>
                        </div>
                    </div>

                    <hr />
                    <div className={styles.headerSection}>
                        <h3>{REPORTS.TITLE}</h3>
                        <div className={styles.container__block}>
                            <p>ДЗО<br />
                                <select className={classNames(styles.select, styles.datepicker)}
                                    onChange={this.handleDZOSelectChangeSales}
                                >
                                    <option key="dzo_empty" value="">{UNSPECIFIED_TITLE}</option>
                                    {this.state.dzoList.map((option, index) =>
                                        <option key={`dzo_${index}`} value={option.dzoId}>{option.dzoName}</option>)
                                    }
                                </select>
                            </p>
                            <p>Промокампания<br />
                                <select ref={this.salesPromoRef} className={classNames(styles.select, styles.datepicker)}
                                    onChange={this.handlePromoCampaignSalesSelect}
                                >
                                    <option key="campaign_empty" value="">{UNSPECIFIED_TITLE}</option>
                                    {this.state.filteredPromoCampaignListSales.map((option, index) =>
                                        <option key={`campaign_${index}`} value={option.id}>{option.name}</option>)
                                    }
                                </select>
                            </p>
                            <div className={styles.autocomplete}>
                                Точка продажи<br />
                                <AutoCompleteComponent<SalePointDto>
                                    onSelect={this.handleSalePointSalesSelect}
                                    requestFunction={getSalePointsByText}
                                    placeholder={UNSPECIFIED_TITLE}
                                    renderOptionStringValue={getStringOptionValueByDescription}
                                    renderOptionItemLabel={({ name, parentName }: any, value: string) => (
                                        <AutocompleteOptionLabel
                                            name={name}
                                            parentName={parentName}
                                            highlightValue={value}
                                            highlightClassName={styles.highlight}
                                        />
                                    )}
                                />
                            </div>
                        </div>
                        {picker}
                        <div className={styles.container__block}>
                            <Button
                                onClick={this.downloadSalesReport}
                                type="primary"
                                disabled={loading}
                            >
                                {REPORTS.LABEL}
                            </Button>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

}

export default ReportsPage;
