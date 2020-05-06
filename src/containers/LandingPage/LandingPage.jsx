import React, { Component, Fragment } from 'react';
import { getStaticUrl, swapPositions, uploadFile } from '../../api/services/adminService';
import {
    addLanding,
    deleteLanding,
    getLandingList,
    updateLanding
} from '../../api/services/landingService';
import { LANDING_EDIT_FORM } from '../../components/Form/forms';
import { getErrorText } from '../../constants/errors';
import CustomModal from '../../components/CustomModal/CustomModal';
import LandingItem from '../../components/LandingItem/LandingItem';
import { UP, DOWN } from '../../constants/movementDirections';
import Form from '../../components/Form/Form';
import Button from '../../components/Button/Button';
import cross from '../../static/images/cross.svg';
import styles from './LandingPage.module.css';
import { populateFormWithData } from "../../components/Form/formHelper"
import { CLOSE, SAVE } from '../../components/Button/ButtonLables'
import {getClientAppCodeHeader} from "../../api/services/sessionService";

const LANDINGS_GET_ERROR = 'Ошибка получения лендингов!';
const LANDINGS_DELETE_ERROR = 'Ошибка удаления лендинга!';
const IMAGE_UPLOAD_ERROR = 'Ошибка загрузки изображения!';
const LANDINGS_MOVE_ERROR = 'Ошибка изменения порядка лендингов';
const ADD_LANDING_TITLE = 'Добавить лендинг';
const REMOVE_QUESTION = 'Удалить лендинг?';
const LANDINGS_LIST_TITLE = 'Список лендингов';
const LOADING_LIST_LABEL = 'Загрузка';
const UPLOAD_IMAGE_PLEASE = 'Пожалуйста загрузите изображение!';
const LANDING_DIR = 'landing';

const LoadingStatus = ({ loading }) => (
    <p className={styles.loadingLabel}>{ loading ? LOADING_LIST_LABEL : LANDINGS_GET_ERROR }</p>
);

class LandingPage extends Component {
    constructor(props) {
        super(props);
        this.landingRef = React.createRef();
        this.state = {
            editingLanding: {
                landingId: null,
                header: null,
                description: null,
                imageUrl: null,
            },
            landings: [],
            isOpen: false,
            formError: null,
            staticServerUrl: null
        }
    }

    componentDidMount() {
        getStaticUrl().then(serverUrl => {
            this.setState({ staticServerUrl: serverUrl });
            return getLandingList();
        }).then(response => {
            const { landingDtoList } = response;
            this.setState({ landings: landingDtoList })
        }).catch(() => {
            this.setState({ staticServerUrl: null, landings: [] })
        })
    }

    clearState = () => {
        this.setState({ editingLanding: { landingId: null, header: null, description: null, imageUrl: null } })
    };

    openModal = () => { this.setState({ isOpen: true }) };

    closeModal = () => { this.setState( { isOpen: false }, this.clearState) };

    handleDelete = (id) => {
        if (window.confirm(REMOVE_QUESTION)) {
            deleteLanding(id).then(() => {
                const croppedLandings = this.state.landings.filter(landing => landing.landingId !== id);
                this.setState({ landings: croppedLandings })
            }).catch(() => { alert(LANDINGS_DELETE_ERROR) })
        }
    };

    handleMove = (id, direction) => {
        const {landings} = this.state;
        let position = landings.findIndex((i) => i.landingId === id);
        if (position < 0) {
            throw new Error('Given item not found.')
        } else if ((direction === UP && position === 0) || (direction === DOWN && position === landings.length - 1)) {
            return
        }
        const item = landings[position];
        const newLandings = landings.filter((i) => i.landingId !== id);
        newLandings.splice(position + direction, 0, item);
        swapPositions(id, landings[position + direction].landingId, LANDING_DIR).then(() => {
            this.setState({landings: newLandings})
        }).catch(() => { alert(LANDINGS_MOVE_ERROR) })
    };

    handleEdit = (landingId, header, description, imageUrl) => {
        this.setState({editingLanding: {landingId, header, description, imageUrl}}, () => { this.openModal() })
    };

    renderModalForm = () => {
        const {formError, editingLanding } = this.state;
        const formData = editingLanding.landingId !== null ? populateFormWithData(LANDING_EDIT_FORM, {
            landingId: editingLanding.landingId,
            header: editingLanding.header,
            description: editingLanding.description,
            imageUrl: editingLanding.imageUrl
        }) : LANDING_EDIT_FORM;
        return (
            <div className={styles.modalForm}>
            <img src={cross} onClick={this.closeModal} className={styles.crossSvg} alt={CLOSE} />
                <Form
                    data={formData}
                    buttonText={SAVE}
                    onSubmit={this.onSubmit}
                    formClassName={styles.landingForm}
                    fieldClassName={styles.landingForm__field}
                    activeLabelClassName={styles.landingForm__field__activeLabel}
                    buttonClassName={styles.landingForm__button}
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
    };

    reloadLandings = (data, url) => {
        const landings = this.state.landings.slice();
        landings.find(elem => {
            if (elem.landingId === this.state.editingLanding.landingId) {
                if (this.landingRef.current.files.length > 0 && elem.imageUrl === url) {
                    elem.imageUrl = '';
                    this.setState(landings)
                }
                elem.imageUrl = url;
                elem.header = data.header;
                elem.description = data.description
            }
        });
        this.setState({landings}, this.closeModal)
    };

    onSubmit = (data) => {
        if (!this.landingRef.current.files.length && !this.state.editingLanding.imageUrl) {
            alert(UPLOAD_IMAGE_PLEASE);
            return;
        }
        let landingDto;
        if (this.state.editingLanding.landingId !== null && !this.landingRef.current.files.length) {
            landingDto = { ...data, imageUrl: this.state.editingLanding.imageUrl.slice(this.state.staticServerUrl.length) };
            updateLanding(this.state.editingLanding.landingId, landingDto)
                .catch(error => { console.log(error.message) });
            this.reloadLandings(data, this.state.editingLanding.imageUrl)
        } else {
            const imageFile = this.landingRef.current.files[0];
            const imageName = `${getClientAppCodeHeader()}/${LANDING_DIR}/${imageFile.name}`;

            uploadFile(imageFile, imageName)
                .then(response => {
                    landingDto = {...data, imageUrl: response.path};
                    if (this.state.editingLanding.landingId !== null) {
                        return updateLanding(this.state.editingLanding.landingId, landingDto)
                    } else {
                        return addLanding(landingDto)
                    }
                })
                .then(response => {
                    if (this.state.editingLanding.landingId !== null) {
                        this.reloadLandings(data, this.state.staticServerUrl + landingDto.imageUrl)
                    } else {
                        const { id } = response;
                        const newLandingItem = {...landingDto, landingId: id, imageUrl: this.state.staticServerUrl + landingDto.imageUrl};
                        const landings = [...this.state.landings, newLandingItem];
                        this.setState({landings}, this.closeModal)
                    }
                })
                .catch(error => {
                    alert(IMAGE_UPLOAD_ERROR);
                    console.log(error.message)
                })
        }
    };

    renderLandingsList = () => {
        const { landings } = this.state;
        const isSuccess = Array.isArray(landings);
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
    };

    renderModifyModal = () => (
        <CustomModal
            isOpen={this.state.isOpen}
            onRequestClose={this.closeModal}>
            {this.renderModalForm()}
        </CustomModal>
    );

    render() {
        const openWithParam = () => {
            this.openModal()
        };
        return (
            <div className={styles.landingPageWrapper}>
                { this.renderModifyModal() }
                <div className={styles.headerSection}>
                    <h3>{LANDINGS_LIST_TITLE}</h3>
                    <div>
                        <Button
                            onClick={openWithParam}
                            label={ADD_LANDING_TITLE}
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
