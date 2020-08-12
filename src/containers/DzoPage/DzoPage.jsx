import React, { Component, Fragment } from 'react';
import { uploadFile } from '../../api/services/adminService';
import {
    addDzo,
    deleteDzo,
    getDzoList,
    getAllDzoList,
    updateDzo,
    getBehaviorTypes,
    addApplication } from '../../api/services/dzoService';
import { getCategoryList } from '../../api/services/categoryService';
import { getStaticUrl } from '../../api/services/settingsService';
import { DZO_EDIT_FROM, DZO_ADD_FROM, APP_EDIT_FROM } from '../../components/Form/forms';
import { getErrorText } from '../../constants/errors';
import applicationTypes from '../../constants/applicationTypes';
import CustomModal from '../../components/CustomModal/CustomModal';
import DzoItem from '../../components/DzoItem/DzoItem';
import Form from '../../components/Form/Form';
import Button from '../../components/Button/Button';
import cross from '../../static/images/cross.svg';
import styles from './DzoPage.module.css';
import { populateFormWithData } from '../../components/Form/formHelper';
import ButtonLabels from '../../components/Button/ButtonLables';
import classNames from 'classnames';
import inputStyles from '../../components/Input/Input.module.css';
import { isRequired } from '../../utils/validators';
import { getAppCode } from "../../api/services/sessionService";

const DZO_LIST_GET_ERROR = 'Ошибка получения ДЗО!';
const DZO_DELETE_ERROR = 'Ошибка удаления ДЗО!';
const IMAGE_UPLOAD_ERROR = 'Ошибка загрузки изображения!';
const ADD_DZO_TITLE = 'Добавить ДЗО';
const REMOVE_QUESTION = 'Удалить категорию?';
const DZO_LIST_TITLE = 'Список ДЗО';
const LOADING_LIST_LABEL = 'Загрузка';
const DZO_DIR = 'dzo';
const SET_BEHAVIOR = 'Укажите поведение.';
const SET_APPLICATION_TYPE = 'Укажите тип приложения.';
const SET_APPLICATION_URL = 'Укажите ссылку на приложение.';
const DZO_CODE_NOT_UNIQUE = 'ДЗО с таким кодом уже есть!';

const LoadingStatus = ({ loading }) => (
    <p className={ styles.loadingLabel }>{ loading ? LOADING_LIST_LABEL : DZO_LIST_GET_ERROR }</p>
);

const initialState = { 
    editingDzo: { 
        id: null, name: null, header: null, description: null,
        cardUrl: null, screenUrl: null, logoUrl: null,
        dzoCode: null, webUrl: null, behaviorType: null, behaviorId: '' 
    },
    editingAppList: null, editingAppUrl: '', editingAppType: null,
    categoryIdList: [], cardFile: null, screenFile: null, logoFile: null
};

class DzoPage extends Component {
    constructor(props) {
        super(props);
        this.dzoRef = React.createRef();
        this.state = { ...initialState,
            staticUrl: getStaticUrl(),
            behaviorTypes: [],
            dzoList: [],
            allDzoList: [],
            categories: [],
            isOpen: false,
            formError: null
        };
        this.handleChange = this.handleChange.bind(this);
        this.handleClick = this.handleClick.bind(this);
        this.handleImageSelect = this.handleImageSelect.bind(this);
        this.uploadFiles = this.uploadFiles.bind(this);
        this.reloadDzo = this.reloadDzo.bind(this);
        this.pushToDzoList = this.pushToDzoList.bind(this);
        this.handleAppTypeChange = this.handleAppTypeChange.bind(this);
        this.updateEditingAppUrl = this.updateEditingAppUrl.bind(this);
    }

    componentDidMount() {
        getDzoList().then( response => {
            const { dzoDtoList } = response;
            this.setState({ dzoList: dzoDtoList });
            return getAllDzoList();
        }).then(response => {
            const { dzoDtoList } = response;
            this.setState({ allDzoList: dzoDtoList });
            return getBehaviorTypes();
        }).then(behaviorTypes => {
            this.setState({ behaviorTypes: behaviorTypes });
            return getCategoryList();
        }).then(response => {
            const { categoryList } = response;
            this.setState({ categories: categoryList });
        }).catch(() => this.setState({
            dzoList: [], allDzoList: [], behaviorTypes: [], categories: []
        }));
    }

    clearState = () => this.setState(initialState);

    openModal = () => this.setState({ isOpen: true });

    closeModal = () => this.setState({ isOpen: false }, this.clearState);

    handleDelete = (id) => {
        if (window.confirm(REMOVE_QUESTION)) {
            deleteDzo(id).then( () => {
                const croppedDzoList = this.state.dzoList.filter(dzo => dzo.dzoId !== id);
                this.setState({ dzoList: croppedDzoList });
            })
            .catch(() => alert(DZO_DELETE_ERROR));
        }
    };

    handleEdit = (
        id, name, screenUrl, logoUrl, header, description,
        cardUrl, dzoCode, webUrl, behaviorType, categoryList
    ) => {
        const { behaviorTypes } = this.state;
        behaviorTypes.forEach( elem => {
            if (elem.behaviorType === behaviorType) {
                this.setState({
                    editingDzo: {
                        id, name, screenUrl, logoUrl, header, description, cardUrl, dzoCode, webUrl,
                        behaviorId: elem.behaviorId, behaviorType: elem.behaviorType
                    }
                });
            }
        });
        const categoryIdList = [];
        categoryList.forEach( elem => {
            categoryIdList.push(elem.categoryId);
        });
        this.setState({ categoryIdList: categoryIdList }, () => { this.openModal(); });
    };

    handleAddAppLink = (id, name, appList) => {
        this.setState({ editingDzo: { id: id, name: name }, editingAppList: appList }, () => this.openModal());
    };

    handleChange(event) {
        const { options, selectedIndex, value: behaviorId } = event.target;
        const behaviorType = options[selectedIndex].text;
        this.setState( prevState => ({ editingDzo: { ...prevState.editingDzo, behaviorId, behaviorType } }));
    }

    handleClick(event) {
        const categoryList = [];
        this.state.categoryIdList.forEach(elem => {
            categoryList.push(elem.toString());
        });
        if (event.target.multiple) {
            return;
        }
        const index = categoryList.indexOf(event.target.value);
        if (index !== -1) {
            categoryList.splice(index, 1);
        } else {
            categoryList.push(event.target.value);
        }
        this.setState({ categoryIdList: categoryList });
    }

    handleAppTypeChange({ target: { value } }) {
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

    updateEditingAppUrl(event) {
        this.setState({ editingAppUrl: event.target.value });
    }

    handleImageSelect(event) {
        switch (event.target.id) {
            case ('dzoCardImage') : this.setState({ cardFile: event.target.files[0] });
                break;
            case ('dzoScreenImage') : this.setState({ screenFile: event.target.files[0] });
                break;
            case ('dzoLogoImage') : this.setState({ logoFile: event.target.files[0] });
                break;
            default : return;
        }
    }

    uploadFiles(dzoCode) {
        const { cardFile, screenFile, logoFile, staticUrl } = this.state;
        const promiseArray = [];
        const imageName = `${getAppCode()}/${DZO_DIR}/${dzoCode}/`;

        if (cardFile != null) {
            promiseArray.push(uploadFile(cardFile, `${imageName}card/${cardFile.name}`)
                .then( response => {
                    this.setState( prevState => ({ editingDzo: {
                        ...prevState.editingDzo,
                        cardUrl: staticUrl + response.path
                    } }));
                })
            );
        }
        if (screenFile != null) {
            promiseArray.push(uploadFile(screenFile, `${imageName}screen/${screenFile.name}`)
                .then( response => {
                    this.setState( prevState => ({ editingDzo: {
                        ...prevState.editingDzo,
                        screenUrl: staticUrl + response.path
                    } }));
                })
            );
        }
        if (logoFile != null) {
            promiseArray.push(uploadFile(logoFile, `${imageName}logo/${logoFile.name}`)
                .then( response => {
                    this.setState( prevState => ({ editingDzo: {
                        ...prevState.editingDzo,
                        logoUrl: staticUrl + response.path
                    } }));
                })
            );
        }
        return promiseArray;
    }

    renderModalForm = () => {
        const { formError, editingDzo, categories, behaviorTypes } = this.state;
        const formData = editingDzo.id != null ? populateFormWithData(DZO_EDIT_FROM, {
            dzoName: editingDzo.name,
            header: editingDzo.header,
            description: editingDzo.description,
            dzoCode: editingDzo.dzoCode,
            webUrl: editingDzo.webUrl
        }) : DZO_ADD_FROM;
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
                <form className={ styles.dzoForm }>
                    <label className={ styles.dzoForm__field__activeLabel }>
                        Категории: <br />
                        <select className={ styles.dzoForm } value={ this.state.categoryIdList } readOnly={ true } onClick={ this.handleClick } multiple={ true }>
                            {categories.map(option => { return <option id={ option } key={ `category_${option.categoryId}` } value={ option.categoryId.valueOf() }>{option.categoryName}</option>;
                            })}
                        </select>
                    </label>
                </form>
                <form className={ styles.dzoForm }>
                    <label className={ styles.dzoForm__field__activeLabel }>
                        Тип поведения:<br />
                        <select className={ styles.dzoForm } value={ this.state.editingDzo.behaviorId } onChange={ this.handleChange }>
                            <option key={ 0 } value=""> Не задано </option>
                            {behaviorTypes.map(option => { return <option id={ option } key={ `behavior_${option.behaviorId}` } value={ option.behaviorId }>{option.behaviorType}</option>;
                            })}
                        </select>
                    </label>
                </form>
                <form className={ styles.imageUploadContainer }>
                    <label htmlFor="dzoImageInput">Изображение ДЗО card</label>
                    <input type="file" id="dzoCardImage" ref={ this.dzoRef } className={ styles.imageUpload } onChange={ this.handleImageSelect } />
                </form>
                <form className={ styles.imageUploadContainer }>
                    <label htmlFor="dzoImageInput">Изображение ДЗО screen</label>
                    <input type="file" id="dzoScreenImage" ref={ this.dzoRef } className={ styles.imageUpload } onChange={ this.handleImageSelect } />
                </form>
                <form className={ styles.imageUploadContainer }>
                    <label htmlFor="dzoImageInput">Изображение ДЗО logo</label>
                    <input type="file" id="dzoLogoImage" ref={ this.dzoRef } className={ styles.imageUpload } onChange={ this.handleImageSelect } />
                </form>
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
                    <select className={ styles.appForm } value={ this.editingAppType } onChange={ this.handleAppTypeChange }>
                        <option key={ 0 } value=""> Не задано </option>
                        {applicationTypes.map(option => { return <option id={ option.type } key={ `application_${option.type}` } value={ option.type }>{option.type}</option>;
                        })}
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

    checkDzoCodeUnique(dzoCode) {
        return this.state.allDzoList.find( dzo => {
            if (dzo.dzoCode === dzoCode) {
                return true;
            }
        });
    }

    reloadDzo(dzoDto) {
        const {
            editingDzo: { id, cardUrl, screenUrl, logoUrl, name, behaviorType },
            dzoList, cardFile, screenFile, logoFile, categoryIdList
        } = this.state;
        const newDzoList = dzoList.slice();
        newDzoList.forEach( elem => {
            if (elem.dzoId === id) {
                if (cardFile !== null && elem.cardUrl === cardUrl) {
                    elem.cardUrl = '';
                }
                if (screenFile !== null && elem.screenUrl === screenUrl) {
                    elem.screenUrl = '';
                }
                if (logoFile !== null && elem.logoUrl === logoUrl) {
                    elem.logoUrl = '';
                }
                this.setState({ dzoList: newDzoList });
                elem.name = name;
                elem.header = dzoDto.header;
                elem.description = dzoDto.description;
                elem.cardUrl = cardUrl;
                elem.screenUrl = screenUrl;
                elem.logoUrl = logoUrl;
                elem.webUrl = dzoDto.webUrl;
                elem.behaviorType = behaviorType;
                elem.categoryList = categoryIdList.map( value => {
                    return { categoryId: value };
                });
            }
        });
        this.setState({ dzoList: newDzoList }, this.closeModal);
    }

    pushToDzoList(dzoId, dzoDto) {
        const { id } = dzoId;
        const { categoryIdList, editingDzo, dzoList, allDzoList } = this.state;
        const categoryList = categoryIdList.map( value => {
            return { categoryId: value };
        });
        const newDzoItem = { ...dzoDto, cardUrl: editingDzo.cardUrl, screenUrl: editingDzo.screenUrl,
            logoUrl: editingDzo.logoUrl, dzoId: id, behaviorType: editingDzo.behaviorType, categoryList
        };
        const newDzoList = [newDzoItem, ...dzoList];
        const newAllDzoList = [newDzoItem, ...allDzoList];
        this.setState({ dzoList: newDzoList, allDzoList: newAllDzoList }, this.closeModal);
    }

    onSubmit = (data) => {
        const { editingDzo } = this.state;
        const dzoCode = editingDzo.dzoCode ? editingDzo.dzoCode : data.dzoCode;
        if (!editingDzo.behaviorId) {
            alert(SET_BEHAVIOR);
            return;
        }
        if (!editingDzo.dzoCode && this.checkDzoCodeUnique(data.dzoCode)) {
            alert(DZO_CODE_NOT_UNIQUE);
            return;
        }

        Promise.all(this.uploadFiles(dzoCode))
            .then( () => {
                const { editingDzo, staticUrl, categoryIdList } = this.state;
                const dzoDto = {
                    ...data,
                    description: (data.description === '') ? null : data.description,
                    header: (data.header === '') ? null : data.header,
                    webUrl: (data.webUrl === '') ? null : data.webUrl,
                    cardUrl: (editingDzo.cardUrl) ? editingDzo.cardUrl.slice(staticUrl.length) : editingDzo.cardUrl,
                    screenUrl: (editingDzo.screenUrl) ? editingDzo.screenUrl.slice(staticUrl.length) : editingDzo.screenUrl,
                    logoUrl: (editingDzo.logoUrl) ? editingDzo.logoUrl.slice(staticUrl.length) : editingDzo.logoUrl,
                    categoryIdList,
                    behaviorId: editingDzo.behaviorId
                };

                if (editingDzo.id != null) {
                    updateDzo(editingDzo.id, {
                        ...dzoDto,
                        dzoName: editingDzo.name,
                        dzoCode: editingDzo.dzoCode
                    })
                        .then(() => this.reloadDzo(dzoDto))
                        .catch(error => console.warn(error.message));
                } else {
                    addDzo(dzoDto)
                        .then(dzoId => this.pushToDzoList(dzoId, dzoDto))
                        .catch(error => console.warn(error.message));
                }
            })
            .catch(error => {
                alert(IMAGE_UPLOAD_ERROR);
                console.error(error.message);
            });
    };

    appUrlSubmit = () => {
        const { editingAppType, editingAppUrl, editingDzo, dzoList } = this.state;

        if (!editingAppType) {
            alert(SET_APPLICATION_TYPE);
            return;
        }
        if (!isRequired(editingAppUrl)) {
            alert(SET_APPLICATION_URL);
            return;
        }

        addApplication({ dzoId: editingDzo.id, applicationType: editingAppType, applicationUrl: editingAppUrl })
            .then( response => {
                const newDzoList = dzoList.slice();
                const curDzo = newDzoList.find(elem => (elem.dzoId === editingDzo.id));

                if (!curDzo.applicationList) {
                    curDzo.applicationList = [];
                    curDzo.applicationList.push({ 
                        applicationId: response.id, applicationType: editingAppType, 
                        applicationUrl: editingAppUrl, dzoId: editingDzo.id
                    });
                } else {
                    if (!curDzo.applicationList.find(app => {
                        if (app.applicationType === editingAppType) {
                            app.applicationUrl = editingAppUrl;
                            return true;
                        }})
                    ) {
                        curDzo.applicationList.push({
                            applicationId: response.id, applicationType: editingAppType,
                            applicationUrl: editingAppUrl, dzoId: editingDzo.id
                        });
                    }
                }
                this.setState({ dzoList: newDzoList }, this.closeModal);
            })
            .catch(error => console.error(error.message));
    };

    renderDzoList = () => {
        const { dzoList } = this.state;
        const isSuccess = Array.isArray(dzoList);
        return (
            <Fragment>
                {
                    isSuccess ? (
                        dzoList.length ?
                            dzoList.map((dzo, i) =>
                                <DzoItem
                                    key={ `dzoItem-${i}` }
                                    handleDelete={ this.handleDelete }
                                    handleEdit={ this.handleEdit }
                                    handleAddAppLink={ this.handleAddAppLink }
                                    { ...dzo }
                                />
                            ) : <LoadingStatus loading />
                    ) : <LoadingStatus />
                }
            </Fragment>
        );
    };

    renderModifyModal = () => (
        <CustomModal
            isOpen={ this.state.isOpen }
            onRequestClose={ this.closeModal }>
            {(this.state.editingAppList !== null) ? this.renderAppEditModalForm() : this.renderModalForm()}
        </CustomModal>
    );

    render() {
        const openWithParam = () => {
            this.openModal();
        };
        return (
            <div className={ styles.dzoPageWrapper }>
                { this.renderModifyModal() }
                <div className={ styles.headerSection }>
                    <h3>{DZO_LIST_TITLE}</h3>
                    <div>
                        <Button
                            onClick={ openWithParam }
                            label={ ADD_DZO_TITLE }
                            font="roboto"
                            type="green"
                        />
                    </div>
                </div>
                <div className={ styles.dzoList }>
                    {this.renderDzoList()}
                </div>
            </div>
        );
    }
}

export default DzoPage;
