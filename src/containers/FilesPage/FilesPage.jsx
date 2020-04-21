import React, { Component, Fragment } from 'react';
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import CustomModal from '../../components/CustomModal/CustomModal';
import moment from "moment";
import styles from './FilesPage.module.css';
import Button from '../../components/Button/Button';
import { getOffers, getFeedback } from '../../api/services/adminService';
import { downloadFile } from '../../utils/helper';

const DATE_FORMAT = 'dd/MM/yyyy';
const FILTER_ERROR_MESSAGE = 'Введены некоректные данные для фильтра по дате';

class FilesPage extends Component {
    constructor(props) {
        super(props);
        this.state = {
            startDate: null,
            endDate: null,
            isFiltered: true
        }
    }

    componentDidMount() {
        const currentDate = new Date();
        const startDate = new Date(currentDate.getTime());
        startDate.setDate(startDate.getDate() - 14);
        this.setState({ startDate, endDate: currentDate });
    }

    getData = (func, name) => () => {
        if (typeof(func) !== 'function') {
            return;
        }
        const {startDate, endDate, isFiltered} = this.state;
        if (isFiltered) {
            const momentStartDate = moment(startDate);
            const momentEndDate = moment(endDate);
            if (!momentStartDate.isValid() || !momentEndDate.isValid()
                    || momentStartDate > momentEndDate) {
                alert(FILTER_ERROR_MESSAGE);
                return ;
            }
        }
        const startTime = (isFiltered) ? startDate.getTime() : null;
        const endTime = (isFiltered) ? endDate.getTime() : null;
        func(startTime, endTime).then((data) => {
            downloadFile(data, name);
        });
    };

    handleChangeDate = (date, isStartDate) => {
        if (isStartDate) {
            this.setState({ startDate: date });
        } else {
            this.setState({ endDate: date });
        }
    };

    handleFilterCheckboxChange = () => {
        this.setState(prevState => ({ isFiltered: !prevState.isFiltered }));
    };

    render() {
        const {startDate, endDate, isFiltered} = this.state;
        const picker = (isFiltered) ?
            <div className={styles.container__block}>
                <label className={styles.textFieldFormat}>
                    с
                </label>
                <DatePicker
                    className={styles.datepicker}
                    dateFormat={DATE_FORMAT}
                    selected={startDate}
                    onChange={ date => { this.handleChangeDate(date, true) }}
                />
                <label className={styles.textFieldFormat}>
                    по
                </label>
                <DatePicker
                    className={styles.datepicker}
                    dateFormat={DATE_FORMAT}
                    selected={endDate}
                    onChange={ date => { this.handleChangeDate(date, false) }}
                />
            </div> : null;
        return (
            <div className={styles.container}>
                <div className={styles.container__block}>
                    <p className={styles.textFieldFormat}>
                        Фильтровать по дате
                    </p>
                    <input
                        className={styles.checkbox}
                        type="checkbox"
                        checked={isFiltered}
                        onChange={this.handleFilterCheckboxChange}
                    />
                </div>
                {picker}
                <div className={styles.container__block}>
                    <Button
                        label='Скачать предложения'
                        onClick={this.getData(getOffers, 'offers')}
                        className={styles.container__button}
                        type='green'
                        font='roboto'
                    />
                    <Button
                        label='Скачать фидбэк'
                        onClick={this.getData(getFeedback, 'feedback')}
                        className={styles.container__button}
                        type='green'
                        font='roboto'
                    />
                </div>
            </div>
        )
    }
}

export default FilesPage;
