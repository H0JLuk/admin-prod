import React, { Component, Fragment } from 'react';
import classNames from 'classnames';
import {
    addDzo,
    deleteDzo,
    getDzoList,
    getAllDzoList,
    updateDzo,
    addApplication
} from '../../api/services/dzoService';
import CustomButton from '../../components/CustomButton/CustomButton';
import { DZO_EDIT_FROM, DZO_ADD_FROM, APP_EDIT_FROM } from '../../components/Form/forms';
import Header from '../../components/Header/Redisegnedheader/Header';
import applicationTypes from '../../constants/applicationTypes';
import { getErrorText } from '../../constants/errors';
import CustomModal from '../../components/CustomModal/CustomModal';
import DzoItem from '../../components/DzoItem/DzoItem';
import Form from '../../components/Form/Form';
import cross from '../../static/images/cross.svg';
import { isRequired } from '../../utils/validators';
import styles from './DzoPage.module.css';
import { populateFormWithData } from '../../components/Form/formHelper';
import ButtonLabels from '../../components/Button/ButtonLables';
import inputStyles from '../../components/Input/Input.module.css';

const DZO_LIST_GET_ERROR = 'Ошибка получения ДЗО!';
const DZO_DELETE_ERROR = 'Ошибка удаления ДЗО!';
const ADD_DZO_TITLE = 'Добавить ДЗО';
const REMOVE_QUESTION = 'Удалить категорию?';
const DZO_LIST_TITLE = 'Список ДЗО';
const LOADING_LIST_LABEL = 'Загрузка';
const DZO_CODE_NOT_UNIQUE = 'ДЗО с таким кодом уже есть!';
const SET_APPLICATION_TYPE = 'Укажите тип приложения.';
const SET_APPLICATION_URL = 'Укажите ссылку на приложение.';

const LoadingStatus = ({ loading }) => (
    <p className={ styles.loadingLabel }>{ loading ? LOADING_LIST_LABEL : DZO_LIST_GET_ERROR }</p>
);

const initialEditingDzo = {
    id: null, dzoName: null, header: null,
    description: null, dzoCode: null, webUrl: null
};

const initialState = {
    editingDzo: initialEditingDzo,
    editingAppList: null,
    editingAppUrl: '',
    editingAppType: '',
    dzoList: [],
    allDzoList: [],
    isOpen: false,
    formError: null
};

class DzoPage extends Component {
    constructor(props) {
        super(props);
        this.state = initialState;
        this.reloadDzo = this.reloadDzo.bind(this);
        this.pushToDzoList = this.pushToDzoList.bind(this);
        this.handleDelete = this.handleDelete.bind(this);
        this.handleEdit = this.handleEdit.bind(this);
        this.handleAppTypeChange = this.handleAppTypeChange.bind(this);
        this.updateEditingAppUrl = this.updateEditingAppUrl.bind(this);
    }

    componentDidMount() {
        const loadData = async () => {
            try {
                const { dzoDtoList: dzoList = [] } = await getDzoList() ?? {};
                const { dzoDtoList: allDzoList = [] } = await getAllDzoList() ?? {};
                this.setState({ dzoList, allDzoList });
            } catch (e) {
                console.error(e.message);
            }
        };
        loadData();
    }

    clearState = () => this.setState({ editingDzo: initialEditingDzo, editingAppList: null,
        editingAppUrl: '',
        editingAppType: '' });

    openModal = () => this.setState({ isOpen: true });

    closeModal = () => this.setState({ isOpen: false }, this.clearState);

    handleDelete = (id) => {
        if (window.confirm(REMOVE_QUESTION)) {
            deleteDzo(id).then(() => {
                const croppedDzoList = this.state.dzoList.filter(dzo => dzo.dzoId !== id);
                this.setState({ dzoList: croppedDzoList });
            })
            .catch(() => alert(DZO_DELETE_ERROR));
        }
    };

    handleEdit = (id, dzoName, header, description, dzoCode, webUrl) =>
        this.setState({ editingDzo: { id, dzoName, header, description, dzoCode, webUrl } }, this.openModal);

    handleAddAppLink = (id, name, appList) =>
        this.setState({ editingDzo: { id: id, name: name }, editingAppList: appList }, () => this.openModal());

    handleAppTypeChange = ({ target: { value } }) => {
        const { editingAppList } = this.state;
        if (!editingAppList) {
            this.setState({ editingAppType: value, editingAppUrl: '' });
        } else {
            const appItem = editingAppList.find(element => (element.applicationType === value));
            if (appItem) {
                this.setState({ editingAppType: value, editingAppUrl: appItem.applicationUrl });
            } else {
                this.setState({ editingAppType: value, editingAppUrl: '' });
            }
        }
    }

    updateEditingAppUrl = (event) => this.setState({ editingAppUrl: event.target.value });

    renderModalForm = () => {
        const { formError, editingDzo } = this.state;
        const formData = editingDzo?.id != null ? populateFormWithData(DZO_EDIT_FROM, editingDzo) : DZO_ADD_FROM;
        return (
            <div className={ styles.modalForm }>
                <img src={ cross } onClick={ this.closeModal } className={ styles.crossSvg } alt={ ButtonLabels.CLOSE } />
                <Form
                    data={ formData }
                    buttonText={ ButtonLabels.SAVE }
                    onSubmit={ this.onSubmit }
                    formClassName={ styles.dzoForm }
                    fieldClassName={ styles.dzoForm__field }
                    activeLabelClassName={ styles.dzoForm__field__activeLabel }
                    buttonClassName={ styles.dzoForm__button }
                    errorText={ getErrorText(formError) }
                    formError={ !!formError }
                    errorClassName={ styles.error }
                />
            </div>
        );
    };

    renderAppEditModalForm = () => {
        const { formError, editingDzo } = this.state;
        const formData = populateFormWithData(APP_EDIT_FROM, { dzoName: editingDzo.name });

        return (
            <div className={ styles.modalAppForm }>
                <img src={ cross } onClick={ this.closeModal } className={ styles.crossSvg } alt={ ButtonLabels.CLOSE } />
                <Form
                    data={ formData }
                    buttonText={ ButtonLabels.SAVE }
                    onSubmit={ this.appUrlSubmit }
                    formClassName={ styles.appForm }
                    fieldClassName={ styles.appForm__field }
                    activeLabelClassName={ styles.appForm__field__activeLabel }
                    buttonClassName={ styles.appForm__button }
                    errorText={ getErrorText(formError) }
                    formError={ !!formError }
                    errorClassName={ styles.error }
                />
                <div className={ styles.appForm }>
                    <div className={ classNames(styles.appForm__field, inputStyles.field) }>
                        <label className={ classNames(inputStyles.label,styles.appForm__field__activeLabel) }>
                            Тип приложения:<br />
                        </label>
                        <select className={ styles.appForm } value={ this.state.editingAppType } onChange={ this.handleAppTypeChange }>
                            <option key={ 0 } value="">Не задано</option>
                            {applicationTypes.map(option =>
                                <option id={ option.type } key={ `application_${option.type}` } value={ option.type }>{option.type}</option>
                            )}
                        </select>
                    </div>
                    <div className={ classNames(styles.appForm__field, inputStyles.field) }>
                        <label htmlFor="appUrl" className={ classNames(inputStyles.label,styles.appForm__field__activeLabel) }>
                            Ссылка на приложение:<br />
                        </label>
                        <input type='text'
                               id='appUrl'
                               name='appUrl'
                               className={ inputStyles.input }
                               onChange={ this.updateEditingAppUrl }
                               value={ this.state.editingAppUrl }
                               required pattern="^[^ ]*"
                        />
                    </div>
                </div>
            </div>
        );
    };

    checkDzoCodeUnique = (dzoCode) => !!this.state.allDzoList.find(dzo => dzo?.dzoCode === dzoCode);

    reloadDzo(dzoDto) {
        const { editingDzo: { id, dzoName }, dzoList } = this.state;
        const newDzoList = dzoList.slice();
        newDzoList.forEach(elem => {
            if (elem.dzoId === id) {
                this.setState({ dzoList: newDzoList });
                elem.dzoName = dzoName;
                elem.header = dzoDto.header;
                elem.description = dzoDto.description;
                elem.webUrl = dzoDto.webUrl;
            }
        });
        this.setState({ dzoList: newDzoList }, this.closeModal);
    }

    pushToDzoList(dzoId, dzoDto) {
        const { id } = dzoId;
        const { dzoList, allDzoList } = this.state;
        const newDzoItem = { ...dzoDto, dzoId: id };
        const newDzoList = [newDzoItem, ...dzoList];
        const newAllDzoList = [newDzoItem, ...allDzoList];
        this.setState({ dzoList: newDzoList, allDzoList: newAllDzoList }, this.closeModal);
    }

    onSubmit = (data) => {
        const { editingDzo } = this.state;
        if (!editingDzo?.dzoCode && this.checkDzoCodeUnique(data?.dzoCode)) {
            alert(DZO_CODE_NOT_UNIQUE);
        } else {
            const dzoDto = {
                ...data,
                description: (data.description === '') ? null : data.description,
                header: (data.header === '') ? null : data.header,
                webUrl: (data.webUrl === '') ? null : data.webUrl,
            };
            if (editingDzo.id != null) {
                updateDzo(editingDzo.id, {
                    ...dzoDto,
                    dzoName: editingDzo.dzoName,
                    dzoCode: editingDzo.dzoCode
                })
                    .then(() => this.reloadDzo(dzoDto))
                    .catch(error => console.warn(error.message));
            } else {
                addDzo(dzoDto)
                    .then(dzoId => this.pushToDzoList(dzoId, dzoDto))
                    .catch(error => console.warn(error.message));
            }
        }
    };

    appUrlSubmit = () => {
        const { editingAppType: applicationType, editingAppUrl: applicationUrl, editingDzo, dzoList } = this.state;

        if (!applicationType) {
            alert(SET_APPLICATION_TYPE);
            return;
        }
        if (!isRequired(applicationUrl)) {
            alert(SET_APPLICATION_URL);
            return;
        }

        addApplication({ dzoId: editingDzo.id, applicationType, applicationUrl })
            .then(response => {
                const newDzoList = dzoList.slice();
                const curDzo = newDzoList.find(elem => (elem.dzoId === editingDzo.id));

                if (!curDzo.applicationList) {
                    curDzo.applicationList = [];
                    curDzo.applicationList.push({
                        applicationId: response.id, applicationType,
                        applicationUrl, dzoId: editingDzo.id
                    });
                } else {
                    if (!curDzo.applicationList.find(app => {
                        if (app.applicationType === applicationType) {
                            app.applicationUrl = applicationUrl;
                            return true;
                        }})
                    ) {
                        curDzo.applicationList.push({
                            applicationId: response.id, applicationType,
                            applicationUrl, dzoId: editingDzo.id
                        });
                    }
                }
                this.setState({ dzoList: newDzoList }, this.closeModal);
            })
            .catch(error => console.error(error.message));
    };

    renderDzoList = () => {
        const { dzoList } = this.state;
        return (
            <Fragment>
                {Array.isArray(dzoList) ? (
                    dzoList.length ?
                        dzoList.map((dzo, i) =>
                            <DzoItem
                                key={ `dzoItem-${i}` }
                                handleDelete={ this.handleDelete }
                                handleEdit={ this.handleEdit }
                                handleAddAppLink={ this.handleAddAppLink }
                                { ...dzo }
                            />
                        ) : (
                            <LoadingStatus loading />
                        )) : (
                    <LoadingStatus />
                )}
            </Fragment>
        );
    };

    renderModifyModal = () => {
        return (
            <CustomModal isOpen={ this.state.isOpen } onRequestClose={ this.closeModal }>
                {this.state.editingAppList !== null ? this.renderAppEditModalForm() : this.renderModalForm()}
            </CustomModal>
        );
    }

    render() {
        const openWithParam = () => {
            this.openModal();
        };
        return (
            <div className={ styles.dzoPageWrapper }>
                <Header buttonBack={ false } />
                { this.renderModifyModal() }
                <div className={ styles.headerSection }>
                    <h3>{DZO_LIST_TITLE}</h3>
                    <CustomButton className={ styles.submitButton } onClick={ openWithParam }>
                        { ADD_DZO_TITLE }
                    </CustomButton>
                </div>
                <div className={ styles.content }>
                    {this.renderDzoList()}
                </div>
            </div>
        );
    }
}

export default DzoPage;
