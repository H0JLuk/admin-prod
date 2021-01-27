import React, { Component } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import moment from 'moment';
import { getInstallationUrl, getUsageUrl } from '../../api/services/settingsService';
import { DEFAULT_SLEEP_TIME } from '../../constants/time';
import { sleep } from '../../utils/utils';
import styles from './FilesPage.module.css';
import CustomModal from '../../components/CustomModal/CustomModal';
import Button from '../../components/Button/Button';
import Form from '../../components/Form/Form';
import cross from '../../static/images/cross.svg';
import classNames from 'classnames';
import { getErrorText } from '../../constants/errors';
import { populateFormWithData } from '../../components/Form/formHelper';
import { getOffers, getFeedback, uploadFile }
    from '../../api/services/adminService';
import { downloadFile } from '../../utils/helper';
import ButtonLabels from '../../components/Button/ButtonLables';
import { PDF_EDIT_FORM } from '../../components/Form/forms';
import { getAppCode } from '../../api/services/sessionService';
import { getDzoList } from '../../api/services/dzoService';
import { getPromoCampaignList } from '../../api/services/promoCampaignService';
import { getPromoCodeStatistics } from '../../api/services/promoCodeService';
import Header from '../../components/Header/Header';

const DATE_FORMAT = 'dd/MM/yyyy';

const PDF_DIR = 'guide';
const OFFERS_NAME = 'offers';
const PROMOCODES_NAME = 'promocodes';
const FEEDBACK_NAME = 'feedback';
const USAGE_NAME = 'usage';
const INSTALLATION_NAME = 'installation';

const OFFERS_LABLE = 'Скачать предложения';
const FEEDBACK_LABLE = 'Скачать фидбэк';
const EXPORT_LABLE = 'Скачать выданные промокоды';
const START_DATE_LABLE = 'с';
const END_DATE_LABLE = 'по';

const EXCEL_FILES_TITLE = 'Экспорт предложений и фидбеков';
const FILTER_TITLE = 'Фильтровать по дате';
const USAGE_TITLE = 'Инструкция пользователя (usage guide)';
const INSTALLATION_TITLE = 'Инструкция по установке приложения (installation guide)';
const CHANGE_PDF_TITLE = 'Заменить pdf';
const UNSPECIFIED_TITLE = 'Не задано';
const EXPORT_TITLE = 'Экспорт использованных промокодов';
const TITLES = { [USAGE_NAME]: USAGE_TITLE, [INSTALLATION_NAME]: INSTALLATION_TITLE };

const UPLOAD_PDF_PLEASE = 'Пожалуйста загрузите pdf-файл!';
const PDF_UPLOAD_ERROR = 'Ошибка загрузки pdf-файла!';
const FILTER_ERROR_MESSAGE = 'Введены некоректные данные для фильтра по дате';

class FilesPage extends Component {

    constructor(props) {
        super(props);
        this.optionRef = React.createRef();
        this.pdfRef = React.createRef();
        this.state = {
            startDate: null,
            endDate: null,
            isFiltered: true,
            isOpen: false,
            formError: null,
            installationUrl: null,
            usageUrl: null,
            editingPdf: null,
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
                const usageUrl = await getUsageUrl();
                const installationUrl = await getInstallationUrl();
                this.setState({ dzoList, promoCampaignList, usageUrl, installationUrl });
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

    openModal = () => { this.setState({ isOpen: true }); };

    closeModal = () => { this.setState({ isOpen: false, editingPdf: null }); };

    onSubmit = () => {
        const { editingPdf } = this.state;
        if (!this.pdfRef.current.files.length) {
            alert(UPLOAD_PDF_PLEASE);
            return;
        }
        if (!editingPdf) {
            return;
        }

        const pdfFile = this.pdfRef.current.files[0];
        const pdfName = `${getAppCode()}/${PDF_DIR}/${editingPdf}.pdf`;

        uploadFile(pdfFile, pdfName)
            .then(this.closeModal)
            .catch(error => {
                alert(PDF_UPLOAD_ERROR);
                console.error(error.message);
            });
    };

    renderModalForm = () => {
        const { formError, editingPdf } = this.state;
        const formData = editingPdf !== null
            ? populateFormWithData(PDF_EDIT_FORM, { pdfName: TITLES[editingPdf] })
            : PDF_EDIT_FORM;

        return (
            <div className={ styles.modalForm }>
                <img
                    src={ cross }
                    onClick={ this.closeModal }
                    className={ styles.crossSvg }
                    alt={ ButtonLabels.CLOSE }
                />
                <Form
                    data={ formData }
                    buttonText={ ButtonLabels.SAVE }
                    onSubmit={ this.onSubmit }
                    formClassName={ styles.pdfForm }
                    fieldClassName={ styles.pdfForm__field }
                    activeLabelClassName={ styles.pdfForm__field__activeLabel }
                    buttonClassName={ styles.pdfForm__button }
                    errorText={ getErrorText(formError) }
                    formError={ !!formError }
                    errorClassName={ styles.error }
                />
                <form className={ styles.pdfUploadContainer }>
                    <input
                        type='file'
                        id='pdfInput'
                        ref={ this.pdfRef }
                        className={ styles.pdfUpload }
                        accept='application/pdf'
                    />
                </form>
            </div>
        );
    };

    renderModifyModal = () => (
        <CustomModal
            isOpen={ this.state.isOpen }
            onRequestClose={ this.closeModal }>
            {this.renderModalForm()}
        </CustomModal>
    );

    render() {
        const { startDate, endDate, isFiltered, usageUrl, installationUrl, loading } = this.state;
        const openWithParam = editingPdf => {
            this.setState({ editingPdf });
            this.openModal();
        };
        const picker =
            <div className={ styles.container__block }>
                <label className={ styles.textFieldFormat }>
                    {START_DATE_LABLE}
                </label>
                <DatePicker
                    className={ styles.datepicker }
                    dateFormat={ DATE_FORMAT }
                    selected={ startDate }
                    onChange={ date => { this.handleChangeDate(date, true); } }
                />

                <label className={ styles.textFieldFormat }>
                    {END_DATE_LABLE}
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
                    <h3>{EXCEL_FILES_TITLE}</h3>
                    <div className={ styles.container__block }>
                        <p className={ styles.textFieldFormat }>
                            {FILTER_TITLE}
                        </p>
                        <input
                            className={ styles.checkbox }
                            type='checkbox'
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
                            type='green'
                            font='roboto'
                            disabled={ loading }
                        />
                        <Button
                            label={ FEEDBACK_LABLE }
                            onClick={ this.getData(getFeedback, FEEDBACK_NAME) }
                            className={ styles.container__button }
                            type='green'
                            font='roboto'
                            disabled={ loading }
                        />
                    </div>

                    {this.renderModifyModal()}

                    <hr />
                    <div className={ styles.headerSection }>
                        <h3>{USAGE_TITLE}</h3>
                        <div className={ styles.container__block }>
                            <a href={ usageUrl } download={ USAGE_NAME }>
                                {ButtonLabels.OPEN}
                            </a>
                            <Button
                                onClick={ () => openWithParam(USAGE_NAME) }
                                label={ CHANGE_PDF_TITLE }
                                font="roboto"
                                type="blue"
                            />
                        </div>
                    </div>

                    <hr />
                    <div className={ styles.headerSection }>
                        <h3>{INSTALLATION_TITLE}</h3>
                        <div className={ styles.container__block }>
                            <a href={ installationUrl } download={ INSTALLATION_NAME }>
                                {ButtonLabels.OPEN}
                            </a>
                            <Button
                                onClick={ () => openWithParam(INSTALLATION_NAME) }
                                label={ CHANGE_PDF_TITLE }
                                font="roboto"
                                type="blue"
                            />
                        </div>
                    </div>

                    <hr />
                    <div className={ styles.headerSection }>
                        <h3>{EXPORT_TITLE}</h3>
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
                        {picker}
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

export default FilesPage;
