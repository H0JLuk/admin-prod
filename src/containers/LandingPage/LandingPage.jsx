import React, { Component, Fragment } from 'react';
import {
    addLanding,
    deleteLanding,
    getLandingList,
    getStaticServerUrl,
    reorder,
    updateLanding,
    uploadFile
} from '../../api/services/adminService';
import {LANDING_EDIT_FORM} from '../../components/Form/forms';
import {getErrorText} from '../../constants/errors';
import CustomModal from '../../components/CustomModal/CustomModal';
import {LandingItem, UP, DOWN} from '../../components/LandingItem/LandingItem';
import Form from '../../components/Form/Form';
import Button from '../../components/Button/Button';
import cross from '../../static/images/cross.svg';
import styles from './LandingPage.module.css';
import {populateFormWithData} from "../../components/Form/formHelper"


const LANDINGS_GET_ERROR = 'Ошибка получения лендингов!';
const LANDINGS_DELETE_ERROR = 'Ошибка удаления лендинга!';
const LANDINGS_MOVE_ERROR = 'Ошибка изменения порядка лендингов'
const ADD_LANDING_TITLE = 'Добавить лендинг';
const REMOVE_QUESTION = 'Удалить лендинг?';
const LANDINGS_LIST_TITLE = 'Список лендингов';
const LOADING_LIST_LABEL = 'Загрузка';
const UPLOAD_IMAGE_PLEASE = 'Пожалуйста загрузите изображение!';
const LANDING_DIR = 'landing/';

const LoadingStatus = ({ loading }) => (
    <p className={styles.loadingLabel}>{ loading ? LOADING_LIST_LABEL : LANDINGS_GET_ERROR }</p>
)

class LandingPage extends Component {
    constructor(props) {
        super(props);
        this.landingRef = React.createRef();
        this.state = {
            editingLandingIdx: null,
            editingLandingHeader: null,
            editingLandingDescription: null,
            editingImageUrl: null,
            landings: [],
            isOpen: false,
            formError: null,
            staticServerUrl: null
        }
    }

    componentDidMount() {
        getStaticServerUrl().then(response => {
            const serverUrl = response
            this.setState({ staticServerUrl: serverUrl })
        }).catch(() => {
            this.setState({ staticServerUrl: null })
        })
        getLandingList().then(response => {
            const { landingDtoList } = response
            this.setState({ landings: landingDtoList })
        }).catch(() => {
            this.setState({ landings: null })
        })


    }

    openModal = () => { this.setState({ isOpen: true }) }

    closeModal = () => { this.setState({ isOpen: false }) }

    handleDelete = (id) => {
        if (window.confirm(REMOVE_QUESTION)) {
            deleteLanding(id).then(() => {
                const croppedLandings = this.state.landings.filter(landing => landing.landingId !== id)
                this.setState({ landings: croppedLandings })
            }).catch(() => { alert(LANDINGS_DELETE_ERROR) })
        }
    }

    handleMove = (id, direction) => {
        const {landings} = this.state
        let position = landings.findIndex((i) => i.landingId === id)
        if (position < 0) {
            throw new Error('Given item not found.')
        } else if ((direction === UP && position === 0) || (direction === DOWN && position === landings.length - 1)) {
            return
        }
        const item = landings[position]
        const newLandings = landings.filter((i) => i.landingId !== id)
        newLandings.splice(position + direction, 0, item)
        const idMap = newLandings.map(elem => elem.landingId)
        reorder(idMap, LANDING_DIR).then(() => {
            this.setState({landings: newLandings})
        }).catch(() => { alert(LANDINGS_MOVE_ERROR) })
    }

    handleEdit = (id, header, description, url) => {
        this.setState({
                    editingLandingIdx: id,
                    editingLandingHeader: header,
                    editingLandingDescription: description,
                    editingImageUrl: url
            }, () => { this.openModal() })
    }

    renderModalForm = () => {
        const {formError, editingLandingIdx, editingLandingHeader, editingLandingDescription, editingImageUrl} = this.state;
        const formData = editingLandingIdx !== null ? populateFormWithData(LANDING_EDIT_FORM, {
            landingId: editingLandingIdx,
            header: editingLandingHeader,
            description: editingLandingDescription,
            imageUrl: editingImageUrl
        }) : LANDING_EDIT_FORM;
        return (
            <div className={styles.modalForm}>
                <img src={cross} onClick={this.closeModal} className={styles.crossSvg} alt="Закрыть" />
                <Form
                    data={formData}
                    buttonText='Сохранить'
                    onSubmit={this.onSubmit}
                    formClassName={styles.loginForm}
                    fieldClassName={styles.loginForm__field}
                    activeLabelClassName={styles.loginForm__field__activeLabel}
                    buttonClassName={styles.loginForm__button}
                    errorText={getErrorText(formError)}
                    formError={!!formError}
                    errorClassName={styles.error}
                />
                <form className={styles.imageUploadContainer}>
                    <label htmlFor="landingImageInput">Изображение лендинга</label>
                    <input type="file" id="landingImageInput" ref={this.landingRef} className={styles.imageUpload} />
                </form>
            </div>
        )
    }

    reloadLandings = (data, url) => {
        const landings = this.state.landings.slice()
        landings.forEach(elem => {
            if (elem.landingId === this.state.editingLandingIdx) {
                elem.imageUrl = url
                elem.header = data.header
                elem.description = data.description
            }
        })
        this.setState({landings: landings, isOpen: false})
    }

    onSubmit = (data) => {
        if (!this.landingRef.current.files.length && (this.state.editingImageUrl == null || !this.state.editingImageUrl.length)) {     // on create case!
            alert(UPLOAD_IMAGE_PLEASE);
            return;
        }
        let landingDto;
        if (this.state.editingLandingIdx !== null && !this.landingRef.current.files.length) {
            landingDto = {
                ...data,
                imageUrl: this.state.editingImageUrl.slice(this.state.staticServerUrl.length)
            }
            updateLanding(this.state.editingLandingIdx, landingDto)
                .catch(error => {
                    console.log(error.message)
                })
            this.reloadLandings(data, this.state.editingImageUrl)
        } else {
            const imageFile = this.landingRef.current.files[0];
            const imageName = LANDING_DIR + imageFile.name;

            uploadFile(imageFile, imageName)
                .then(response => {
                    landingDto = {...data, imageUrl: response.path}
                    if (this.state.editingLandingIdx !== null) {
                        return updateLanding(this.state.editingLandingIdx, landingDto)
                    } else {
                        return addLanding(landingDto)
                    }
                })
                .then(response => {
                    if (this.state.editingLandingIdx !== null) {
                        this.reloadLandings(data, this.state.staticServerUrl + landingDto.imageUrl)
                    } else {
                        const {id: landingId = 0} = response
                        const newLandingItem = {...landingDto, landingId, imageUrl: this.state.staticServerUrl + landingDto.imageUrl}
                        const landings = [...this.state.landings, newLandingItem]
                        this.setState({landings, isOpen: false})
                    }
                })
                .catch(error => {
                    console.log(error.message)
                })
        }
    }

    renderLandingsList = () => {
        const { landings } = this.state
        const isSuccess = Array.isArray(landings)
        return (
            <Fragment>
                {
                    isSuccess ? (
                        landings.length ?
                            landings.map((landing, i) =>
                                <LandingItem
                                    key={`landingItem-${i}`}
                                    handleDelete={this.handleDelete}
                                    handleEdit={this.handleEdit}
                                    handleMove={this.handleMove}
                                    {...landing}
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
        const openWithParam = () => { this.setState({
                editingLandingIdx: null,
                editingLandingHeader: null,
                editingLandingDescription: null,
                editingImageUrl: null,
            }, this.openModal) }
        return (
            <div className={styles.landingPageWrapper}>
                { this.renderModifyModal() }
                <div className={styles.headerSection}>
                    <h3>{LANDINGS_LIST_TITLE}</h3>
                    <div>
                        <Button
                            onClick={openWithParam}
                            label={ADD_LANDING_TITLE}
                            className={styles.container__button}
                            font="roboto"
                            type="green"
                        />
                    </div>
                </div>
                <div className={styles.landingList}>
                    {this.renderLandingsList()}
                </div>
            </div>
        )
    }
}

export default LandingPage
