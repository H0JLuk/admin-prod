import React, { Component, Fragment } from 'react';
import { swapPositions, uploadFile } from '../../api/services/adminService';
import {
    addLanding,
    deleteLanding,
    getLandingList,
    updateLanding
} from '../../api/services/landingService';
import { getStaticUrl } from '../../api/services/settingsService';
import { LANDING_EDIT_FORM } from '../../components/Form/forms';
import { getErrorText } from '../../constants/errors';
import CustomModal from '../../components/CustomModal/CustomModal';
import LandingItem from '../../components/LandingItem/LandingItem';
import { UP, DOWN } from '../../constants/movementDirections';
import Form from '../../components/Form/Form';
import Button from '../../components/Button/Button';
import cross from '../../static/images/cross.svg';
import styles from './PresentationPage.module.css';
import { populateFormWithData } from '../../components/Form/formHelper';
import ButtonLabels from '../../components/Button/ButtonLables';
import { getAppCode } from '../../api/services/sessionService';
import Header from '../../components/Header/Header';


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
    <p className={ styles.loadingLabel }>{ loading ? LOADING_LIST_LABEL : LANDINGS_GET_ERROR }</p>
);

const initialEditingLanding = {
    landingId: null,
    header: null,
    description: null,
    imageUrl: null,
};

class PresentationPage extends Component {
    constructor(props) {
        super(props);
        this.landingRef = React.createRef();
        this.state = {
            editingLanding: initialEditingLanding,
            landings: [],
            isOpen: false,
            formError: null,
            staticServerUrl: getStaticUrl()
        };
    }

    componentDidMount() {
        getLandingList()
            .then(response => {
                const { landingDtoList } = response;
                this.setState({ landings: landingDtoList });
            })
            .catch(() => this.setState({ landings: [] }));
    }

    clearState = () => this.setState({ editingLanding: initialEditingLanding });

    openModal = () => this.setState({ isOpen: true });

    closeModal = () => this.setState({ isOpen: false }, this.clearState);

    handleDelete = (id) => {
        if (window.confirm(REMOVE_QUESTION)) {
            deleteLanding(id)
                .then(() => {
                    const croppedLandings = this.state.landings.filter(landing => landing.landingId !== id);
                    this.setState({ landings: croppedLandings });
                })
                .catch(() => alert(LANDINGS_DELETE_ERROR));
        }
    };

    handleMove = (id, direction) => {
        const { landings } = this.state;
        let position = landings.findIndex((i) => i.landingId === id);
        if (position < 0) {
            throw new Error('Given item not found.');
        } else if ((direction === UP && position === 0) || (direction === DOWN && position === landings.length - 1)) {
            return;
        }
        const item = landings[position];
        const newLandings = landings.filter((i) => i.landingId !== id);
        newLandings.splice(position + direction, 0, item);
        swapPositions(id, landings[position + direction].landingId, LANDING_DIR)
            .then(() => this.setState({ landings: newLandings }))
            .catch(() => alert(LANDINGS_MOVE_ERROR));
    };

    handleEdit = (landingId, header, description, imageUrl) => this.setState({
        editingLanding: { landingId, header, description, imageUrl }
    }, this.openModal);

    renderModalForm = () => {
        const { formError, editingLanding } = this.state;
        const formData = editingLanding.landingId !== null ? populateFormWithData(LANDING_EDIT_FORM, {
            landingId: editingLanding.landingId,
            header: editingLanding.header,
            description: editingLanding.description,
            imageUrl: editingLanding.imageUrl
        }) : LANDING_EDIT_FORM;
        return (
            <div className={ styles.modalForm }>
            <img src={ cross } onClick={ this.closeModal } className={ styles.crossSvg } alt={ ButtonLabels.CLOSE } />
                <Form
                    data={ formData }
                    buttonText={ ButtonLabels.SAVE }
                    onSubmit={ this.onSubmit }
                    formClassName={ styles.landingForm }
                    fieldClassName={ styles.landingForm__field }
                    activeLabelClassName={ styles.landingForm__field__activeLabel }
                    buttonClassName={ styles.landingForm__button }
                    errorText={ getErrorText(formError) }
                    formError={ !!formError }
                    errorClassName={ styles.error }
                />
                <form className={ styles.imageUploadContainer }>
                    <label htmlFor="landingImageInput">Изображение лендинга</label>
                    <input type="file" id="landingImageInput" ref={ this.landingRef } className={ styles.imageUpload } />
                </form>
            </div>
        );
    };

    reloadLandings = (data, url) => {
        const { landings, editingLanding: { landingId } } = this.state;
        const newLandings = landings.slice();
        newLandings.forEach(elem => {
            if (elem.landingId === landingId) {
                if (this.landingRef.current.files.length > 0 && elem.imageUrl === url) {
                    elem.imageUrl = '';
                    this.setState({ landings: newLandings });
                }
                elem.imageUrl = url;
                elem.header = data.header;
                elem.description = data.description;
            }
        });
        this.setState({ landings: newLandings }, this.closeModal);
    };

    onSubmit = (data) => {
        const { editingLanding: { imageUrl, landingId }, staticServerUrl } = this.state;
        if (!this.landingRef.current.files.length && !imageUrl) {
            alert(UPLOAD_IMAGE_PLEASE);
            return;
        }
        let landingDto;
        if (landingId !== null && !this.landingRef.current.files.length) {
            landingDto = { ...data, imageUrl: imageUrl.slice(staticServerUrl.length) };
            updateLanding(landingId, landingDto)
                .catch(error => console.log(error.message));
            this.reloadLandings(data, imageUrl);
        } else {
            const imageFile = this.landingRef.current.files[0];
            const imageName = `${getAppCode()}/${LANDING_DIR}/${imageFile.name}`;

            uploadFile(imageFile, imageName)
                .then(response => {
                    landingDto = { ...data, imageUrl: response.path };
                    if (landingId !== null) {
                        return updateLanding(landingId, landingDto);
                    } else {
                        return addLanding(landingDto);
                    }
                })
                .then(response => {
                    const imageUrl = `${this.state?.staticServerUrl}${landingDto?.imageUrl}`;
                    if (landingId !== null) {
                        this.reloadLandings(data, imageUrl);
                    } else {
                        const { id } = response;
                        const newLandingItem = { ...landingDto, landingId: id, imageUrl };
                        const landings = [...this.state.landings, newLandingItem];
                        this.setState({ landings }, this.closeModal);
                    }
                })
                .catch(error => {
                    alert(IMAGE_UPLOAD_ERROR);
                    console.log(error.message);
                });
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
                                    key={ `landingItem-${i}` }
                                    handleDelete={ this.handleDelete }
                                    handleEdit={ this.handleEdit }
                                    handleMove={ this.handleMove }
                                    { ...landing }
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
            {this.renderModalForm()}
        </CustomModal>
    );

    render() {
        const openWithParam = () => {
            this.openModal();
        };
        return (
            <div className={ styles.landingPageWrapper }>
                <Header buttonBack={ false } menuMode />
                <div className={ styles.landingContainer }>
                    { this.renderModifyModal() }
                    <div className={ styles.headerSection }>
                        <h3>{LANDINGS_LIST_TITLE}</h3>
                        <div>
                            <Button
                                onClick={ openWithParam }
                                label={ ADD_LANDING_TITLE }
                                font="roboto"
                                type="green"
                            />
                        </div>
                    </div>
                    <div className={ styles.landingList }>
                        {this.renderLandingsList()}
                    </div>
                </div>
            </div>
        );
    }
}

export default PresentationPage;
