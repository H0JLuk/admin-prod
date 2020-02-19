import React, { Component, Fragment } from 'react';
import {uploadFile, getStaticUrl} from '../../api/services/adminService';
import {
    addDzo,
    deleteDzo,
    getDzoList,
    updateDzo,
    getBehaviorTypes} from '../../api/services/dzoService';
import {getCategoryList} from '../../api/services/categoryService';
import {DZO_EDIT_FROM, DZO_ADD_FROM} from '../../components/Form/forms';
import {getErrorText} from '../../constants/errors';
import CustomModal from '../../components/CustomModal/CustomModal';
import DzoItem from '../../components/DzoItem/DzoItem';
import Form from '../../components/Form/Form';
import Button from '../../components/Button/Button';
import cross from '../../static/images/cross.svg';
import styles from './DzoPage.module.css';
import {populateFormWithData} from "../../components/Form/formHelper"
import {CLOSE, SAVE} from '../../components/Button/ButtonLables'

const DZOLIST_GET_ERROR = 'Ошибка получения ДЗО!';
const DZO_DELETE_ERROR = 'Ошибка удаления ДЗО!';
const IMAGE_UPLOAD_ERROR = 'Ошибка загрузки изображения!';
const ADD_DZO_TITLE = 'Добавить ДЗО';
const REMOVE_QUESTION = 'Удалить категорию?';
const DZO_LIST_TITLE = 'Список ДЗО';
const LOADING_LIST_LABEL = 'Загрузка';
const DZO_DIR = 'dzo';
const SET_BEHAVIOR = 'Укажите поведение.'
const DZO_CODE_NOT_UNIQUE = 'ДЗО с таким кодом уже есть!'

const LoadingStatus = ({ loading }) => (
    <p className={styles.loadingLabel}>{ loading ? LOADING_LIST_LABEL : DZOLIST_GET_ERROR }</p>
)

class DzoPage extends Component {
    constructor(props) {
        super(props);
        this.dzoRef = React.createRef();
        this.state = {
            editingDzo: {
                id: null,
                name: null,
                screenUrl: null,
                logoUrl: null,
                header: null,
                description: null,
                cardUrl: null,
                dzoCode: null,
                webUrl: null,
                behaviorType: null,
                behaviorId: '',
            },
            cardFile: null,
            screenFile: null,
            logoFile: null,
            staticUrl: null,
            behaviorTypes: [],
            dzoList: [],
            categories: [],
            categoryIdList: [],
            isOpen: false,
            formError: null
        };
        this.handleChange = this.handleChange.bind(this);
        this.handleClick = this.handleClick.bind(this);
        this.handleImageSelect = this.handleImageSelect.bind(this);
        this.uploadFiles = this.uploadFiles.bind(this);
        this.reloadDzo = this.reloadDzo.bind(this);
        this.pushToDzoList = this.pushToDzoList.bind(this);
    }

    componentDidMount() {
        getStaticUrl().then(staticUrl => {
            this.setState({ staticUrl: staticUrl })
            return getDzoList();
        }).then(response => {
            const { dzoDtoList } = response
            this.setState({ dzoList: dzoDtoList })
            return getBehaviorTypes();
        }).then(behaviorTypes => {
            this.setState({ behaviorTypes: behaviorTypes })
            return getCategoryList()
        }).then(response => {
            const { categoryList } = response
            this.setState({ categories: categoryList })
        }).catch(() => {
            this.setState({ staticUrl: null, dzoList: [], behaviorTypes: [], categories: [] })
        });
    }

    clearState = () => { this.setState({ editingDzo: { id: null, name: null, screenUrl: null, logoUrl: null, header: null, description: null,
                cardUrl: null, dzoCode: null, webUrl: null, behaviorType: null, behaviorId: '' }, categoryIdList: [] })
    }

    openModal = () => { this.setState({ isOpen: true }) }

    closeModal = () => { this.setState( {isOpen: false}, this.clearState)

    }

    handleDelete = (id) => {
        if (window.confirm(REMOVE_QUESTION)) {
            deleteDzo(id).then(() => {
                const croppedDzoList = this.state.dzoList.filter(dzo => dzo.dzoId !== id)
                this.setState({ dzoList: croppedDzoList })
            }).catch(() => { alert(DZO_DELETE_ERROR) })
        }
    }

    handleEdit = (id, name, screenUrl, logoUrl, header, description, cardUrl, dzoCode, webUrl, behaviorType, categoryList) => {
        this.state.behaviorTypes.find(elem => {
            if (elem.behaviorType === behaviorType) {
                this.setState({
                    editingDzo: {
                        id, name, screenUrl, logoUrl, header, description, cardUrl, dzoCode, webUrl,
                        behaviorId: elem.behaviorId, behaviorType: elem.behaviorType
                    }
                })
            }
        })
        let categoryIdList = [];
        categoryList.forEach(elem => {
            categoryIdList.push(elem.categoryId)
        })
        this.setState({
            categoryIdList: categoryIdList,
        }, () => { this.openModal() })
    }

    handleChange(event) {
        this.setState({ editingDzo: {...this.state.editingDzo,
                behaviorId: event.target.value,
                behaviorType: event.target.attributes[0].ownerElement.selectedOptions[0].text
        }});
    }
    handleClick(event) {
        const categoryList = [];
        this.state.categoryIdList.forEach(elem => {
            categoryList.push(elem.toString())
        });
        if (event.target.multiple)
            return;
        const index = categoryList.indexOf(event.target.value);
        if (index !== -1) {
            categoryList.splice(index, 1)}
        else {
        categoryList.push(event.target.value)
        }
        this.setState({categoryIdList: categoryList});
    }

    handleImageSelect(event) {
        switch (event.target.id) {
            case ('dzoCardImage') : this.setState({cardFile: event.target.files[0]})
                break;
            case ('dzoScreenImage') : this.setState({screenFile: event.target.files[0]})
                break;
            case ('dzoLogoImage') : this.setState({logoFile: event.target.files[0]})
                break;
            default : return;
        }
    }

    uploadFiles() {
        let promiseArray = [];
        let imageName = `${DZO_DIR}/${this.state.editingDzo.dzoCode}/`;
        if (this.state.cardFile !== null) {
            promiseArray.push(uploadFile(this.state.cardFile, imageName + this.state.cardFile.name)
                .then(response => {
                    this.setState({editingDzo: {...this.state.editingDzo, cardUrl: this.state.staticUrl + response.path}})
                })
            )
        }
        if (this.state.screenFile !== null) {
            promiseArray.push(uploadFile(this.state.screenFile, imageName + this.state.screenFile.name)
                .then(response => {
                    this.setState({editingDzo: {...this.state.editingDzo, screenUrl: this.state.staticUrl + response.path}})
                })
            )
        }
        if (this.state.logoFile !== null) {
            promiseArray.push(uploadFile(this.state.logoFile, imageName + this.state.logoFile.name)
                .then(response => {
                    this.setState({editingDzo: {...this.state.editingDzo, logoUrl: this.state.staticUrl + response.path}})
                })
            )
        }
        return promiseArray
    }

    renderModalForm = () => {
        const {formError, editingDzo, categories, behaviorTypes} = this.state;
        const formData = editingDzo.id != null ? populateFormWithData(DZO_EDIT_FROM, {
                  header: editingDzo.header,
                  description: editingDzo.description,
                  webUrl: editingDzo.webUrl
        }) : DZO_ADD_FROM
        return (
            <div className={styles.modalForm}>
                <img src={cross} onClick={this.closeModal} className={styles.crossSvg} alt={CLOSE} />
                <Form
                    data={formData}
                    buttonText={SAVE}
                    onSubmit={this.onSubmit}
                    formClassName={styles.dzoForm}
                    fieldClassName={styles.dzoForm__field}
                    activeLabelClassName={styles.dzoForm__field__activeLabel}
                    buttonClassName={styles.dzoForm__button}
                    errorText={getErrorText(formError)}
                    formError={!!formError}
                    errorClassName={styles.error}
                />
                <form className={styles.dzoForm}>
                    <label className={styles.dzoForm__field__activeLabel}>
                        Категории: <br/>
                        <select className={styles.dzoForm} value={this.state.categoryIdList} readOnly={true} onClick={this.handleClick} multiple={true}>
                            {categories.map(option => { return <option id={option} key={`category_${option.categoryId}`} value={option.categoryId.valueOf()}>{option.categoryName}</option>
                            })}
                        </select>
                    </label>
                </form>
                <form className={styles.dzoForm}>
                    <label className={styles.dzoForm__field__activeLabel}>
                        Тип поведения:<br/>
                        <select className={styles.dzoForm} value={this.state.editingDzo.behaviorId} onChange={this.handleChange}>
                            <option key={0} value={''}> Не задано </option>
                            {behaviorTypes.map(option => { return <option id={option} key={`behavior_${option.behaviorId}`} value={option.behaviorId}>{option.behaviorType}</option>
                            })}
                        </select>
                    </label>
                </form>
                <form className={styles.imageUploadContainer}>
                    <label htmlFor="dzoImageInput">Изображение ДЗО card</label>
                    <input type="file" id="dzoCardImage" ref={this.dzoRef} className={styles.imageUpload} onChange={this.handleImageSelect}/>
                </form>
                <form className={styles.imageUploadContainer}>
                    <label htmlFor="dzoImageInput">Изображение ДЗО screen</label>
                    <input type="file" id="dzoScreenImage" ref={this.dzoRef} className={styles.imageUpload} onChange={this.handleImageSelect}/>
                </form>
                <form className={styles.imageUploadContainer}>
                    <label htmlFor="dzoImageInput">Изображение ДЗО logo</label>
                    <input type="file" id="dzoLogoImage" ref={this.dzoRef} className={styles.imageUpload} onChange={this.handleImageSelect}/>
                </form>
            </div>
        )
    }

    checkDzoCodeUnique(dzoCode) {
        return this.state.dzoList.find(dzo => {
            if (dzo.dzoCode === dzoCode) {
                return true;
            }
        })
    }

    reloadDzo(dzoDto) {
        const dzoList = this.state.dzoList.slice();
        dzoList.find(elem => {
            if (elem.dzoId === this.state.editingDzo.id) {
                if (this.state.cardFile !== null && elem.cardUrl === this.state.editingDzo.cardUrl) {
                    elem.cardUrl = ''
                }
                if (this.state.screenFile !== null && elem.screenUrl === this.state.editingDzo.screenUrl) {
                    elem.screenUrl = ''
                }
                if (this.state.logoFile !== null && elem.logoUrl === this.state.editingDzo.logoUrl) {
                    elem.logoUrl = ''
                }
                this.setState({ dzoList: dzoList})
                elem.name = this.state.editingDzo.name
                elem.header = dzoDto.header
                elem.description = dzoDto.description
                elem.cardUrl = this.state.editingDzo.cardUrl
                elem.screenUrl = this.state.editingDzo.screenUrl
                elem.logoUrl = this.state.editingDzo.logoUrl
                elem.webUrl = dzoDto.webUrl
                elem.behaviorType = this.state.editingDzo.behaviorType
                elem.categoryList = this.state.categoryIdList.map(value => {
                    return {categoryId: value}
                })
            }
        })
        this.setState({ dzoList: dzoList }, this.closeModal)

    }

    pushToDzoList(dzoId, dzoDto) {
        const { id } = dzoId
        const categoryList = this.state.categoryIdList.map(value => {
            return {categoryId: value}
        })
        const newDzoItem = {...dzoDto, cardUrl: this.state.editingDzo.cardUrl, screenUrl: this.state.editingDzo.screenUrl,
            logoUrl: this.state.editingDzo.logoUrl, dzoId: id, behaviorType: this.state.editingDzo.behaviorType, categoryList }
        const dzoList = [newDzoItem, ...this.state.dzoList]
        this.setState({ dzoList: dzoList }, this.closeModal)

    }

    onSubmit = (data) => {
        if (!this.state.editingDzo.behaviorId) {
            alert(SET_BEHAVIOR)
            return;
        }
        if (this.checkDzoCodeUnique(data.dzoCode)) {
            alert(DZO_CODE_NOT_UNIQUE)
            return;
        }
        Promise.all(this.uploadFiles())
            .then(() => {
                let dzoDto = {
                    ...data,
                    description: (data.description === '') ? null : data.description,
                    header: (data.header === '') ? null : data.header,
                    webUrl: (data.webUrl === '') ? null : data.webUrl,
                    cardUrl: (this.state.editingDzo.cardUrl) ? this.state.editingDzo.cardUrl.slice(this.state.staticUrl.length) : this.state.editingDzo.cardUrl,
                    screenUrl: (this.state.editingDzo.screenUrl) ? this.state.editingDzo.screenUrl.slice(this.state.staticUrl.length) : this.state.editingDzo.screenUrl,
                    logoUrl: (this.state.editingDzo.logoUrl) ? this.state.editingDzo.logoUrl.slice(this.state.staticUrl.length) : this.state.editingDzo.logoUrl,
                    categoryIdList: this.state.categoryIdList,
                    behaviorId: this.state.editingDzo.behaviorId
                }
                if (this.state.editingDzo.id !== null) {
                    updateDzo(this.state.editingDzo.id, {
                        ...dzoDto,
                        dzoName: this.state.editingDzo.name,
                        dzoCode: this.state.editingDzo.dzoCode
                    })
                        .then(() => {
                            this.reloadDzo(dzoDto)
                        })
                        .catch(error => {
                            console.log(error.message)
                        })
                } else {
                    addDzo(dzoDto)
                        .then(dzoId => {
                            this.pushToDzoList(dzoId, dzoDto)
                        })
                        .catch(error => {
                            console.log(error.message)
                        })
                }
            })
            .catch(error => {
                alert(IMAGE_UPLOAD_ERROR)
                console.log(error.message)
            })
    }

    renderDzoList = () => {
        const { dzoList } = this.state
        const isSuccess = Array.isArray(dzoList)
        return (
            <Fragment>
                {
                    isSuccess ? (
                        dzoList.length ?
                            dzoList.map((dzo, i) =>
                                <DzoItem
                                    key={`dzoItem-${i}`}
                                    handleDelete={this.handleDelete}
                                    handleEdit={this.handleEdit}
                                    {...dzo}
                                />
                            ) : <LoadingStatus loading />
                    ) : <LoadingStatus />
                }
            </Fragment>
        )
    }

    renderModifyModal = () => (
        <CustomModal
            isOpen={this.state.isOpen}
            onRequestClose={this.closeModal}>
            {this.renderModalForm()}
        </CustomModal>
    )

    render() {
        const openWithParam = () => {
            this.openModal()
        }
        return (
            <div className={styles.dzoPageWrapper}>
                { this.renderModifyModal() }
                <div className={styles.headerSection}>
                    <h3>{DZO_LIST_TITLE}</h3>
                    <div>
                        <Button
                            onClick={openWithParam}
                            label={ADD_DZO_TITLE}
                            font="roboto"
                            type="green"
                        />
                    </div>
                </div>
                <div className={styles.dzoList}>
                    {this.renderDzoList()}
                </div>
            </div>
        )
    }
}

export default DzoPage
